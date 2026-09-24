import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import initialStoreData from '@/data/storeData.json';

export interface StoreData {
  categories: any[];
  products: any[];
  banners: any[];
  instaPosts: any[];
  reviews: any[];
  blogs?: any[];
  orders?: any[];
  activities?: any[];
  users?: any[];
  leads?: any[];
}

let inMemoryStore: StoreData = {
  ...initialStoreData,
  blogs: (initialStoreData as any).blogs || [],
  orders: (initialStoreData as any).orders || [],
  activities: (initialStoreData as any).activities || [],
  users: (initialStoreData as any).users || [],
  leads: (initialStoreData as any).leads || [],
};

function getStorageFilePaths(): string[] {
  return [
    path.join(process.cwd(), 'src', 'data', 'storeData.json'),
    path.join(process.cwd(), 'data', 'storeData.json'),
    path.join(process.cwd(), 'storeData.json'),
  ];
}

function getStorageFilePath(): string {
  const paths = getStorageFilePaths();
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  const defaultPath = paths[0];
  const dir = path.dirname(defaultPath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
  }
  return defaultPath;
}

export function getStoreData(): StoreData {
  const filePath = getStorageFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      inMemoryStore = {
        categories: Array.isArray(parsed.categories) ? parsed.categories : inMemoryStore.categories || [],
        products: Array.isArray(parsed.products) ? parsed.products : inMemoryStore.products || [],
        banners: Array.isArray(parsed.banners) ? parsed.banners : inMemoryStore.banners || [],
        instaPosts: Array.isArray(parsed.instaPosts) ? parsed.instaPosts : inMemoryStore.instaPosts || [],
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : inMemoryStore.reviews || [],
        blogs: Array.isArray(parsed.blogs) ? parsed.blogs : inMemoryStore.blogs || [],
        orders: Array.isArray(parsed.orders) ? parsed.orders : inMemoryStore.orders || [],
        activities: Array.isArray(parsed.activities) ? parsed.activities : inMemoryStore.activities || [],
        users: Array.isArray(parsed.users) ? parsed.users : inMemoryStore.users || [],
        leads: Array.isArray(parsed.leads) ? parsed.leads : inMemoryStore.leads || [],
      };
    }
  } catch (err) {
    console.warn('[StoreManager] Read file warning, using in-memory store:', err);
  }
  return inMemoryStore;
}

