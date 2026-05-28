import { getProducts, getStoredData, setStoredData, type Product } from './db';

// Known configuration entities for query parsing
const COLORS = [
  'black', 'white', 'off-white', 'grey', 'gray', 'charcoal', 
  'navy', 'blue', 'green', 'beige', 'brown', 'olive', 'sand', 
  'khaki', 'gold', 'teal', 'indigo', 'orange', 'cream', 'mustard'
];

const CATEGORIES_MAP: Record<string, string> = {
  'oversized': 'Oversized T-Shirts',
  'tee': 'Oversized T-Shirts',
  'tshirt': 'Oversized T-Shirts',
  'polo': 'Polo T-Shirts',
  'polos': 'Polo T-Shirts',
  'shirt': 'Premium Shirts',
  'shirts': 'Premium Shirts',
  'linen': 'Premium Shirts',
  'hoodie': 'Hoodies',
  'hoodies': 'Hoodies',
  'sweatshirt': 'Sweatshirts',
  'sweatshirts': 'Sweatshirts',
  'cargo': 'Cargo Pants',
  'cargos': 'Cargo Pants',
  'pants': 'Cargo Pants',
  'jeans': 'Jeans',
  'denim': 'Jeans',
  'denims': 'Jeans',
  'sneaker': 'Sneakers',
  'sneakers': 'Sneakers',
  'shoes': 'Sneakers',
  'shoe': 'Sneakers',
  'jacket': 'Jackets',
  'jackets': 'Jackets',
  'coat': 'Jackets',
  'coord': 'Co-ord Sets',
  'coords': 'Co-ord Sets',
  'set': 'Co-ord Sets',
  'sets': 'Co-ord Sets',
  'summer': 'Summer Wear',
  'vacation': 'Summer Wear',
  'formal': 'Formal Wear',
  'office': 'Formal Wear',
  'streetwear': 'Streetwear',
  'street': 'Streetwear',
  'accessories': 'Accessories',
  'cap': 'Accessories',
  'belt': 'Accessories',
  'wallet': 'Accessories'
};

const SIZES = ['S', 'M', 'L', 'XL', '30', '32', '34', '36', '7', '8', '9', '10'];

// Hardcoded trending search terms
export const TRENDING_SEARCHES = [
  'Oversized Tee',
  'Linen Resort Shirt',
  'Cargo Joggers',
  'White Sneakers',
  'Cafe Racer Jacket',
  'Co-ord Sets'
];

// Predefined keyword suggestions for predicting text
const SUGGESTION_KEYWORDS = [
  'Oversized T-Shirts',
  'Classic Black Oversized Tee',
  'Classic Off-White Oversized Tee',
  'Urban Charcoal Oversized Tee',
  'Polo T-Shirts',
  'Navy Blue Polo',
  'Premium Shirts',
  'Egyptian Linen Shirt',
  'Summer Resort Shirt',
  'French Terry Pullover Hoodie',
  'Urban Zip-up Hoodie',
  'Stealth Black Joggers',
  'Cargo Pants',
  'Tactical Cargo Pants',
  'Comfort Stretch Jeans',
  'Genuine Leather Sneakers',
  'Sheepskin Cafe Racer Jacket',
  'Trucker Denim Jacket',
  'Belgian Linen Co-ord Set',
  'Viscose Cuban Summer Shirt'
];

// Levenshtein edit distance logic for typo tolerance
export const getLevenshteinDistance = (a: string, b: string): number => {
  const tmp = [];
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1, // deletion
        tmp[i][j - 1] + 1, // insertion
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
      );
    }
  }
  return tmp[a.length][b.length];
};

// Check if a word matches any target list of words with typo tolerance
const findClosestMatch = (word: string, targets: string[], maxDist = 2): string | null => {
  let closest: string | null = null;
  let minDist = maxDist + 1;

  for (const target of targets) {
    if (target.startsWith(word) || word.startsWith(target)) {
      return target;
    }
    const dist = getLevenshteinDistance(word, target);
    if (dist < minDist) {
      minDist = dist;
      closest = target;
    }
  }
  return minDist <= maxDist ? closest : null;
};

