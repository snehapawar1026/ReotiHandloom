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
  orders?: any[];
  activities?: any[];
  users?: any[];
  leads?: any[];
}

let inMemoryStore: StoreData = {
  ...initialStoreData,
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
  const data = getStoreData();
  const decoded = decodeURIComponent(slugOrId || '').trim().toLowerCase();

  let product = data.products.find(
    (p) =>
      p.id === slugOrId ||
      p.slug?.toLowerCase().trim() === decoded ||
      p.slug === slugOrId ||
      p.title?.toLowerCase().trim() === decoded.replace(/-/g, ' ') ||
      p.title?.toLowerCase().includes(decoded.replace(/-/g, ' '))
  );

  if (!product) {
    product = data.products.find(
      (p) =>
        decoded.includes(p.slug?.toLowerCase().trim() || '') ||
        p.slug?.toLowerCase().includes(decoded)
    );
  }

  return product || null;
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

  const category = data.categories.find((c) => c.id === productInput.categoryId);

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
    categoryId: productInput.categoryId || (data.categories[0]?.id ?? ''),
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

  const categoryId = updateInput.categoryId || existing.categoryId;
  const category = data.categories.find((c) => c.id === categoryId) || existing.category;

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
    categoryId,
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
  return getStoreData().categories;
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
    items: typeof orderInput.items === 'string' ? orderInput.items : JSON.stringify(orderInput.items),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const orders = [newOrder, ...(data.orders || [])];
  saveStoreData({ orders });
  return newOrder;
}

export function logActivityInStore(activityInput: any) {
  const data = getStoreData();
  const id = crypto.randomUUID();

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
    createdAt: new Date().toISOString(),
  };

  const activities = [newActivity, ...(data.activities || [])].slice(0, 300);
  saveStoreData({ activities });
  return newActivity;
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


