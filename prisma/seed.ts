import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaBetterSqlite3({ url: 'file:dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with Reoti Handloom Maheshwari Sarees and Users...');

  // Clean existing data
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Admin & Customer Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Reoti Admin',
      email: 'admin@reotihandloom.com',
      password: 'Hariom@2618',
      phone: '9826000000',
      role: 'admin',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Ananya Sharma',
      email: 'customer@gmail.com',
      password: 'customer123',
      phone: '9876543210',
      role: 'user',
      address: '123 Fort View Colony',
      city: 'Maheshwar',
      pincode: '451224',
    },
  });

  console.log('Users created: Admin (admin@reotihandloom.com / Hariom@2618)');

  // Seed Categories
  const catSilkCotton = await prisma.category.create({
    data: {
      name: 'Silk Cotton Maheshwari',
      slug: 'silk-cotton-maheshwari',
      description: 'Lightweight & comfortable Maheshwari sarees woven with pure silk warp and fine cotton weft.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catPureSilk = await prisma.category.create({
    data: {
      name: 'Pure Silk Maheshwari',
      slug: 'pure-silk-maheshwari',
      description: 'Luxurious 100% pure silk Maheshwari sarees with heavy zari borders for festive and bridal wear.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catTissueZari = await prisma.category.create({
    data: {
      name: 'Tissue Zari Maheshwari',
      slug: 'tissue-zari-maheshwari',
      description: 'Sheer shimmering Maheshwari sarees with golden and silver zari threads woven into the warp.',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catChataiBorder = await prisma.category.create({
    data: {
      name: 'Chatai Border Special',
      slug: 'chatai-border-special',
      description: 'Authentic Maheshwari mat-weave (Chatai) reversible borders crafted by master artisans.',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    },
  });

  // Seed Products
  const products = [
    {
      title: 'Royal Crimson Gold Zari Maheshwari Silk Cotton Saree',
      slug: 'royal-crimson-gold-zari-maheshwari-silk-cotton-saree',
      description: 'Handcrafted in Maheshwar, Madhya Pradesh. Features traditional Chatai border with reversible zari work, rich pallu, and light airy drape.',
      price: 4499,
      originalPrice: 7499,
      discountPercent: 40,
      fabric: 'Silk Cotton',
      weaveType: 'Chatai Weave Border',
      borderType: 'Gold Zari',
      color: 'Crimson Red',
      lengthWithBlouse: '6.3 Meters (With Unstitched Blouse Piece)',
      occasion: 'Festive & Weddings',
      isFeatured: true,
      isBestSeller: true,
      isAuthenticCraft: true,
      rating: 4.9,
      reviewCount: 58,
      stock: 12,
      categoryId: catSilkCotton.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      ]),
    },
    {
      title: 'Narmada Wave Peacock Blue Pure Silk Maheshwari Saree',
      slug: 'narmada-wave-peacock-blue-pure-silk-maheshwari-saree',
      description: 'Pure Mulberry Silk saree with iconic Narmada Leheriya wave motif border. Woven carefully on handlooms by royal weavers of Maheshwar.',
      price: 8999,
      originalPrice: 13999,
      discountPercent: 35,
      fabric: 'Pure Silk',
      weaveType: 'Narmada Wave Border',
      borderType: 'Gold & Silver Zari',
      color: 'Peacock Blue',
      lengthWithBlouse: '6.3 Meters (With Unstitched Blouse Piece)',
      occasion: 'Bridal & Grand Reception',
      isFeatured: true,
      isBestSeller: true,
      isAuthenticCraft: true,
      rating: 5.0,
      reviewCount: 34,
      stock: 8,
      categoryId: catPureSilk.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      ]),
    },
    {
      title: 'Tissue Gold Bugdi Border Ivory Maheshwari Saree',
      slug: 'tissue-gold-bugdi-border-ivory-maheshwari-saree',
      description: 'An ethereal Ivory Tissue Maheshwari saree with traditional Bugdi border. Shimmers softly under evening light, perfect for regal occasions.',
      price: 6799,
      originalPrice: 10999,
      discountPercent: 38,
      fabric: 'Tissue Silk',
      weaveType: 'Bugdi Border',
      borderType: 'Antique Gold Zari',
      color: 'Ivory White',
      lengthWithBlouse: '6.3 Meters (With Unstitched Blouse Piece)',
      occasion: 'Festive & Cocktail',
      isFeatured: true,
      isBestSeller: false,
      isAuthenticCraft: true,
      rating: 4.8,
      reviewCount: 29,
      stock: 10,
      categoryId: catTissueZari.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
      ]),
    },
    {
      title: 'Rani Pink Reversible Zari Border Maheshwari Silk Cotton',
      slug: 'rani-pink-reversible-zari-border-maheshwari-silk-cotton',
      description: 'Vibrant Rani Pink shade paired with contrasting mustard pallu. Features reversible border design unique to Maheshwari weaving traditions.',
      price: 5299,
      originalPrice: 8499,
      discountPercent: 37,
      fabric: 'Silk Cotton',
      weaveType: 'Reversible Border',
      borderType: 'Gold Zari',
      color: 'Rani Pink',
      lengthWithBlouse: '6.3 Meters (With Unstitched Blouse Piece)',
      occasion: 'Puja & Family Functions',
      isFeatured: false,
      isBestSeller: true,
      isAuthenticCraft: true,
      rating: 4.7,
      reviewCount: 41,
      stock: 15,
      categoryId: catChataiBorder.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      ]),
    },
  ];

  for (const item of products) {
    await prisma.product.create({ data: item });
  }

  // Seed Banners
  await prisma.banner.create({
    data: {
      title: 'ROYAL MAHESHWARI HERITAGE',
      subtitle: 'Authentic Handloom Sarees Woven Direct from Maheshwar Fort Artisans',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
      tag: 'FESTIVE SALE • UP TO 40% OFF',
      link: '/products',
      sortOrder: 1,
    },
  });

  await prisma.banner.create({
    data: {
      title: 'EXQUISITE SILK COTTON SAREES',
      subtitle: 'Featherlight Drape with Regal Reversible Zari Borders',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80',
      tag: 'NEW ARRIVALS 2026',
      link: '/products?category=silk-cotton-maheshwari',
      sortOrder: 2,
    },
  });

  console.log('Seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