export interface ParsedQuery {
  rawQuery: string;
  searchWords: string[];
  detectedCategories: string[];
  detectedColors: string[];
  detectedSizes: string[];
  priceMax: number | null;
  priceMin: number | null;
}

// Intelligent query parsing engine
export const parseSearchQuery = (q: string): ParsedQuery => {
  const rawQuery = q.trim();
  const normalized = rawQuery.toLowerCase().replace(/[^a-z0-9\s-]/g, '');
  const tokens = normalized.split(/\s+/).filter(Boolean);

  const searchWords: string[] = [];
  const detectedCategories: string[] = [];
  const detectedColors: string[] = [];
  const detectedSizes: string[] = [];
  let priceMax: number | null = null;
  let priceMin: number | null = null;

  // Scan tokens for price criteria (e.g., "under 2000", "below 1500", "above 1000", "1000 to 3000")
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === 'under' || token === 'below' || token === 'less' || token === 'lt') {
      const nextVal = parseInt(tokens[i + 1] || tokens[i + 2], 10);
      if (!isNaN(nextVal)) {
        priceMax = nextVal;
        // Skip next tokens
        i += (tokens[i + 1] && !isNaN(parseInt(tokens[i + 1], 10))) ? 1 : 2;
        continue;
      }
    }

    if (token === 'above' || token === 'over' || token === 'more' || token === 'gt') {
      const nextVal = parseInt(tokens[i + 1] || tokens[i + 2], 10);
      if (!isNaN(nextVal)) {
        priceMin = nextVal;
        i += (tokens[i + 1] && !isNaN(parseInt(tokens[i + 1], 10))) ? 1 : 2;
        continue;
      }
    }

    // Check sizes e.g., "size s", "size 32"
    if (token === 'size') {
      const nextSize = tokens[i + 1]?.toUpperCase();
      if (nextSize && SIZES.includes(nextSize)) {
        detectedSizes.push(nextSize);
        i++;
        continue;
      }
    }

    // Verify standalone sizes
    const upperToken = token.toUpperCase();
    if (SIZES.includes(upperToken)) {
      detectedSizes.push(upperToken);
      continue;
    }

    // Match colors
    if (COLORS.includes(token)) {
      detectedColors.push(token);
      continue;
    }

    // Typo-tolerant color match
    const typoColor = findClosestMatch(token, COLORS, 1);
    if (typoColor) {
      detectedColors.push(typoColor);
      continue;
    }

    // Match categories
    if (CATEGORIES_MAP[token]) {
      const cat = CATEGORIES_MAP[token];
      if (!detectedCategories.includes(cat)) {
        detectedCategories.push(cat);
      }
      continue;
    }

    searchWords.push(token);
  }

  return {
    rawQuery,
    searchWords,
    detectedCategories,
    detectedColors,
    detectedSizes,
    priceMax,
    priceMin
  };
};