export function saveStoreData(data: Partial<StoreData>): StoreData {
  inMemoryStore = {
    ...inMemoryStore,
    ...data,
  };

  const payload = JSON.stringify(inMemoryStore, null, 2);
  const paths = getStorageFilePaths();

  // Ensure default dir exists
  const primaryPath = getStorageFilePath();
  try {
    const dir = path.dirname(primaryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(primaryPath, payload, 'utf-8');
  } catch (err) {
    console.warn('[StoreManager] Write primary file warning:', err);
  }

  // Also write to any other existing paths to keep everything 100% in sync
  for (const p of paths) {
    if (p !== primaryPath && fs.existsSync(p)) {
      try {
        fs.writeFileSync(p, payload, 'utf-8');
      } catch (e) {}
    }
  }

  return inMemoryStore;
}


// ---------------- PRODUCTS ----------------

export function getAllProducts() {
  return getStoreData().products;
}

export function getProductBySlugOrId(slugOrId: string) {
  if (!slugOrId) return null;
  const data = getStoreData();
  const raw = String(slugOrId).trim();
  const decoded = decodeURIComponent(raw).trim().toLowerCase();
  const normalizedSearch = decoded
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  // 1. Exact ID match
  let product = data.products.find((p) => p.id === raw || p.id === decoded);
  if (product) return product;

  // 2. Exact Slug match
  product = data.products.find((p) => (p.slug || '').trim().toLowerCase() === decoded);
  if (product) return product;

  // 3. Normalized Slug match
  product = data.products.find((p) => {
    const pSlugNorm = (p.slug || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    return pSlugNorm === normalizedSearch;
  });
  if (product) return product;

  // 4. Exact title match
  product = data.products.find(
    (p) => (p.title || '').trim().toLowerCase() === decoded.replace(/-/g, ' ')
  );
  if (product) return product;

  // 5. Partial / Substring Slug match
  product = data.products.find((p) => {
    const pSlug = (p.slug || '').toLowerCase().trim();
    return pSlug && (decoded.includes(pSlug) || pSlug.includes(decoded));
  });
  if (product) return product;

  // 6. Partial title match
  const searchWords = decoded.replace(/-/g, ' ').split(/\s+/).filter((w) => w.length > 2);
  if (searchWords.length > 0) {
    product = data.products.find((p) => {
      const pTitle = (p.title || '').toLowerCase();
      const matchCount = searchWords.filter((w) => pTitle.includes(w)).length;
      return matchCount >= Math.min(3, searchWords.length);
    });
  }

  return product || null;
}

export function isSemiMaheshwari(product: any, allCategories?: any[]): boolean {
  if (!product) return false;
  const cats = allCategories || getStoreData().categories || [];

  if (product.categoryId === 'semi-maheshwari-sarees-id') return true;

  const catSlug = (product.category?.slug || '').toLowerCase();
  const catName = (product.category?.name || '').toLowerCase();
  if (catSlug.includes('semi-maheshwari') || catName.includes('semi maheshwari')) return true;

  if (product.categoryId) {
    const matchedCat = cats.find((c: any) => c.id === product.categoryId);
    if (matchedCat) {
      const mcSlug = (matchedCat.slug || '').toLowerCase();
      const mcName = (matchedCat.name || '').toLowerCase();
      if (
        mcSlug.includes('semi-maheshwari') ||
        mcName.includes('semi maheshwari') ||
        matchedCat.id === 'semi-maheshwari-sarees-id' ||
        matchedCat.parentId === 'semi-maheshwari-sarees-id'
      ) {
        return true;
      }
    }
  }

  const title = (product.title || '').toLowerCase();
  const fabric = (product.fabric || '').toLowerCase();
  const designCode = (product.designCode || '').toLowerCase();
  const slug = (product.slug || '').toLowerCase();

  if (
    title.includes('semi maheshwari') ||
    title.includes('semi-maheshwari') ||
    title.startsWith('semi ') ||
    fabric.includes('semi') ||
    designCode.includes('semi') ||
    slug.includes('semi-maheshwari')
  ) {
    return true;
  }

  return false;
}

export function isSuitProduct(product: any, allCategories?: any[]): boolean {
  if (!product) return false;
  const cats = allCategories || getStoreData().categories || [];

  const catSlug = (product.category?.slug || '').toLowerCase();
  const catName = (product.category?.name || '').toLowerCase();
  if (
    catSlug.includes('suit') ||
    catName.includes('suit') ||
    catSlug.includes('unstitched') ||
    catName.includes('unstitched') ||
    catSlug.includes('dress-material') ||
    catName.includes('dress material')
  ) {
    return true;
  }

  if (product.categoryId) {
    const matchedCat = cats.find((c: any) => c.id === product.categoryId);
    if (matchedCat) {
      const mcSlug = (matchedCat.slug || '').toLowerCase();
      const mcName = (matchedCat.name || '').toLowerCase();
      if (
        mcSlug.includes('suit') ||
        mcName.includes('suit') ||
        mcSlug.includes('unstitched') ||
        mcName.includes('unstitched') ||
        mcSlug.includes('dress-material') ||
        mcName.includes('dress material')
      ) {
        return true;
      }
      if (matchedCat.parentId) {
        const parentCat = cats.find((c: any) => c.id === matchedCat.parentId);
        if (parentCat) {
          const pSlug = (parentCat.slug || '').toLowerCase();
          const pName = (parentCat.name || '').toLowerCase();
          if (
            pSlug.includes('suit') ||
            pName.includes('suit') ||
            pSlug.includes('unstitched') ||
            pName.includes('unstitched') ||
            pSlug.includes('dress-material') ||
            pName.includes('dress material')
          ) {
            return true;
          }
        }
      }
    }
  }

  const title = (product.title || '').toLowerCase();
  const slug = (product.slug || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const length = (product.lengthWithBlouse || '').toLowerCase();
  if (
    title.includes('suit') ||
    title.includes('kurta') ||
    title.includes('dress material') ||
    title.includes('top dupatta') ||
    title.includes('top-dupatta') ||
    slug.includes('suit') ||
    slug.includes('top-dupatta') ||
    desc.includes('suit') ||
    desc.includes('top dupatta') ||
    desc.includes('2-piece') ||
    desc.includes('3-piece') ||
    length.includes('top') ||
    length.includes('dupatta') ||
    length.includes('piece set')
  ) {
    return true;
  }

  return false;
}

export function createProductInStore(productInput: any) {
  const data = getStoreData();
  const id = crypto.randomUUID();

  const title = (productInput.title || '').trim();
  const rawSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  let slug = rawSlug || `saree-${Date.now()}`;
  let counter = 1;
  while (data.products.some((p) => p.slug === slug)) {
    slug = `${rawSlug}-${counter++}`;
  }

  const price = parseFloat(productInput.price) || 0;
  const originalPrice =
    productInput.originalPrice !== undefined && productInput.originalPrice !== null && productInput.originalPrice !== ''
      ? parseFloat(productInput.originalPrice)
      : price;
  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const category = data.categories.find((c) => c.id === productInput.categoryId || c.slug === productInput.categoryId);
  const resolvedCategoryId = category ? category.id : (productInput.categoryId || (data.categories[0]?.id ?? ''));

  let images = productInput.images;
  if (typeof images !== 'string') {
    images = JSON.stringify(images || []);
  }

  const isOutOfStock = Boolean(productInput.isOutOfStock);
  let stock: number | undefined = undefined;
  if (productInput.stock !== undefined && productInput.stock !== null && productInput.stock !== '') {
    stock = parseInt(productInput.stock);
  } else {
    stock = undefined;
  }

  const newProduct = {
    id,
    title,
    slug,
    description: productInput.description || title,
    price,
    originalPrice,
    discountPercent,
    fabric: productInput.fabric || 'Silk Cotton',
    weaveType: productInput.weaveType || 'Garbha Reshami Border',
    borderType: productInput.borderType || 'Gold Zari',
    color: productInput.color || 'Multi',
    blouseColor: productInput.blouseColor || null,
    designCode: productInput.designCode || null,
    lengthWithBlouse: productInput.lengthWithBlouse || '6.3 Meters (With Blouse Piece)',
    occasion: productInput.occasion || 'Festive & Wedding',
    isFeatured: Boolean(productInput.isFeatured),
    isBestSeller: Boolean(productInput.isBestSeller),
    isTrending: Boolean(productInput.isTrending),
    isAuthenticCraft: productInput.isAuthenticCraft !== undefined ? Boolean(productInput.isAuthenticCraft) : true,
    rating: parseFloat(productInput.rating) || 0,
    reviewCount: parseInt(productInput.reviewCount) || 0,
    stock,
    isOutOfStock,
    images,
    videoUrl: productInput.videoUrl || productInput.video || null,
    categoryId: resolvedCategoryId,
    category: category
      ? { id: category.id, name: category.name, slug: category.slug, parentId: category.parentId }
      : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [],
  };

  const updatedProducts = [newProduct, ...data.products];
  saveStoreData({ products: updatedProducts });
  return newProduct;
}

export function updateProductInStore(id: string, updateInput: any) {
  const data = getStoreData();
  const index = data.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = data.products[index];
  const price = updateInput.price !== undefined ? parseFloat(updateInput.price) : existing.price;
  let originalPrice = existing.originalPrice;
  if (updateInput.originalPrice !== undefined) {
    if (updateInput.originalPrice === '' || updateInput.originalPrice === null) {
      originalPrice = price;
    } else {
      originalPrice = parseFloat(updateInput.originalPrice);
    }
  }

  let discountPercent = 0;
  if (originalPrice && price && originalPrice > price) {
    discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  } else {
    discountPercent = 0;
  }

  let images = updateInput.images !== undefined ? updateInput.images : existing.images;
  if (images && typeof images !== 'string') {
    images = JSON.stringify(images);
  }

  const videoUrl = updateInput.videoUrl !== undefined ? (updateInput.videoUrl || null) : existing.videoUrl;

  const targetCategoryId = updateInput.categoryId !== undefined ? updateInput.categoryId : existing.categoryId;
  const category = data.categories.find((c) => c.id === targetCategoryId || c.slug === targetCategoryId);
  const resolvedCategoryId = category ? category.id : targetCategoryId;

  const isOutOfStock =
    updateInput.isOutOfStock !== undefined ? Boolean(updateInput.isOutOfStock) : existing.isOutOfStock;
  
  let stock: number | undefined = existing.stock;
  if (updateInput.stock !== undefined) {
    if (updateInput.stock === '' || updateInput.stock === null) {
      stock = undefined;
    } else {
      stock = parseInt(updateInput.stock);
    }
  }

  const updatedProduct = {
    ...existing,
    ...updateInput,
    price,
    originalPrice,
    discountPercent,
    images,
    videoUrl,
    categoryId: resolvedCategoryId,
    category: category
      ? { id: category.id, name: category.name, slug: category.slug, parentId: category.parentId }
      : existing.category,
    isOutOfStock,
    stock,
    updatedAt: new Date().toISOString(),
  };

  const updatedProducts = [...data.products];
  updatedProducts[index] = updatedProduct;
  saveStoreData({ products: updatedProducts });
  return updatedProduct;
}

export function deleteProductInStore(id: string) {
  const data = getStoreData();
  const updatedProducts = data.products.filter((p) => p.id !== id);
  saveStoreData({ products: updatedProducts });
  return true;
}

// ---------------- CATEGORIES ----------------

export function getAllCategories() {
  const data = getStoreData();
  const categories = data.categories || [];
  const products = data.products || [];

  return categories.map((cat) => {
    const childIds = new Set<string>();
    childIds.add(cat.id);

    // If this category is a parent, include child category IDs as well
    categories.forEach((c) => {
      if (c.parentId === cat.id) {
        childIds.add(c.id);
      }
    });

    const productCount = products.filter((p: any) => {
      if (p.categoryId && childIds.has(p.categoryId)) return true;
      if (p.category?.id && childIds.has(p.category.id)) return true;
      if (p.category?.slug && p.category.slug === cat.slug) return true;
      if (p.category?.name && p.category.name.trim().toLowerCase() === cat.name.trim().toLowerCase()) return true;
      return false;
    }).length;

    return {
      ...cat,
      _count: {
        products: productCount,
      },
    };
  });
}

export function createCategoryInStore(catInput: any) {
  const data = getStoreData();
  const id = crypto.randomUUID();

  const name = (catInput.name || '').trim();
  const slug = (catInput.slug || name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newCat = {
    id,
    name,
    slug,
    description: catInput.description || null,
    image: catInput.image || null,
    bannerImage: catInput.bannerImage || null,
    parentId: catInput.parentId || null,
    isParent: catInput.isParent ?? !catInput.parentId,
    isHidden: Boolean(catInput.isHidden),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedCategories = [...data.categories, newCat];
  saveStoreData({ categories: updatedCategories });
  return newCat;
}

export function updateCategoryInStore(id: string, updateInput: any) {
  const data = getStoreData();
  const index = data.categories.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const existing = data.categories[index];
  const updatedCat = {
    ...existing,
    ...updateInput,
    updatedAt: new Date().toISOString(),
  };

  const updatedCategories = [...data.categories];
  updatedCategories[index] = updatedCat;
  saveStoreData({ categories: updatedCategories });
  return updatedCat;
}

export function deleteCategoryInStore(id: string) {
  const data = getStoreData();
  const productCount = data.products.filter((p) => p.categoryId === id).length;
  if (productCount > 0) {
    throw new Error(`Cannot delete category: ${productCount} saree product(s) are assigned to it.`);
  }

  const updatedCategories = data.categories.filter((c) => c.id !== id);
  saveStoreData({ categories: updatedCategories });
  return true;
}

// ---------------- ORDERS & ACTIVITY ----------------

export function createOrderInStore(orderInput: any) {
  const data = getStoreData();
  const id = crypto.randomUUID();
  const orderNumber = 'REOTI-' + Math.floor(100000 + Math.random() * 900000);

  const newOrder = {
    id,
    orderNumber,
    customerName: orderInput.customerName,
    customerEmail: orderInput.customerEmail || 'customer@reoti.com',
    customerPhone: orderInput.customerPhone,
    shippingAddress: orderInput.shippingAddress,
    totalAmount: parseFloat(orderInput.totalAmount),
    paymentMethod: orderInput.paymentMethod || 'UPI',
    paymentStatus: orderInput.paymentStatus || (orderInput.paymentMethod === 'COD' ? 'PENDING' : 'PAID'),
    status: 'PROCESSING',
    courierPartner: orderInput.courierPartner || null,
    trackingNumber: orderInput.trackingNumber || null,
    trackingUrl: orderInput.trackingUrl || null,
    estimatedDelivery: orderInput.estimatedDelivery || '3-5 Business Days',
    items: typeof orderInput.items === 'string' ? orderInput.items : JSON.stringify(orderInput.items),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const orders = [newOrder, ...(data.orders || [])];
  saveStoreData({ orders });
  return newOrder;
}

export function updateOrderInStore(idOrNumber: string, updateInput: any) {
  const data = getStoreData();
  const currentOrders = data.orders || [];
  const index = currentOrders.findIndex(
    (o: any) => o.id === idOrNumber || o.orderNumber === idOrNumber || o.orderNumber === idOrNumber.replace(/^#/, '')
  );
  if (index === -1) return null;

  const existing = currentOrders[index];
  const updatedOrder = {
    ...existing,
    ...updateInput,
    updatedAt: new Date().toISOString(),
  };

  const orders = [...currentOrders];
  orders[index] = updatedOrder;
  saveStoreData({ orders });
  return updatedOrder;
}

export function deleteOrderInStore(idOrNumber: string) {
  const data = getStoreData();
  const orders = (data.orders || []).filter(
    (o: any) => o.id !== idOrNumber && o.orderNumber !== idOrNumber && o.orderNumber !== idOrNumber.replace(/^#/, '')
  );
  saveStoreData({ orders });
  return true;
}

export function getOrderByIdOrNumber(idOrNumber: string) {
  const data = getStoreData();
  const clean = idOrNumber.trim().replace(/^#/, '').toLowerCase();
  return (
    (data.orders || []).find(
      (o: any) =>
        o.id === idOrNumber ||
        o.orderNumber?.toLowerCase() === clean ||
        o.customerPhone?.includes(clean)
    ) || null
  );
}

export function logActivityInStore(activityInput: any) {
  const data = getStoreData();
  const id = crypto.randomUUID();

  const isAdmin = Boolean(
    activityInput.isAdmin ||
    activityInput.userEmail === 'reotihandloom@gmail.com' ||
    activityInput.userRole === 'admin' ||
    activityInput.pageUrl?.startsWith('/admin') ||
    activityInput.pageUrl?.startsWith('/reoti-studio-manage')
  );

  const newActivity = {
    id,
    type: activityInput.type || 'VISIT',
    title: activityInput.title || 'Store Activity',
    details: activityInput.details || null,
    userEmail: activityInput.userEmail || null,
    userPhone: activityInput.userPhone || null,
    userIp: activityInput.userIp || '127.0.0.1',
    location: activityInput.location || activityInput.city || null,
    city: activityInput.city || null,
    region: activityInput.region || null,
    country: activityInput.country || 'India',
    device: activityInput.device || null,
    browser: activityInput.browser || null,
    pageUrl: activityInput.pageUrl || '/',
    pageTitle: activityInput.pageTitle || null,
    referrer: activityInput.referrer || null,
    isAdmin,
    userRole: isAdmin ? 'ADMIN' : 'CUSTOMER',
    createdAt: new Date().toISOString(),
  };

  const activities = [newActivity, ...(data.activities || [])].slice(0, 2000);
  saveStoreData({ activities });
  return newActivity;
}

export function clearActivitiesInStore(filterType?: 'ALL' | 'ADMIN' | 'TEST') {
  const data = getStoreData();
  if (filterType === 'ADMIN') {
    const activities = (data.activities || []).filter(
      (a: any) => !a.isAdmin && a.userEmail !== 'reotihandloom@gmail.com'
    );
    saveStoreData({ activities });
  } else {
    saveStoreData({ activities: [] });
  }
  return true;
}

// ---------------- LEADS & ENQUIRIES ----------------

export function getAllLeads() {
  return getStoreData().leads || [];
}

export function createLeadInStore(leadInput: any) {
  const data = getStoreData();
  const id = crypto.randomUUID();

  const newLead = {
    id,
    phone: (leadInput.phone || '').trim(),
    name: (leadInput.name || 'Interested Buyer').trim(),
    email: (leadInput.email || '').trim() || null,
    city: leadInput.city || null,
    region: leadInput.region || null,
    location: leadInput.location || leadInput.city || null,
    source: leadInput.source || 'POPUP_OFFER', // POPUP_OFFER, WHATSAPP_ENQUIRY, ABANDONED_CHECKOUT, PRODUCT_PAGE
    productInterest: leadInput.productInterest || leadInput.productTitle || null,
    productUrl: leadInput.productUrl || null,
    couponCode: leadInput.couponCode || 'ROYAL10',
    status: 'NEW', // NEW, CONTACTED, CONVERTED, LOST
    notes: leadInput.notes || '',
    device: leadInput.device || null,
    userIp: leadInput.userIp || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const leads = [newLead, ...(data.leads || [])];
  saveStoreData({ leads });
  return newLead;
}

export function updateLeadStatusInStore(id: string, status: string, notes?: string) {
  const data = getStoreData();
  const index = (data.leads || []).findIndex((l: any) => l.id === id);
  if (index === -1) return null;

  const leads = [...(data.leads || [])];
  leads[index] = {
    ...leads[index],
    status,
    notes: notes !== undefined ? notes : leads[index].notes,
    updatedAt: new Date().toISOString(),
  };

  saveStoreData({ leads });
  return leads[index];
}

export function deleteLeadInStore(id: string) {
  const data = getStoreData();
  const leads = (data.leads || []).filter((l: any) => l.id !== id);
  saveStoreData({ leads });
  return true;
}

// ---------------- USERS & AUTH ----------------

export function getAllUsers() {
  return getStoreData().users || [];
}

export function getUserByEmail(email: string) {
  const norm = (email || '').trim().toLowerCase();
  return (getStoreData().users || []).find((u: any) => u.email?.toLowerCase().trim() === norm) || null;
}

export function createUserInStore(userInput: any) {
  const data = getStoreData();
  const id = crypto.randomUUID();
  const email = (userInput.email || '').trim().toLowerCase();

  const existing = (data.users || []).find((u: any) => u.email?.toLowerCase().trim() === email);
  if (existing) {
    throw new Error('User with this email already exists');
  }

  const newUser = {
    id,
    name: userInput.name || email.split('@')[0],
    email,
    password: userInput.password,
    phone: userInput.phone || null,
    role: userInput.role || (email === 'admin@reotihandloom.com' ? 'admin' : 'customer'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedUsers = [...(data.users || []), newUser];
  saveStoreData({ users: updatedUsers });
  return newUser;
}

export function updateUserPasswordInStore(email: string, newPassword: string) {
  const data = getStoreData();
  const norm = (email || '').trim().toLowerCase();
  const index = (data.users || []).findIndex((u: any) => u.email?.toLowerCase().trim() === norm);
  if (index === -1) {
    throw new Error('User not found');
  }

  const users = [...(data.users || [])];
  users[index] = {
    ...users[index],
    password: newPassword,
    updatedAt: new Date().toISOString(),
  };

  saveStoreData({ users });
  return users[index];
}

// ---------------- REVIEWS ----------------

export function addReviewToStore(reviewInput: any) {
  const data = getStoreData();
  const id = crypto.randomUUID();
  const newReview = {
    id,
    productId: reviewInput.productId || null,
    userName: reviewInput.userName || reviewInput.author || 'Verified Buyer',
    author: reviewInput.author || reviewInput.userName || 'Verified Buyer',
    userEmail: reviewInput.userEmail || null,
    rating: Number(reviewInput.rating) || 5,
    comment: reviewInput.comment || reviewInput.text || '',
    city: reviewInput.city || null,
    image: reviewInput.image || null,
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [newReview, ...(data.reviews || [])];
  
  // If review is for a specific product, update product's rating and review count
  let updatedProducts = data.products;
  if (reviewInput.productId) {
    const pIndex = data.products.findIndex((p) => p.id === reviewInput.productId);
    if (pIndex !== -1) {
      const prod = data.products[pIndex];
      const prodReviews = updatedReviews.filter((r) => r.productId === reviewInput.productId);
      const totalCount = prodReviews.length;
      const avgRating = prodReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / (totalCount || 1);
      const roundedRating = Math.round(avgRating * 10) / 10;
      
      const newProd = {
        ...prod,
        rating: roundedRating,
        reviewCount: totalCount,
        reviews: prodReviews,
      };
      updatedProducts = [...data.products];
      updatedProducts[pIndex] = newProd;
    }
  }

  saveStoreData({ reviews: updatedReviews, products: updatedProducts });
  return newReview;
}

// ---------------- BLOGS & HANDLOOM STORIES ----------------

const DEFAULT_BLOGS = [
  {
    id: 'blog-maheshwari-history-01',
    title: 'The Living Heritage of Maheshwari Sarees: From Ahilyabai Holkar to Modern Runways',
    slug: 'the-living-heritage-of-maheshwari-sarees-ahilyabai-holkar',
    category: 'Weaving Heritage',
    excerpt: 'Discover how Queen Ahilyabai Holkar invited master weavers from Surat and Malwa in the 18th century to create the iconic lightweight Maheshwari saree featuring royal fort motifs.',
    content: `## A Royal Legacy Woven in Gold & Silk

The story of the Maheshwari saree is intrinsically tied to the visionary Maratha Queen, **Rajmata Ahilyabai Holkar** of Malwa. In the late 18th century, Queen Ahilyabai sought to design special royal garments and presents for dignitaries and royal guests visiting the historic capital of Maheshwar along the sacred Narmada River.

She personally invited traditional master weavers from Surat, Malwa, and South India to establish looms in the fort complex. Ahilyabai herself designed the earliest motifs, inspired by the intricate stone carvings on the walls of the Maheshwar Fort and the gentle ripples of the sacred Narmada river.

### The Iconic Characteristics of Maheshwari Craft:
1. **The Reversible Border (Bugdi / Karvat)**: A hallmark feature of genuine Maheshwari sarees is the reversible border, allowing the saree to be worn from either side with flawless finishing.
2. **Feather-Light Silk Cotton Blend**: Unlike heavy traditional silks, Maheshwari handlooms are celebrated for their airy lightness and regal shimmer, keeping the wearer cool in summers and regal in winters.
3. **Architectural Motifs**: Famous motifs such as *Chatai* (mat pattern), *Chameli* (jasmine flower), *Eent* (brick pattern), and *Heera* (diamond) continue to be handwoven with pure Zari threads.

Today, Reoti Handloom continues this royal tradition directly working with authentic third-generation weaver families in Maheshwar.`,
    author: 'Reoti Handloom Craft Studio',
    mediaType: 'image',
    mediaUrl: '/uploads/saree_1789923479221_mexzs.jpeg',
    readingTime: '4 min read',
    isFeatured: true,
    publishedAt: '2026-09-18T10:00:00.000Z',
    createdAt: '2026-09-18T10:00:00.000Z',
    updatedAt: '2026-09-18T10:00:00.000Z',
  },
  {
    id: 'blog-handloom-vs-powerloom-02',
    title: 'How to Identify 100% Genuine Maheshwari Handloom vs Fake Powerloom Sarees',
    slug: 'how-to-identify-genuine-maheshwari-handloom-vs-powerloom',
    category: 'Buyer Guide',
    excerpt: 'Learn the essential tactile and visual tests to verify authentic handloom weave, selvedge pin marks, reversible border density, and natural silk-cotton texture.',
    content: `## Protect Yourself from Powerloom Imitations

With the rising popularity of Maheshwari sarees across India and worldwide, machine-made synthetic imitations have flooded commercial markets. Here is the expert buyer guide from Reoti Handloom weavers on how to verify 100% authentic handloom:

### 1. The Selvedge & Loom Pin Marks (Kanni)
On a genuine handloom saree, look closely at the edges (selvedge). You will notice subtle pin marks where the fabric was held taut on the wooden loom frame during hand weaving. Powerloom synthetic copies have razor-straight, mechanically cut edges without pin marks.

### 2. The Reversible Zari Border
A genuine Maheshwari border is handwoven with balanced warp and weft tension. The reverse side looks nearly as clean and beautiful as the front side, without loose hanging floats or machine loop tangles.

### 3. Natural Silk-Cotton Breathability
Pure Maheshwari uses natural Mulberry silk in warp and combed cotton in weft. It has a natural organic drape, subtle matte-to-sheen glow, and never feels sticky or synthetic against sensitive skin.

### 4. Direct Weavers Guarantee
Always buy directly from authentic Maheshwar workshops like Reoti Handloom where every single piece is handcrafted on wooden pit looms with generational skill.`,
    author: 'Master Weaver Shivam',
    mediaType: 'image',
    mediaUrl: '/uploads/saree_1789240597301_iy1ww.jpeg',
    readingTime: '3 min read',
    isFeatured: true,
    publishedAt: '2026-09-15T12:00:00.000Z',
    createdAt: '2026-09-15T12:00:00.000Z',
    updatedAt: '2026-09-15T12:00:00.000Z',
  },
  {
    id: 'blog-saree-care-maintenance-03',
    title: 'Complete Handloom Care Guide: Washing, Ironing & Storing Your Silk Cotton Sarees',
    slug: 'handloom-saree-care-guide-washing-ironing-storing',
    category: 'Care & Maintenance',
    excerpt: 'Step-by-step master guide to keep your precious Maheshwari Zari borders shimmering and silk threads lustrous for decades without color bleeding.',
    content: `## Preserve Your Handloom Heirloom

A handcrafted Maheshwari saree is not just clothing; it is a timeless heirloom designed to last generations when cared for properly.

### Washing Best Practices
- **First Wash**: We always recommend dry cleaning for the very first wash, especially for dark shades like Crimson, Peacock Blue, and Wine.
- **Subsequent Washes**: Gently hand wash in cold water using a mild silk-friendly liquid detergent or soap nuts (Reetha). Never use harsh bleaching agents or fabric softeners.
- **Never Soak**: Do not leave your handloom saree soaked in soapy water for more than 3-5 minutes.

### Drying & Ironing
- Always dry in shade on a clean flat surface or padded hanger. Direct harsh sunlight can fade natural dyes and weaken silk threads.
- Iron on the reverse side on medium silk heat settings while the saree is slightly damp, or use a thin cotton press cloth over Zari borders.

### Safe Wardrobe Storage
- Wrap your sarees in breathable muslin or pure cotton saree covers.
- Avoid plastic storage bags which trap moisture and can tarnish metallic Zari.
- Refold your sarees every 3-4 months along different crease lines to prevent fiber stress.`,
    author: 'Sneha Ambekar',
    mediaType: 'image',
    mediaUrl: '/uploads/saree_1789240597301_iy1ww.jpeg',
    readingTime: '5 min read',
    isFeatured: false,
    publishedAt: '2026-09-10T14:30:00.000Z',
    createdAt: '2026-09-10T14:30:00.000Z',
    updatedAt: '2026-09-10T14:30:00.000Z',
  },
];

export function getAllBlogs() {
  const data = getStoreData();
  const blogs = Array.isArray(data.blogs) && data.blogs.length > 0 ? data.blogs : DEFAULT_BLOGS;
  return [...blogs].sort((a: any, b: any) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
}

export function getBlogBySlugOrId(slugOrId: string) {
  if (!slugOrId) return null;
  const decoded = decodeURIComponent(slugOrId).trim().toLowerCase();
  const all = getAllBlogs();

  return (
    all.find((b: any) => b.id === slugOrId || b.id === decoded) ||
    all.find((b: any) => (b.slug || '').toLowerCase().trim() === decoded) ||
    all.find((b: any) => (b.slug || '').toLowerCase().includes(decoded) || decoded.includes((b.slug || '').toLowerCase())) ||
    all.find((b: any) => (b.title || '').toLowerCase().includes(decoded.replace(/-/g, ' '))) ||
    null
  );
}

export function createBlogInStore(blogInput: any) {
  const data = getStoreData();
  const currentBlogs = Array.isArray(data.blogs) && data.blogs.length > 0 ? data.blogs : DEFAULT_BLOGS;

  const id = 'blog-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const title = (blogInput.title || 'Untitled Handloom Story').trim();
  const slug = (blogInput.slug || title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newBlog = {
    id,
    title,
    slug,
    category: blogInput.category || 'Handloom Stories',
    excerpt: blogInput.excerpt || (blogInput.content ? blogInput.content.substring(0, 160) + '...' : ''),
    content: blogInput.content || '',
    author: blogInput.author || 'Reoti Handloom Studio',
    mediaType: blogInput.mediaType || (blogInput.mediaUrl && (blogInput.mediaUrl.endsWith('.mp4') || blogInput.mediaUrl.endsWith('.webm') || blogInput.mediaUrl.includes('youtube') || blogInput.mediaUrl.includes('instagram')) ? 'video' : 'image'),
    mediaUrl: blogInput.mediaUrl || '/uploads/saree_1789923479221_mexzs.jpeg',
    videoUrl: blogInput.videoUrl || null,
    readingTime: blogInput.readingTime || '4 min read',
    isFeatured: Boolean(blogInput.isFeatured),
    tags: Array.isArray(blogInput.tags) ? blogInput.tags : (blogInput.tags ? blogInput.tags.split(',').map((t: string) => t.trim()) : ['Maheshwari', 'Handloom']),
    publishedAt: blogInput.publishedAt || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedBlogs = [newBlog, ...currentBlogs.filter((b: any) => b.id !== id)];
  saveStoreData({ blogs: updatedBlogs });
  return newBlog;
}

export function updateBlogInStore(id: string, updateInput: any) {
  const data = getStoreData();
  const currentBlogs = Array.isArray(data.blogs) && data.blogs.length > 0 ? data.blogs : DEFAULT_BLOGS;
  const index = currentBlogs.findIndex((b: any) => b.id === id);
  if (index === -1) return null;

  const existing = currentBlogs[index];
  const title = updateInput.title !== undefined ? updateInput.title.trim() : existing.title;
  const slug = updateInput.slug !== undefined
    ? updateInput.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : existing.slug;

  const updatedBlog = {
    ...existing,
    ...updateInput,
    title,
    slug,
    updatedAt: new Date().toISOString(),
  };

  const updatedBlogs = [...currentBlogs];
  updatedBlogs[index] = updatedBlog;
  saveStoreData({ blogs: updatedBlogs });
  return updatedBlog;
}

export function deleteBlogInStore(id: string) {
  const data = getStoreData();
  const currentBlogs = Array.isArray(data.blogs) && data.blogs.length > 0 ? data.blogs : DEFAULT_BLOGS;
  const updatedBlogs = currentBlogs.filter((b: any) => b.id !== id);
  saveStoreData({ blogs: updatedBlogs });
  return true;
}



