import { NextRequest, NextResponse } from 'next/server';
import { getStoreData, isSemiMaheshwari, isSuitProduct } from '@/lib/storeManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLOR_SYNONYMS: Record<string, string[]> = {
  blue: ['blue', 'peacock', 'teal', 'navy', 'royal blue', 'sky blue', 'firozi', 'neelam', 'aqua', 'turquoise'],
  red: ['red', 'maroon', 'wine', 'crimson', 'tomato', 'lal', 'surkh', 'cherry', 'coral red'],
  green: ['green', 'bottle green', 'parrot', 'olive', 'teal', 'pista', 'mehendi', 'hara', 'rama', 'dark green'],
  yellow: ['yellow', 'mustard', 'lemon', 'haldi', 'pitambari', 'gold', 'golden'],
  pink: ['pink', 'magenta', 'rani', 'baby pink', 'gulabi', 'rose', 'coral', 'peach', 'dusty rose'],
  black: ['black', 'kala', 'charcoal', 'dark'],
  white: ['white', 'off white', 'cream', 'ivory', 'safed'],
  orange: ['orange', 'peach', 'mango', 'kesariya'],
  purple: ['purple', 'violet', 'lavender', 'jamuni', 'baingani', 'plum'],
  maroon: ['maroon', 'wine', 'deep red'],
  gold: ['gold', 'golden', 'zari', 'metallic'],
  silver: ['silver', 'rupeli', 'silver zari'],
  grey: ['grey', 'gray', 'charcoal'],
  gray: ['grey', 'gray', 'charcoal'],
  brown: ['brown', 'chocolate', 'coffee', 'katha'],
};

