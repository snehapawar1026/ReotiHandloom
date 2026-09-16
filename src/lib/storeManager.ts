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
}

let inMemoryStore: StoreData = {
  ...initialStoreData,
  orders: (initialStoreData as any).orders || [],
  activities: (initialStoreData as any).activities || [],
  users: (initialStoreData as any).users || [],
};

function getStorageFilePath(): string {
  const filePath = path.join(process.cwd(), 'src', 'data', 'storeData.json');
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
  }
  return filePath;
}

export function getStoreData(): StoreData {
  const filePath = getStorageFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      inMemoryStore = {
        ...inMemoryStore,
        ...parsed,
        categories: parsed.categories || inMemoryStore.categories || [],
        products: parsed.products || inMemoryStore.products || [],
        banners: parsed.banners || inMemoryStore.banners || [],
        instaPosts: parsed.instaPosts || inMemoryStore.instaPosts || [],
        reviews: parsed.reviews || inMemoryStore.reviews || [],
        orders: parsed.orders || inMemoryStore.orders || [],
        activities: parsed.activities || inMemoryStore.activities || [],
        users: parsed.users || inMemoryStore.users || [],
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

  const filePath = getStorageFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(inMemoryStore, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.warn('[StoreManager] Write file warning:', err);
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

  const originalPrice = parseFloat(productInput.originalPrice) || parseFloat(productInput.price) || 0;
  const price = parseFloat(productInput.price) || 0;
  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : parseInt(productInput.discountPercent) || 0;

  const category = data.categories.find((c) => c.id === productInput.categoryId);

  let images = productInput.images;
  if (typeof images !== 'string') {
    images = JSON.stringify(images || []);
  }

  const isOutOfStock = Boolean(productInput.isOutOfStock);
  const stock = isOutOfStock ? 0 : productInput.stock !== undefined ? parseInt(productInput.stock) : 15;

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
    category: category ? { id: category.id, name: category.name, slug: category.slug } : undefined,
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
  const originalPrice =
    updateInput.originalPrice !== undefined ? parseFloat(updateInput.originalPrice) : existing.originalPrice;

  let discountPercent = existing.discountPercent;
  if (originalPrice && price && originalPrice > price) {
    discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  let images = updateInput.images !== undefined ? updateInput.images : existing.images;
  if (images && typeof images !== 'string') {
    images = JSON.stringify(images);
  }

  const categoryId = updateInput.categoryId || existing.categoryId;
  const category = data.categories.find((c) => c.id === categoryId) || existing.category;

  const isOutOfStock =
    updateInput.isOutOfStock !== undefined ? Boolean(updateInput.isOutOfStock) : existing.isOutOfStock;
  const stock =
    isOutOfStock
      ? 0
      : updateInput.stock !== undefined
      ? parseInt(updateInput.stock)
      : existing.stock;

  const updatedProduct = {
    ...existing,
    ...updateInput,
    price,
    originalPrice,
    discountPercent,
    images,
    categoryId,
    category: category ? { id: category.id, name: category.name, slug: category.slug } : existing.category,
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
    userIp: activityInput.userIp || '127.0.0.1',
    pageUrl: activityInput.pageUrl || '/',
    createdAt: new Date().toISOString(),
  };

  const activities = [newActivity, ...(data.activities || [])].slice(0, 200);
  saveStoreData({ activities });
  return newActivity;
}
