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
    const { to, subject, html } = reqBody || {};

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing to, subject, or html in request body' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // SMTP Config
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    if (resendApiKey) {
      console.log('Sending email using Resend API...');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: resendFromEmail,
          to: [to],
          subject: subject,
          html: html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Resend API returned error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return res.status(200).json({ success: true, provider: 'resend', data });
    } else if (smtpHost && smtpPort && smtpUser && smtpPass) {
      console.log('Sending email using SMTP...');
      // Dynamically import nodemailer to avoid issues if not installed or during frontend bundles
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: smtpPort === '465', // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        html,
      });

      return res.status(200).json({ success: true, provider: 'smtp', messageId: info.messageId });
    } else {
      console.warn('Neither Resend API nor SMTP environment variables are configured. Logging to console.');
      console.log(`[SIMULATED EMAIL] To: ${to}, Subject: ${subject}`);
      return res.status(200).json({
        success: true,
        provider: 'simulator',
        message: 'Email accepted but simulated (configure RESEND_API_KEY or SMTP variables)',
      });
    }
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