const STOP_WORDS = new Set([
  'saree', 'sarees', 'sari', 'saris', 'handloom', 'pure', 'buy', 'online', 'collection', 'wear', 'for', 'women', 'reoti'
]);


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const fabric = searchParams.get('fabric');
  const weaveType = searchParams.get('weaveType');
  const borderType = searchParams.get('borderType');
  const color = searchParams.get('color');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const bestSeller = searchParams.get('bestSeller');
  const trending = searchParams.get('trending');
  const inStock = searchParams.get('inStock');
  const sort = searchParams.get('sort');
  const includeAll = searchParams.get('includeAll') === 'true';

  const storeData = getStoreData();
  let storeProducts = storeData.products || [];
  const allCategories = storeData.categories || [];

  if (category) {
    const targetCat = allCategories.find(
      (c: any) =>
        c.slug?.toLowerCase() === category.toLowerCase() ||
        c.id === category ||
        c.name?.toLowerCase() === category.toLowerCase()
    );

    const isTargetSuit =
      category.toLowerCase().includes('suit') ||
      category.toLowerCase().includes('unstitched') ||
      Boolean(
        targetCat &&
          (targetCat.slug?.toLowerCase().includes('suit') ||
            targetCat.name?.toLowerCase().includes('suit') ||
            (targetCat.parentId &&
              allCategories.some(
                (p: any) =>
                  p.id === targetCat.parentId &&
                  (p.slug?.toLowerCase().includes('suit') || p.name?.toLowerCase().includes('suit'))
              )))
      );

    const isTargetSemi =
      category.toLowerCase().includes('semi-maheshwari') ||
      category === 'semi-maheshwari-sarees-id' ||
      Boolean(
        targetCat &&
          (targetCat.slug?.toLowerCase().includes('semi-maheshwari') ||
            targetCat.name?.toLowerCase().includes('semi maheshwari') ||
            targetCat.parentId === 'semi-maheshwari-sarees-id' ||
            targetCat.id === 'semi-maheshwari-sarees-id')
      );

    const childCatIds = targetCat
      ? allCategories.filter((c: any) => c.parentId === targetCat.id).map((c: any) => c.id)
      : [];
    const childCatSlugs = targetCat
      ? allCategories.filter((c: any) => c.parentId === targetCat.id).map((c: any) => c.slug?.toLowerCase())
      : [];

    const allowedCatIds = new Set<string>([
      category,
      ...(targetCat ? [targetCat.id] : []),
      ...childCatIds,
    ]);

    const allowedCatSlugs = new Set<string>([
      category.toLowerCase(),
      ...(targetCat ? [targetCat.slug?.toLowerCase()] : []),
      ...childCatSlugs,
    ]);

    storeProducts = storeProducts.filter((p: any) => {
      const prodIsSemi = isSemiMaheshwari(p, allCategories);
      const prodIsSuit = isSuitProduct(p, allCategories);

      // Strict boundary check: Semi and Handloom can never mix
      if (isTargetSemi && !prodIsSemi) return false;
      if (!isTargetSemi && prodIsSemi) return false;

      // Strict boundary check: Suit and Saree can never mix
      if (isTargetSuit && !prodIsSuit) return false;
      if (!isTargetSuit && !category.toLowerCase().includes('dupatta') && prodIsSuit) return false;

      // 1. Direct ID match
      if (p.categoryId && allowedCatIds.has(p.categoryId)) return true;

      // 2. Direct Slug match
      if (p.category?.slug && allowedCatSlugs.has(p.category.slug.toLowerCase())) return true;
      if (p.category?.id && allowedCatIds.has(p.category.id)) return true;

      // 3. Check parentId in allCategories store
      const prodCat = allCategories.find(
        (c: any) => c.id === p.categoryId || c.slug?.toLowerCase() === p.category?.slug?.toLowerCase()
      );
      if (targetCat && prodCat && prodCat.parentId === targetCat.id) {
        return true;
      }

      // 4. Special fallback for "maheshwari-sarees" parent: include all authentic maheshwari child sarees
      if (category === 'maheshwari-sarees' && !prodIsSemi && !prodIsSuit) {
        const isDupatta =
          p.category?.slug === 'dupattas' ||
          p.categoryId === '59c903c7-960f-4481-882a-9b16890a3054' ||
          p.title?.toLowerCase().includes('dupatta');
        const isChanderi =
          p.category?.slug === 'chanderi-sarees' ||
          p.categoryId === '32118f61-e48f-41f0-bcb7-dd4e599205e8' ||
          p.title?.toLowerCase().includes('chanderi');

        if (!isDupatta && !isChanderi) {
          return true;
        }
      }

      return false;
    });
  } else if (!includeAll) {
    const searchLower = (search || '').toLowerCase();
    const searchingForSuit = searchLower.includes('suit') || searchLower.includes('dress') || searchLower.includes('kurta') || searchLower.includes('dupatta');
    const searchingForSemi = searchLower.includes('semi') || searchLower.includes('sami');

    storeProducts = storeProducts.filter((p: any) => {
      if (isSemiMaheshwari(p, allCategories) && !searchingForSemi) return false;
      if (isSuitProduct(p, allCategories) && !searchingForSuit) return false;
      return true;
    });
  }
  if (fabric) {
    storeProducts = storeProducts.filter((p) => p.fabric?.toLowerCase().includes(fabric.toLowerCase()));
  }
  if (weaveType) {
    storeProducts = storeProducts.filter((p) => p.weaveType?.toLowerCase().includes(weaveType.toLowerCase()));
  }
  if (borderType) {
    storeProducts = storeProducts.filter((p) => p.borderType?.toLowerCase().includes(borderType.toLowerCase()));
  }
  if (color) {
    const cLower = color.toLowerCase().trim();
    const synonyms = COLOR_SYNONYMS[cLower] || [cLower];
    storeProducts = storeProducts.filter((p) => {
      const pColor = (p.color || '').toLowerCase();
      const pTitle = (p.title || '').toLowerCase();
      return synonyms.some((syn) => pColor.includes(syn) || pTitle.includes(syn));
    });
  }
  if (featured === 'true') {
    storeProducts = storeProducts.filter((p) => p.isFeatured);
  }
  if (bestSeller === 'true') {
    storeProducts = storeProducts.filter((p) => p.isBestSeller);
  }
  if (trending === 'true') {
    storeProducts = storeProducts.filter((p) => p.isTrending);
  }
  if (inStock === 'true') {
    storeProducts = storeProducts.filter((p) => !p.isOutOfStock);
  }
  if (minPrice) {
    storeProducts = storeProducts.filter((p) => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    storeProducts = storeProducts.filter((p) => p.price <= parseFloat(maxPrice));
  }
  if (search) {
    const rawTokens = search.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    if (rawTokens.length > 0) {
      const meaningfulTokens = rawTokens.filter((t) => !STOP_WORDS.has(t));
      const searchTokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

      const scoredProducts: { product: any; score: number }[] = [];

      for (const p of storeProducts) {
        const title = (p.title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const pColor = (p.color || '').toLowerCase();
        const fabricStr = (p.fabric || '').toLowerCase();
        const weave = (p.weaveType || '').toLowerCase();
        const border = (p.borderType || '').toLowerCase();
        const catStr = (typeof p.category === 'object' ? `${p.category?.name || ''}` : String(p.category || '')).toLowerCase();
        const allText = `${title} ${desc} ${pColor} ${fabricStr} ${weave} ${border} ${catStr}`;

        let score = 0;
        let matchedTokens = 0;

        for (const token of searchTokens) {
          let tokenMatched = false;

          if (title.includes(token)) {
            score += 15;
            tokenMatched = true;
          }
          if (pColor.includes(token)) {
            score += 12;
            tokenMatched = true;
          }
          if (fabricStr.includes(token)) {
            score += 8;
            tokenMatched = true;
          }
          if (weave.includes(token) || border.includes(token)) {
            score += 8;
            tokenMatched = true;
          }
          if (catStr.includes(token)) {
            score += 8;
            tokenMatched = true;
          }
          if (desc.includes(token)) {
            score += 3;
            tokenMatched = true;
          }

          if (COLOR_SYNONYMS[token]) {
            for (const syn of COLOR_SYNONYMS[token]) {
              if (pColor.includes(syn) || title.includes(syn)) {
                score += 10;
                tokenMatched = true;
                break;
              }
            }
          }

          if (['cotton', 'silk', 'cottonsilk', 'silkcotton', 'mulberry'].includes(token)) {
            if (fabricStr.includes('silk') || fabricStr.includes('cotton') || title.includes('silk') || title.includes('cotton')) {
              score += 8;
              tokenMatched = true;
            }
          }

          if (['tissue', 'shimmer', 'metallic'].includes(token)) {
            if (title.includes('zari') || border.includes('zari') || title.includes('tissue') || title.includes('gold') || title.includes('silver')) {
              score += 10;
              tokenMatched = true;
            }
          }

          if (['plain', 'simple'].includes(token)) {
            if (title.includes('border') || weave.includes('plain') || title.includes('zari border')) {
              score += 8;
              tokenMatched = true;
            }
          }

          if (token === 'chanderi') {
            if (allText.includes('chanderi')) {
              score += 20;
              tokenMatched = true;
            } else if (fabricStr.includes('silk') || title.includes('katan') || fabricStr.includes('cotton')) {
              score += 5;
              tokenMatched = true;
            }
          }

          if (tokenMatched) {
            matchedTokens++;
          }
        }

        if (matchedTokens > 0 && score > 0) {
          if (matchedTokens === searchTokens.length) {
            score += 25;
          }
          scoredProducts.push({ product: p, score });
        }
      }

      scoredProducts.sort((a, b) => b.score - a.score);
      storeProducts = scoredProducts.map((sp) => sp.product);
    }
  }

  if (sort === 'price-low') storeProducts.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') storeProducts.sort((a, b) => b.price - a.price);
  if (sort === 'rating') storeProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sort === 'discount') storeProducts.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

  return NextResponse.json(
    { success: true, products: storeProducts, count: storeProducts.length },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
      },
    }
  );
}

