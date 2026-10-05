import type { Metadata } from 'next';
import { getAllProducts, getProductBySlugOrId, getStoreData, isSemiMaheshwari } from '@/lib/storeManager';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlugOrId(slug);

  if (!product) {
    return {
      title: 'Maheshwari Handloom Collection | Reoti Handloom',
      description: 'Explore authentic handwoven Maheshwari sarees and suits directly from weavers of Maheshwar.',
    };
  }

  const parsedImages: string[] = JSON.parse(product.images || '[]');
  const primaryImage = parsedImages[0] || '/logo.jpg';
  const absoluteImageUrl = primaryImage.startsWith('http')
    ? primaryImage
    : `https://reotihandloom.com${primaryImage}`;

  const title = `${product.title} | Authentic Maheshwari Handloom Saree - Reoti Handloom`;
  const description = `Buy ${product.title} online at ₹${product.price.toLocaleString()} from Reoti Handloom Maheshwar. 100% authentic ${
    product.fabric || 'Silk Cotton'
  } handloom saree in ${product.color || 'exclusive'} color with royal Zari border. Free Express Shipping across India & 7 Days Hassle-Free Returns.`;

  const keywords = [
    'Maheshwari Saree',
    'Maheshwari Sarees Online',
    'Pure Maheshwari Silk Saree',
    'Original Maheshwari Handloom Saree',
    'Maheshwari Silk Cotton Saree',
    'Buy Maheshwari Saree Online',
    'Maheshwari Saree Maheshwar',
    'Zari Border Saree',
    'Authentic Pitloom Handwoven Saree',
    'Ahilya Bai Holkar Maheshwari Saree',
    'Handwoven Saree with Blouse Piece',
    'Direct from Weavers Maheshwar',
    'Traditional Zari Pallu Saree',
    'Festive Wear Handloom Saree',
    'Wedding Maheshwari Saree',
    'Pure Handloom Sarees India',
    'Lightweight Silk Cotton Saree',
    'Soft Draping Pure Saree',
    'Eco-Friendly Handcrafted Textile',
    'Best Maheshwari Sarees Online',
    'Reoti Handloom Maheshwar',
    'Reoti Handloom Estd. 1960',
    `${product.color || 'Royal'} Maheshwari Saree`,
    `${product.title}`,
    'Wholesale Maheshwari Sarees Manufacturer',
    'Maheshwar Saree Shop Online',
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://reotihandloom.com/products/${product.slug || slug}`,
    },
    openGraph: {
      title: `${product.title} | ₹${product.price.toLocaleString()} • Reoti Handloom`,
      description,
      url: `https://reotihandloom.com/products/${product.slug || slug}`,
      siteName: 'Reoti Handloom',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: `${product.title} - Authentic Maheshwari Handloom Saree`,
          type: absoluteImageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg',
        },
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `${product.title} - Reoti Handloom Maheshwar`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | ₹${product.price.toLocaleString()} • Reoti Handloom`,
      description,
      images: [absoluteImageUrl],
    },
    other: {
      'og:image:secure_url': absoluteImageUrl,
      'image': absoluteImageUrl,
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'INR',
      'product:availability': product.isOutOfStock ? 'out of stock' : 'in stock',
      'product:condition': 'new',
      'product:brand': 'Reoti Handloom',
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlugOrId(slug);
  const allProds = getAllProducts();
  const allCats = getStoreData().categories || [];

  const isCurrentSemi = product ? isSemiMaheshwari(product, allCats) : false;

  // Candidate pool strictly matches the category realm (Semi vs Authentic Handloom)
  const candidatePool = product
    ? allProds.filter((p) => {
        if (p.id === product.id) return false;
        const isP_Semi = isSemiMaheshwari(p, allCats);
        return isCurrentSemi ? isP_Semi : !isP_Semi;
      })
    : [];

  const currentDesign = product?.designCode?.trim().toLowerCase();

  // Find color variants strictly based on exact designCode matching
  let colorVariants: any[] = [];
  if (product) {
    if (currentDesign) {
      colorVariants = candidatePool.filter(
        (p) => p.designCode && p.designCode.trim().toLowerCase() === currentDesign
      );
    } else {
      colorVariants = candidatePool.filter(
        (p) => !p.designCode && p.categoryId === product.categoryId && p.fabric === product.fabric
      );
    }
    if (!colorVariants.some((p) => p.id === product.id)) {
      colorVariants = [product, ...colorVariants];
    }
  }

  // Find related products (Customers Also Liked)
  let relatedProducts = product
    ? candidatePool.filter((p) => p.categoryId === product.categoryId).slice(0, 4)
    : [];
  if (product && relatedProducts.length < 4) {
    const existingIds = new Set(relatedProducts.map((p) => p.id));
    const moreRelated = candidatePool
      .filter((p) => !existingIds.has(p.id))
      .slice(0, 4 - relatedProducts.length);
    relatedProducts = [...relatedProducts, ...moreRelated];
  }

  const parsedImages: string[] = product?.images ? JSON.parse(product.images || '[]') : [];
  const primaryImage = parsedImages[0] || '/rh-logo.png';
  const absoluteImageUrl = primaryImage.startsWith('http')
    ? primaryImage
    : `https://reotihandloom.com${primaryImage}`;

  const jsonLdProduct = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: parsedImages.map((img) =>
          img.startsWith('http') ? img : `https://reotihandloom.com${img}`
        ),
        description:
          product.description ||
          `Authentic ${product.fabric || 'Maheshwari Handloom'} Saree in ${product.color || 'Royal'} shade handcrafted by master weavers at Reoti Handloom Maheshwar.`,
        sku: product.id,
        mpn: product.slug || product.id,
        brand: {
          '@type': 'Brand',
          name: 'Reoti Handloom',
        },
        category: product.category?.name || 'Maheshwari Sarees',
        material: product.fabric || 'Silk Cotton Handloom',
        color: product.color || 'Multicolor',
        countryOfOrigin: 'IN',
        keywords: 'Maheshwari Saree, Pure Maheshwari Silk Saree, Buy Maheshwari Saree Online, Original Maheshwari Handloom Saree, Silk Cotton Maheshwari Saree, Zari Border Saree, Reoti Handloom Maheshwar',
        offers: {
          '@type': 'Offer',
          url: `https://reotihandloom.com/products/${product.slug || slug}`,
          priceCurrency: 'INR',
          price: product.price,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.isOutOfStock
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Reoti Handloom Maheshwar',
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'IN',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 7,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'INR',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 2,
                unitCode: 'd',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 3,
                maxValue: 6,
                unitCode: 'd',
              },
            },
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '331',
          bestRating: '5',
          worstRating: '1',
        },
      }
    : null;

  const jsonLdBreadcrumb = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://reotihandloom.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: product.category?.name || 'Maheshwari Sarees',
            item: `https://reotihandloom.com/products?category=${product.category?.slug || 'maheshwari-sarees'}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.title,
            item: `https://reotihandloom.com/products/${product.slug || slug}`,
          },
        ],
      }
    : null;

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is this an authentic handloom Maheshwari saree?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, this saree is authentic handwoven on traditional wooden pit looms by 3rd generation master weavers in Maheshwar, Madhya Pradesh, crafted with pure Mulberry Silk and Mercerised Cotton natural threads.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is a matching blouse piece included with this saree?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, every saree comes with an authentic matching 80cm unstitched blouse piece attached.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the wash care instructions for this saree?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Dry clean is recommended for the first wash to preserve the natural silk luster and metallic zari border. For subsequent maintenance, gently hand wash in cold water using mild silk-friendly detergent.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the delivery timeline and shipping fee?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We provide 100% Free Express Delivery across India. Orders are dispatched within 24 to 48 hours and typically reach your doorstep within 3 to 6 working days.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is your return and exchange policy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer a 7-day hassle-free return and exchange policy from the date of delivery for complete customer satisfaction.',
        },
      },
    ],
  };

  return (
    <>
      {jsonLdProduct && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
        />
      )}
      {jsonLdBreadcrumb && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <ProductDetailClient
        initialProduct={product}
        initialRelatedProducts={relatedProducts}
        initialColorVariants={colorVariants}
        initialCandidatePool={candidatePool}
        slug={slug}
      />
    </>
  );
}