// Main product filter & rank engine
export const searchProducts = (q: string): Product[] => {
  const products = getProducts();
  if (!q.trim()) return products;

  const parsed = parseSearchQuery(q);
  
  // Calculate a matching score for each product
  const scoredProducts = products.map(product => {
    let score = 0;
    const nameLower = product.name.toLowerCase();
    const descLower = product.description.toLowerCase();
    const colorsLower = (product.colors || []).map(c => c.toLowerCase());
    const detailsLower = (product.details || []).map(d => d.toLowerCase());

    // 1. Exact Name match or Substring Name match
    if (nameLower === parsed.rawQuery.toLowerCase()) {
      score += 150;
    } else if (nameLower.includes(parsed.rawQuery.toLowerCase())) {
      score += 80;
    }

    // 2. Parsed word matches
    parsed.searchWords.forEach(word => {
      if (nameLower.includes(word)) {
        score += 30;
      } else if (descLower.includes(word)) {
        score += 10;
      } else if (detailsLower.some(d => d.includes(word))) {
        score += 10;
      }
    });

    // 3. Category match (highly prioritized)
    let hasCategoryMatch = false;
    parsed.detectedCategories.forEach(cat => {
      if (product.category.toLowerCase() === cat.toLowerCase()) {
        score += 60;
        hasCategoryMatch = true;
      }
    });

    // 4. Color match
    let hasColorMatch = false;
    if (parsed.detectedColors.length > 0) {
      const matchesColor = colorsLower.some(c => 
        parsed.detectedColors.some(pc => c.includes(pc) || pc.includes(c))
      );
      if (matchesColor) {
        score += 50;
        hasColorMatch = true;
      }
    }

    // 5. Size match
    let hasSizeMatch = false;
    if (parsed.detectedSizes.length > 0) {
      const matchesSize = product.sizes.some(s => parsed.detectedSizes.includes(s));
      if (matchesSize) {
        score += 40;
        hasSizeMatch = true;
      }
    }

    // 6. BestSeller / New release multiplier
    if (product.isBestSeller) score += 5;
    if (product.isNewRelease) score += 5;

    // Filters check
    // Price range bounds
    if (parsed.priceMax !== null && product.price > parsed.priceMax) {
      score = 0; // Filtered out
    }
    if (parsed.priceMin !== null && product.price < parsed.priceMin) {
      score = 0;
    }

    // If query specified color, category, or size and the product didn't match it, downgrade score significantly
    if (parsed.detectedColors.length > 0 && !hasColorMatch) {
      score = 0;
    }
    if (parsed.detectedCategories.length > 0 && !hasCategoryMatch) {
      // If we searched "cargo shirt" and it's a cargo pant, score is down.
      // But if there's multiple category specifications, we require matching at least one.
    }
    if (parsed.detectedSizes.length > 0 && !hasSizeMatch) {
      score = 0;
    }

    return { product, score };
  });

  // Filter out zero-scored products and sort by relevance score descending
  return scoredProducts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
};

export interface SearchSuggestions {
  recent: string[];
  trending: string[];
  suggestedCategories: string[];
  predictedKeywords: string[];
  matchedProducts: Product[];
}

// Compute live search suggestions inside the input dropdown
export const getSearchSuggestions = (q: string): SearchSuggestions => {
  const recent = getStoredData<string[]>('mmi_recent_searches', []);
  const trending = TRENDING_SEARCHES;

  if (!q.trim()) {
    // If empty, return initial recent/trending
    return {
      recent,
      trending,
      suggestedCategories: [],
      predictedKeywords: [],
      matchedProducts: []
    };
  }

  const queryLower = q.toLowerCase().trim();

  // 1. Matched Categories suggestion
  const categoriesList = Array.from(new Set(getProducts().map(p => p.category)));
  const suggestedCategories: string[] = categoriesList.filter(cat => 
    cat.toLowerCase().includes(queryLower)
  );

  // Add mapped abbreviations if matching
  Object.keys(CATEGORIES_MAP).forEach(abbr => {
    if (abbr.includes(queryLower) || queryLower.includes(abbr)) {
      const mappedCat = CATEGORIES_MAP[abbr];
      if (!suggestedCategories.includes(mappedCat)) {
        suggestedCategories.push(mappedCat);
      }
    }
  });

  // 2. Matched Keyword Predictions
  const predictedKeywords = SUGGESTION_KEYWORDS.filter(kw => 
    kw.toLowerCase().includes(queryLower)
  );

  // If no direct matches, check typo distance
  if (predictedKeywords.length === 0) {
    const typoMatch = findClosestMatch(queryLower, SUGGESTION_KEYWORDS, 2);
    if (typoMatch) {
      predictedKeywords.push(typoMatch);
    }
  }

  // 3. Matched Products suggestions (limit to 5)
  const matchedProducts = searchProducts(q).slice(0, 5);

  return {
    recent,
    trending,
    suggestedCategories,
    predictedKeywords: predictedKeywords.slice(0, 5),
    matchedProducts
  };
};

// Add search query to recent storage
export const addRecentSearch = (q: string): void => {
  const query = q.trim();
  if (!query) return;

  let recent = getStoredData<string[]>('mmi_recent_searches', []);
  
  // Remove duplicates
  recent = recent.filter(item => item.toLowerCase() !== query.toLowerCase());
  
  // Add to front and slice to max 5
  recent.unshift(query);
  recent = recent.slice(0, 5);
  
  setStoredData('mmi_recent_searches', recent);
};
