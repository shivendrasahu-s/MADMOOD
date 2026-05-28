import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let reqBody = req.body;
    if (typeof reqBody === 'string') {
      try {
        reqBody = JSON.parse(reqBody);
      } catch (_) {}
    }
    const { to, body } = reqBody || {};

    if (!to || !body) {
      return res.status(400).json({ error: 'Missing to or body in request body' });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    if (accountSid && authToken && fromNumber) {
      console.log(`Sending Twilio SMS to ${to}...`);
      const authString = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authString}`,
          },
          body: new URLSearchParams({
            To: to,
            From: fromNumber,
            Body: body,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Twilio API returned error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return res.status(200).json({ success: true, provider: 'twilio', sid: data.sid });
    } else {
      console.warn('Twilio environment variables are not configured. Logging to console.');
      console.log(`[SIMULATED SMS] To: ${to}, Message: ${body}`);
      return res.status(200).json({
        success: true,
        provider: 'simulator',
        message: 'SMS accepted but simulated (configure TWILIO_ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER)',
      });
    }
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
