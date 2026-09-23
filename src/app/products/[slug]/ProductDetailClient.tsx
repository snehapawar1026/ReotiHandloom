'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useShop, ProductItem } from '@/context/ShopContext';
import { ProductCard } from '@/components/ProductCard';
import { MobileProductSlider } from '@/components/MobileProductSlider';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Star,
  ChevronRight,
  Check,
  MessageSquare,
  User,
  ThumbsUp,
  Upload,
  Camera,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Feather,
  Leaf,
  Layers,
  Droplets,
  RotateCcw,
  Flame,
  FileText,
  Tag,
  Share2,
  ZoomIn,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Zap,
  Play,
  Video,
} from 'lucide-react';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.67-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// Rotating Trust Badges (91% Maximum Filled Bold Circular Icons)
const OriginalHandwovenIcon = () => (
  <img
    src="/images/handmade_love_badge.gif"
    alt="100% Original Handwoven"
    className="w-full h-full object-contain p-0.5"
  />
);

const HandloomLoomIcon = () => (
  <img
    src="/images/handloom_loom_badge.gif"
    alt="Handloom Made"
    className="w-full h-full object-contain p-0.5"
  />
);

const SustainableLeavesIcon = () => (
  <img
    src="/images/sustainable_leaves_badge.gif"
    alt="Highly Sustainable"
    className="w-full h-full object-contain p-0.5"
  />
);

const NaturalThreadsIcon = () => (
  <img
    src="/images/natural_threads_badge.gif"
    alt="Made from Natural Threads"
    className="w-full h-full object-contain p-0.5"
  />
);

interface ProductDetailClientProps {
  initialProduct?: ProductItem | null;
  slug: string;
}

export default function ProductDetailClient({ initialProduct, slug: propSlug }: ProductDetailClientProps) {
  const params = useParams();
  const router = useRouter();
  const slug = propSlug || (params?.slug as string) || '';

  const { user, addToCart, buyNow, toggleWishlist, isInWishlist, setIsCartOpen } = useShop();

  const [product, setProduct] = useState<ProductItem | null>(initialProduct || null);
  const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductItem[]>([]);
  const [colorVariants, setColorVariants] = useState<ProductItem[]>([]);
  const [reviews, setReviews] = useState<any[]>((initialProduct as any)?.reviews || []);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedImage, setSelectedImage] = useState<string>(() => {
    if (initialProduct?.images) {
      try {
        const parsed = JSON.parse(initialProduct.images);
        return parsed[0] || '';
      } catch (e) {
        return '';
      }
    }
    return '';
  });

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('');

  // Fall & Pico bidding & Lightbox state
  const [hasFallPico, setHasFallPico] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Nykaa Fashion-style Hover Magnifying Lens Zoom state
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setZoomPos({ x, y, percentX, percentY });
  };

  const handleMouseEnter = () => setIsHoverZooming(true);
  const handleMouseLeave = () => setIsHoverZooming(false);

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!product) return;
    const parsed: string[] = JSON.parse(product.images || '[]');
    if (parsed.length === 0) return;
    const nextIdx = (currentImageIdx + 1) % parsed.length;
    setCurrentImageIdx(nextIdx);
    setSelectedImage(parsed[nextIdx]);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!product) return;
    const parsed: string[] = JSON.parse(product.images || '[]');
    if (parsed.length === 0) return;
    const prevIdx = (currentImageIdx - 1 + parsed.length) % parsed.length;
    setCurrentImageIdx(prevIdx);
    setSelectedImage(parsed[prevIdx]);
  };

  const handleShare = async () => {
    if (!product) return;
    const cleanSlug = product.slug || slug;
    const shareUrl = `https://reotihandloom.com/products/${cleanSlug}`;
    const message = `✨ *${product.title}*\n${shareUrl}\n\n💰 *Price*: ₹${product.price.toLocaleString()} (FREE Express Shipping)\n🧵 *Fabric*: ${product.fabric || 'Maheshwari Handloom'}\n🎨 *Color*: ${product.color || 'As Shown'}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${product.title} | Reoti Handloom`,
          text: message,
        });
      } catch (err) {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const handleDirectWhatsAppShare = () => {
    if (!product) return;
    const cleanSlug = product.slug || slug;
    const shareUrl = `https://reotihandloom.com/products/${cleanSlug}`;
    const message = `✨ *${product.title}*\n${shareUrl}\n\n💰 *Price*: ₹${product.price.toLocaleString()} (FREE Express Shipping)\n🧵 *Fabric*: ${product.fabric || 'Maheshwari Handloom'}\n🎨 *Color*: ${product.color || 'As Shown'}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  // Expandable Accordion Sections State (Matching Design Image)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    wash: true,
    shipping: false,
    returns: false,
    iron: false,
    details: true,
    tags: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Customer Review Form state
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewerRating, setReviewerRating] = useState(0);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [isUploadingReviewImage, setIsUploadingReviewImage] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    if (user?.name && !reviewerName) {
      setReviewerName(user.name);
    }
  }, [user, reviewerName]);

  const [allStoreProducts, setAllStoreProducts] = useState<ProductItem[]>([]);
  const [isRecRotating, setIsRecRotating] = useState(false);

  const isSemiProduct = (prod: any) => {
    if (!prod) return false;
    const catId = prod.categoryId || prod.category?.id;
    const catSlug = (prod.category?.slug || '').toLowerCase();
    const catName = (prod.category?.name || '').toLowerCase();
    const title = (prod.title || '').toLowerCase();
    const fabric = (prod.fabric || '').toLowerCase();
    const design = (prod.designCode || '').toLowerCase();
    const pSlug = (prod.slug || '').toLowerCase();

    return (
      catId === 'semi-maheshwari-sarees-id' ||
      catSlug.includes('semi-maheshwari') ||
      catName.includes('semi maheshwari') ||
      title.includes('semi maheshwari') ||
      title.includes('semi-maheshwari') ||
      title.startsWith('semi ') ||
      fabric.includes('semi') ||
      design.includes('semi') ||
      pSlug.includes('semi-maheshwari')
    );
  };

  const shufflePdpRecommended = (list: ProductItem[]) => {
    if (!list || list.length === 0) return;
    setIsRecRotating(true);
    setTimeout(() => {
      const others = list.filter((p: any) => p.slug !== slug && p.id !== product?.id);
      const shuffled = [...others].sort(() => 0.5 - Math.random());
      setRecommendedProducts(shuffled.slice(0, 4));
      setIsRecRotating(false);
    }, 250);
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          const currentProd = data.product;
          setProduct(currentProd);
          setRelatedProducts(data.relatedProducts || []);
          setColorVariants(data.colorVariants || []);
          setReviews(currentProd.reviews || []);
          const parsedImages = JSON.parse(currentProd.images || '[]');
          if (parsedImages.length > 0) setSelectedImage(parsedImages[0]);

          const currentIsSemi = isSemiProduct(currentProd);

          // Fetch recommended products matching exact craft category (Strictly never mixing Semi & Handloom)
          fetch('/api/products?includeAll=true')
            .then((res) => res.json())
            .then((prodData) => {
              if (prodData.success && prodData.products) {
                const filtered = prodData.products.filter((p: any) => {
                  if (p.slug === slug || p.id === currentProd.id) return false;
                  const pIsSemi = isSemiProduct(p);
                  return currentIsSemi ? pIsSemi : !pIsSemi;
                });
                setAllStoreProducts(filtered);
                const shuffled = [...filtered].sort(() => 0.5 - Math.random());
                setRecommendedProducts(shuffled.slice(0, 4));
              }
            })
            .catch(console.error);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  // Auto-rotate PDP recommended products every 8 seconds
  useEffect(() => {
    if (allStoreProducts.length === 0) return;
    const interval = setInterval(() => {
      shufflePdpRecommended(allStoreProducts);
    }, 8000);

    return () => clearInterval(interval);
  }, [allStoreProducts, slug]);

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingReviewImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setReviewImage(data.url);
      } else {
        alert('Image upload failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsUploadingReviewImage(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (reviewerRating === 0) {
      setReviewMsg('Please select rating stars (1 to 5 stars) before submitting.');
      return;
    }
    if (!reviewerName || !reviewerComment) {
      setReviewMsg('Please enter your name and review details.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: reviewerName,
          userEmail: user?.email || '',
          rating: reviewerRating,
          comment: reviewerComment,
          image: reviewImage || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewMsg('✓ Thank you! Your review with photo has been published successfully.');
        setReviewerComment('');
        setReviewImage('');
        setReviewerRating(0);
        
        // Append new review to state
        setReviews((prev) => [data.review, ...prev]);

        // Update product rating and review count live
        setProduct((prevProduct) =>
          prevProduct
            ? {
                ...prevProduct,
                rating: data.newRating,
                reviewCount: data.newReviewCount,
              }
            : null
        );
      } else {
        setReviewMsg('Error submitting review: ' + data.error);
      }
    } catch (err: any) {
      setReviewMsg('Error submitting review: ' + err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-gray-600 mt-4">Loading Saree details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans space-y-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Saree Not Found</h2>
        <p className="text-xs text-gray-500">The requested Maheshwari Saree does not exist.</p>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-2.5 bg-rose-600 text-white font-bold text-xs rounded hover:bg-rose-700"
        >
          Explore All Sarees
        </button>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const parsedImages: string[] = JSON.parse(product.images || '[]');

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const mainImg = selectedImage || (parsedImages.length > 0 ? parsedImages[0] : '');
    const fullImgUrl = mainImg.startsWith('http')
      ? mainImg
      : (typeof window !== 'undefined' ? `${window.location.origin}${mainImg}` : mainImg);

    const fallPicoMsg = hasFallPico ? '\n✂️ *Fall & Pico Bidding*: Included (+₹200)' : '';
    const finalPrice = product.price + (hasFallPico ? 200 : 0);

    const message = `Hello Reoti Handloom! 🙏\n\nI want to make a Wholesale / Bulk Inquiry for this product:\n\n📌 *Product Name*: ${product.title}\n💰 *Price*: ₹${finalPrice.toLocaleString()}${fallPicoMsg}\n🎨 *Color*: ${product.color || 'As Shown'}\n🧵 *Fabric*: ${product.fabric || 'Maheshwari Handloom'}\n\n🔗 *Product Link*: ${pageUrl}\n🖼️ *Product Picture*: ${fullImgUrl}\n\nPlease share wholesale prices, MOQ & catalog details!`;

    const whatsappUrl = `https://wa.me/919617444445?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setDeliveryMsg(`✓ Express Delivery available to ${pincode} in 3-5 business days. FREE Shipping!`);
    } else {
      setDeliveryMsg('Please enter a valid 6-digit Pincode.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Breadcrumb Path */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-medium">
        <span className="cursor-pointer hover:text-rose-600" onClick={() => router.push('/')}>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="cursor-pointer hover:text-rose-600" onClick={() => router.push('/products')}>Women</span>
        <ChevronRight className="w-3 h-3" />
        <span className="cursor-pointer hover:text-rose-600" onClick={() => router.push('/products')}>Indianwear</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* PDP Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Gallery Column: Full Track Stretch with high Z-index stacking context */}
        <div className="lg:col-span-6 relative z-30">
          <div className="lg:sticky lg:top-24 flex flex-col sm:flex-row gap-4 relative z-30">
            
            {/* Desktop Vertical Thumbnail Strip (Left Side) */}
            {(parsedImages.length > 0 || product.videoUrl) && (
              <div className="hidden sm:flex sm:flex-col gap-3 overflow-y-auto shrink-0 max-h-[580px] no-scrollbar">
                {product.videoUrl && (
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="w-16 h-20 rounded-lg border-2 border-amber-600 bg-neutral-950 text-amber-300 flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer shadow-md hover:scale-105 transition-all group/vid"
                    title="Watch Saree Draping Video"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 group-hover/vid:bg-amber-500/40 flex items-center justify-center text-amber-300">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider">Video</span>
                  </button>
                )}
                {parsedImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(imgUrl);
                      setCurrentImageIdx(idx);
                    }}
                    className={`w-16 h-20 rounded-lg border-2 overflow-hidden bg-slate-100 transition-all shrink-0 cursor-pointer ${
                      selectedImage === imgUrl ? 'border-rose-600 shadow-md ring-2 ring-rose-200' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Large Image Container */}
            <div className="flex-1 flex flex-col gap-3">
              {/* Main Large Image Area with Nykaa Hover Magnifying Lens & Click Zoom */}
              <div
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsLightboxOpen(true)}
                onContextMenu={(e) => e.preventDefault()}
                className="w-full relative cursor-zoom-in select-none group"
              >
                {/* Inner Clipped Image Container */}
                <div
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-[460px] sm:h-[560px] max-h-[580px] rounded-xl overflow-hidden bg-slate-100/80 relative border border-slate-200 shadow-sm flex items-center justify-center select-none"
                >
                  <img
                    src={selectedImage || parsedImages[0]}
                    alt={product.title}
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300 select-none pointer-events-none"
                  />

                  {/* Automatic Diagonal Heritage Watermark Overlay */}
                  <WatermarkOverlay variant="pdp" imageUrl={selectedImage || parsedImages[0]} />

                  {/* Nykaa-style Translucent Hover Lens Box over Image */}
                  {isHoverZooming && (
                    <div
                      className="absolute w-44 h-44 border-2 border-white/90 bg-white/30 backdrop-blur-[1px] pointer-events-none rounded shadow-md z-20 hidden lg:block"
                      style={{
                        left: `calc(${zoomPos.percentX}% - 88px)`,
                        top: `calc(${zoomPos.percentY}% - 88px)`,
                      }}
                    />
                  )}

                  {/* Top Right Zoom Plus Button (Matching Reference Design) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-lg shadow-md border border-gray-300 transition-transform active:scale-95 cursor-pointer z-10 flex items-center justify-center"
                    title="Zoom Full Screen"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-800" />
                  </button>

                  {/* Watch Video Button Badge Overlay on Main Image */}
                  {product.videoUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsVideoModalOpen(true);
                      }}
                      className="absolute top-3 left-3 bg-neutral-950/85 hover:bg-neutral-950 text-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-full border border-amber-500/50 shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer z-20"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch Saree Video</span>
                    </button>
                  )}

                  {/* Navigation Arrow Buttons on Image Sides */}
                  {parsedImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-md border border-gray-300 transition-all active:scale-95 cursor-pointer z-20 flex items-center justify-center"
                        title="Previous Photo"
                      >
                        <ArrowLeft className="w-4 h-4 text-gray-900" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-md border border-gray-300 transition-all active:scale-95 cursor-pointer z-20 flex items-center justify-center"
                        title="Next Photo"
                      >
                        <ArrowRight className="w-4 h-4 text-gray-900" />
                      </button>
                    </>
                  )}

                  {/* Reoti Handloom Premium Glass Watermark Seal Overlay (Bottom-Left) */}
                  <div className="absolute bottom-3 left-3 sm:left-3 bg-white/95 backdrop-blur-md text-amber-950 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-amber-300/90 shadow-md pointer-events-none flex items-center gap-1.5 z-10">
                    <div className="w-4 h-4 rounded-full overflow-hidden border border-amber-500 shrink-0">
                      <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-serif font-extrabold text-amber-950 text-[11px] tracking-wide">
                      Reoti Handloom
                    </span>
                    <span className="w-1 h-1 rounded-full bg-amber-500 opacity-60" />
                    <span className="text-[9px] text-amber-800 font-semibold tracking-normal lowercase">
                      authentic
                    </span>
                  </div>
                </div>

                {/* Nykaa-style Floating Magnified Zoom Preview Box (Unclipped on Right Side over Details Column) */}
                {isHoverZooming && (
                  <div className="absolute top-0 left-[calc(100%+1.25rem)] z-50 w-[540px] h-[560px] rounded-xl overflow-hidden border-2 border-gray-300 shadow-2xl bg-white hidden lg:block pointer-events-none transition-opacity duration-200">
                    <div
                      className="w-full h-full bg-no-repeat"
                      style={{
                        backgroundImage: `url(${selectedImage || parsedImages[0]})`,
                        backgroundSize: '280%',
                        backgroundPosition: `${zoomPos.percentX}% ${zoomPos.percentY}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Mobile Horizontal Thumbnail Strip (Below Main Image) */}
              {(parsedImages.length > 1 || product.videoUrl) && (
                <div className="flex sm:hidden gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar items-center">
                  {product.videoUrl && (
                    <button
                      onClick={() => setIsVideoModalOpen(true)}
                      className="w-14 h-18 rounded-lg border-2 border-amber-600 bg-neutral-950 text-amber-300 flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer shadow-md"
                      title="Watch Saree Video"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span className="text-[8px] font-extrabold uppercase">Video</span>
                    </button>
                  )}
                  {parsedImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(imgUrl);
                        setCurrentImageIdx(idx);
                      }}
                      className={`w-14 h-18 rounded-lg border-2 overflow-hidden bg-slate-100 transition-all shrink-0 cursor-pointer ${
                        selectedImage === imgUrl ? 'border-rose-600 shadow-md ring-2 ring-rose-200' : 'border-gray-200 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-6 space-y-5 relative z-10">
          
          {/* BESTSELLER Tag */}
          <div>
            {product.isBestSeller && (
              <span className="inline-block bg-rose-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded tracking-wider mb-2">
                BESTSELLER
              </span>
            )}

            {/* Brand Title with Official Logo Seal */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 p-0.5 bg-amber-100 shrink-0 shadow-xs">
                <img src="/logo.jpg" alt="Reoti Handloom" className="w-full h-full object-cover object-top rounded-full" />
              </div>
              <div>
                <h2 className="font-serif font-extrabold text-lg text-amber-950 tracking-tight leading-none">
                  Reoti Handloom
                </h2>
                <p className="text-[10px] text-amber-800 font-medium italic mt-0.5">
                  Something "more" in Maheshwari Handloom
                </p>
              </div>
            </div>

            {/* Product Title & SHARE Button */}
            <div className="flex items-start justify-between gap-4 mt-1">
              <h1 className="text-base text-gray-700 font-medium leading-snug flex-1">
                {product.title}
              </h1>
              <div className="flex flex-col items-end shrink-0 gap-1.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleDirectWhatsAppShare}
                    className="px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Share directly on WhatsApp"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-2.5 py-1.5 border border-amber-950/40 hover:border-amber-950 text-amber-950 hover:bg-amber-50 rounded font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Share / Copy product link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>SHARE</span>
                  </button>
                </div>
                {shareCopied && (
                  <span className="text-[10px] font-bold text-emerald-700">
                    ✓ Link Copied!
                  </span>
                )}
              </div>
            </div>

            {/* Rating Box */}
            <div className="flex items-center gap-2 mt-2">
              {reviews.length > 0 || (product.reviewCount && product.reviewCount > 0) ? (
                <>
                  <div className="flex items-center gap-1 border border-emerald-300 rounded px-2 py-0.5 text-xs font-bold text-emerald-800 bg-emerald-50">
                    <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                    <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Based on {reviews.length > 0 ? reviews.length : product.reviewCount} verified rating{(reviews.length > 1 || (product.reviewCount && product.reviewCount > 1)) ? 's' : ''}
                  </span>
                </>
              ) : (
                <span className="text-xs text-amber-900 bg-amber-50/80 border border-amber-200 px-2.5 py-1 rounded-md font-medium">
                  ★ No customer ratings yet. Be the first to review this saree!
                </span>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="py-3.5 border-y border-gray-200 space-y-1 bg-white">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl font-extrabold text-gray-900 font-sans">
                ₹{(product.price + (hasFallPico ? 200 : 0)).toLocaleString()}
              </span>
              {product.discountPercent && product.discountPercent > 0 && product.originalPrice && product.originalPrice > product.price ? (
                <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {product.discountPercent}% Off
                </span>
              ) : null}
              {hasFallPico && (
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  + ₹200 Fall & Pico
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="text-xs text-gray-500 font-medium">
                MRP <span className="line-through font-sans">₹{(product.originalPrice + (hasFallPico ? 200 : 0)).toLocaleString()}</span> <span className="text-[11px] text-gray-400">Inclusive of all taxes</span>
              </div>
            ) : (
              <div className="text-xs text-gray-400 font-medium">
                <span>Inclusive of all taxes</span>
              </div>
            )}
          </div>

          {/* Stock Scarcity Indicator Bar (Matching Reference - Visible ONLY when stock is specified and > 0) */}
          {!product.isOutOfStock && product.stock !== undefined && product.stock !== null && product.stock > 0 && (
            <div className="py-2.5 px-3.5 bg-amber-50/70 border border-amber-200/90 rounded-xl space-y-1.5 shadow-2xs">
              <p className="text-xs text-gray-900 font-medium">
                Only <span className="font-extrabold text-gray-950">{product.stock} {product.stock === 1 ? 'item is' : 'items are'} in stock!</span>
              </p>
              <div className="w-full bg-gray-200/80 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.max(12, (product.stock / 10) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Fall and Pico Bidding Box (Matching Design Reference) */}
          <div className="bg-[#FAF7F2] border border-dashed border-[#D5CBB9] rounded-xl p-4 space-y-1 font-sans">
            <h4 className="font-bold text-sm text-gray-900">
              Fall and Pico Bidding
            </h4>
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-gray-900 select-none pt-1">
              <input
                type="checkbox"
                checked={hasFallPico}
                onChange={(e) => setHasFallPico(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500 cursor-pointer accent-rose-600"
              />
              <span>Fall & Pico Bidding (Rs. 200.00)</span>
            </label>
            <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed italic pt-1">
              Returns or exchanges cannot be accepted after Pico and Fall are completed.
            </p>
          </div>

          {/* Nykaa Fashion-Style Color Selector Swatches */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <span>SELECT COLOR:</span>
                <span className="text-amber-950 font-serif font-extrabold capitalize text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{product.color}</span>
              </h3>
              {colorVariants.length > 1 && (
                <span className="text-[11px] text-gray-500 font-semibold">
                  {colorVariants.length} Color Options
                </span>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {colorVariants.length > 0 ? (
                colorVariants.map((variant) => {
                  const varImgs = JSON.parse(variant.images || '[]');
                  const varImg = varImgs[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';
                  const isCurrent = variant.id === product.id;

                  return (
                    <button
                      key={variant.id}
                      onClick={() => router.push(`/products/${variant.slug}`)}
                      className={`group relative flex flex-col items-center shrink-0 w-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer ${
                        isCurrent
                          ? 'border-gray-900 ring-2 ring-gray-900/20 shadow-md scale-102'
                          : 'border-gray-200 hover:border-gray-500 opacity-85 hover:opacity-100'
                      }`}
                      title={`${variant.title} - ${variant.color}`}
                    >
                      <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 relative">
                        <img src={varImg} alt={variant.color} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {isCurrent && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center shadow-md">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-gray-900 truncate max-w-full mt-1.5 font-sans">
                        {variant.color}
                      </span>
                      <span className="text-[9px] font-extrabold text-amber-950">
                        ₹{variant.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })
              ) : (
                parsedImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedColorIdx(idx);
                      setSelectedImage(img);
                    }}
                    className={`w-16 h-20 rounded-lg border-2 overflow-hidden relative transition-all ${
                      selectedColorIdx === idx ? 'border-gray-900 ring-2 ring-gray-900' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt="Color Swatch" className="w-full h-full object-cover" />
                    {selectedColorIdx === idx && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Out of Stock Alert Banner */}
          {Boolean(product.isOutOfStock) && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 font-bold text-xs flex items-center gap-2 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              <span>🚫 Currently Out of Stock. Contact us on WhatsApp for loom pre-orders!</span>
            </div>
          )}

          {/* Action Buttons: ADD TO BAG, WISHLIST, BUY IT NOW & WHATSAPP WHOLESALE INQUIRY */}
          <div className="space-y-2.5 pt-2">
            {/* Row 1: Add to Bag & Wishlist */}
            <div className="flex gap-3">
              {product.isOutOfStock ? (
                <button
                  disabled
                  className="flex-1 py-3.5 bg-slate-200 text-slate-500 font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-xs cursor-not-allowed flex items-center justify-center gap-2 border border-slate-300"
                >
                  <span>OUT OF STOCK</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    addToCart(product, { hasFallPico, fallPicoPrice: 200 });
                    setIsCartOpen(true);
                  }}
                  className="flex-1 py-3.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag</span>
                </button>
              )}

              <button
                onClick={() => toggleWishlist(product)}
                className={`px-5 py-3.5 border rounded-lg font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLiked ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-gray-300 text-gray-800 hover:border-gray-900 bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>Wishlist</span>
              </button>
            </div>

            {/* Row 2: BUY IT NOW Button (Deep Luxury Royal Maroon / Crimson Button matching Reference Image) */}
            {!product.isOutOfStock && (
              <button
                onClick={() => {
                  addToCart(product, { hasFallPico, fallPicoPrice: 200 });
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="w-full py-3.5 bg-[#4A0E17] hover:bg-[#380A11] text-amber-50 font-black text-xs uppercase tracking-widest rounded-lg shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 border border-amber-900/30 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>BUY IT NOW</span>
              </button>
            )}

            {/* Row 3: Direct WhatsApp Wholesale Inquiry Button */}
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 border border-emerald-600/30 cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white text-white" />
              <span>Wholesale Inquiry on WhatsApp</span>
            </button>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-2 text-xs">
            <label className="font-extrabold text-gray-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-rose-600" />
              <span>Delivery Options</span>
            </label>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-rose-600 font-medium"
              />
              <button type="submit" className="bg-gray-900 hover:bg-black text-white font-bold px-4 py-2 rounded-lg transition-colors">
                Check
              </button>
            </form>
            {deliveryMsg && (
              <p className={`text-[11px] font-semibold ${deliveryMsg.startsWith('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                {deliveryMsg}
              </p>
            )}
          </div>

          {/* Trust Badges & Accordion Product Details Section (Matching Reference Design) */}
          <div className="pt-6 border-t border-amber-200/80 space-y-5 text-xs font-sans">
            
            {/* Top 4 Circular Trust Badges (Matching Reference Screenshot - In Single Line) */}
            <div className="bg-[#FAF7F2] py-4 sm:py-6 px-1.5 sm:px-3 rounded-2xl border-0 grid grid-cols-4 gap-1.5 sm:gap-4 text-center items-start">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-13 h-13 sm:w-20 sm:h-20 rounded-full bg-[#E7E0D3] flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  <OriginalHandwovenIcon />
                </div>
                <span className="text-[10px] sm:text-xs md:text-sm font-sans font-bold sm:font-black text-[#0a0a0a] tracking-tight leading-tight max-w-[85px] sm:max-w-[130px] mt-1">
                  100% Original<br />Handwoven
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-13 h-13 sm:w-20 sm:h-20 rounded-full bg-[#E7E0D3] flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  <HandloomLoomIcon />
                </div>
                <span className="text-[10px] sm:text-xs md:text-sm font-sans font-bold sm:font-black text-[#0a0a0a] tracking-tight leading-tight max-w-[85px] sm:max-w-[130px] mt-1">
                  Handloom<br />Made
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-13 h-13 sm:w-20 sm:h-20 rounded-full bg-[#E7E0D3] flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  <SustainableLeavesIcon />
                </div>
                <span className="text-[10px] sm:text-xs md:text-sm font-sans font-bold sm:font-black text-[#0a0a0a] tracking-tight leading-tight max-w-[85px] sm:max-w-[130px] mt-1">
                  Highly<br />Sustainable
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-13 h-13 sm:w-20 sm:h-20 rounded-full bg-[#E7E0D3] flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  <NaturalThreadsIcon />
                </div>
                <span className="text-[10px] sm:text-xs md:text-sm font-sans font-bold sm:font-black text-[#0a0a0a] tracking-tight leading-tight max-w-[85px] sm:max-w-[130px] mt-1">
                  Made from<br />Natural Threads
                </span>
              </div>
            </div>

            {/* Dotted Accordion List */}
            <div className="space-y-1 bg-[#FAF6F0]/60 p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
              
              {/* Accordion 1: Wash & Care */}
              <div className="border-b border-dotted border-amber-900/30 pb-3.5 pt-1.5">
                <button
                  type="button"
                  onClick={() => toggleSection('wash')}
                  className="w-full flex items-center justify-between font-black text-base sm:text-lg text-gray-950 hover:text-amber-950 transition-colors py-2 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-amber-800 shrink-0" />
                    <span>Wash & Care</span>
                  </span>
                  {openSections.wash ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {openSections.wash && (
                  <div className="mt-3.5 pl-8 text-sm sm:text-base text-gray-900 font-semibold leading-relaxed space-y-3">
                    <p>
                      <strong className="text-black font-extrabold">Wash Care:</strong> Dry Wash Recommended. Do not Machine wash or soak in hard detergent. Please do a gentle wash if needed.
                    </p>
                    <p className="text-gray-700 italic text-xs sm:text-sm">
                      <strong className="text-gray-950 not-italic font-extrabold">Disclaimer:</strong> The pictures were taken in daylight. Colour may vary slightly from the image due to the screen brightness.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Shipping Information */}
              <div className="border-b border-dotted border-amber-900/30 py-3.5">
                <button
                  type="button"
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between font-black text-base sm:text-lg text-gray-950 hover:text-amber-950 transition-colors py-2 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-amber-800 shrink-0" />
                    <span>Shipping Information</span>
                  </span>
                  {openSections.shipping ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {openSections.shipping && (
                  <div className="mt-3.5 pl-8 text-sm sm:text-base text-gray-900 font-semibold leading-relaxed space-y-3">
                    <p>
                      We offer free shipping across India within a period of 4-5 working days of delivery. For international shipping, please contact us on WhatsApp.
                    </p>
                    <button
                      onClick={() => router.push('/policies/shipping-policy')}
                      className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs sm:text-sm uppercase rounded-lg border border-amber-300 cursor-pointer transition-colors shadow-2xs"
                    >
                      LEARN MORE
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion 3: Returns & Exchange */}
              <div className="border-b border-dotted border-amber-900/30 py-3.5">
                <button
                  type="button"
                  onClick={() => toggleSection('returns')}
                  className="w-full flex items-center justify-between font-black text-base sm:text-lg text-gray-950 hover:text-amber-950 transition-colors py-2 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-amber-800 shrink-0" />
                    <span>Returns & Exchange</span>
                  </span>
                  {openSections.returns ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {openSections.returns && (
                  <div className="mt-3.5 pl-8 text-sm sm:text-base text-gray-900 font-semibold leading-relaxed space-y-3">
                    <p>
                      We accept hassle-free returns and exchanges within 7 days of delivery.
                    </p>
                    <button
                      onClick={() => router.push('/policies/return-policy')}
                      className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs sm:text-sm uppercase rounded-lg border border-amber-300 cursor-pointer transition-colors shadow-2xs"
                    >
                      LEARN MORE
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion 4: Iron Instruction */}
              <div className="border-b border-dotted border-amber-900/30 py-3.5">
                <button
                  type="button"
                  onClick={() => toggleSection('iron')}
                  className="w-full flex items-center justify-between font-black text-base sm:text-lg text-gray-950 hover:text-amber-950 transition-colors py-2 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-amber-800 shrink-0" />
                    <span>Iron Instruction</span>
                  </span>
                  {openSections.iron ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {openSections.iron && (
                  <div className="mt-3.5 pl-8 text-sm sm:text-base text-gray-900 font-semibold leading-relaxed">
                    <p>Low temperature / keep a cloth over the garment to iron.</p>
                  </div>
                )}
              </div>

              {/* Accordion 5: Product Details */}
              <div className="border-b border-dotted border-amber-900/30 py-3.5">
                <button
                  type="button"
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between font-black text-base sm:text-lg text-gray-950 hover:text-amber-950 transition-colors py-2 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-800 shrink-0" />
                    <span>Product Details</span>
                  </span>
                  {openSections.details ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {openSections.details && (
                  <div className="mt-4 pl-8 space-y-4 text-sm sm:text-base text-gray-900 font-semibold leading-relaxed">
                    <p className="font-semibold text-gray-900">
                      This {product.title} is a traditional, handwoven saree designed for admirers of authentic craftsmanship and sustainable textiles.
                    </p>

                    <ul className="space-y-2.5 font-semibold text-gray-900">
                      <li className="flex items-start gap-1.5">
                        <span className="font-black text-black min-w-36 sm:min-w-44">• Saree Color:</span>
                        <span>{product.color || 'As Shown'}</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-black text-black min-w-36 sm:min-w-44">• Blouse Color:</span>
                        <span>{product.blouseColor || 'Running Blouse (Matching Saree Color)'}</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-black text-black min-w-36 sm:min-w-44">• Fabric & Weave:</span>
                        <span>{product.fabric || 'Silk Cotton Maheshwari'} (Authentic Handwoven)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-black text-black min-w-36 sm:min-w-44">• Border Type:</span>
                        <span>{product.borderType || 'Gold Zari'}</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-black text-black min-w-36 sm:min-w-44">• Craftsmanship:</span>
                        <span>Authentic handwoven with traditional look</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-black text-black min-w-36 sm:min-w-44">• Sustainability:</span>
                        <span>Highly sustainable; made from natural threads; natural dyed</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-black text-black min-w-36 sm:min-w-44">• Texture:</span>
                        <span>Soft in feel with graceful drape</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-black text-black min-w-36 sm:min-w-44">• Care:</span>
                        <span>Dry clean recommended</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-black text-black min-w-36 sm:min-w-44">• Dimensions:</span>
                        <span>{product.lengthWithBlouse || '6.3 Meters (With Blouse Piece)'}</span>
                      </li>
                    </ul>

                    <div className="pt-3.5 border-t border-amber-200/80 text-gray-900 font-semibold whitespace-pre-line leading-relaxed text-sm sm:text-base">
                      {product.description || 'Handcrafted with meticulous dedication by skilled artisans of Maheshwar, this authentic handloom saree exemplifies timeless elegance. Featuring traditional weaving techniques passed down through generations, rich metallic zari patterns, and lightweight pure silk-cotton texture for exquisite comfort and graceful drape.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 6: Tags */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => toggleSection('tags')}
                  className="w-full flex items-center justify-between font-black text-base sm:text-lg text-gray-950 hover:text-amber-950 transition-colors py-2 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-amber-800 shrink-0" />
                    <span>Tags</span>
                  </span>
                  {openSections.tags ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {openSections.tags && (
                  <div className="mt-3.5 pl-8 flex flex-wrap gap-2.5 text-xs sm:text-sm">
                    <span className="bg-amber-100 text-amber-950 px-3 py-1.5 rounded-lg font-black shadow-2xs">Authentic Maheshwari</span>
                    <span className="bg-amber-100 text-amber-950 px-3 py-1.5 rounded-lg font-black shadow-2xs">Handloom Saree</span>
                    <span className="bg-amber-100 text-amber-950 px-3 py-1.5 rounded-lg font-black shadow-2xs">Silk Cotton</span>
                    <span className="bg-amber-100 text-amber-950 px-3 py-1.5 rounded-lg font-black shadow-2xs">Reoti Handloom</span>
                    <span className="bg-amber-100 text-amber-950 px-3 py-1.5 rounded-lg font-black shadow-2xs">Festive Weave</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Customer Ratings & Reviews Section */}
      <section className="mt-16 pt-8 border-t border-gray-200 font-sans">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-rose-600" />
          <h2 className="text-xl font-serif font-extrabold text-gray-900">
            Customer Ratings & Reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Overall Rating Badge & Review Summary */}
          <div className="lg:col-span-4 bg-amber-50/40 p-6 rounded-2xl border border-amber-200/70 space-y-4 text-center">
            <p className="text-xs font-extrabold uppercase text-amber-900 tracking-wider">
              Overall Product Rating
            </p>
            
            {reviews.length > 0 ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-extrabold text-gray-900">
                  {product.rating ? product.rating.toFixed(1) : (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                </span>
                <div className="flex flex-col items-start">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating || (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length))
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium mt-0.5">
                    {reviews.length} Verified Customer Review{reviews.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-2 space-y-1">
                <div className="flex items-center justify-center gap-1 text-gray-300">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-gray-300 fill-gray-200" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-amber-950">No customer ratings yet</p>
                <p className="text-[11px] text-gray-500 font-medium">Be the first to rate & review this saree!</p>
              </div>
            )}

            <div className="pt-2 border-t border-amber-200/60 text-xs text-amber-950 font-medium space-y-1">
              <p className="flex items-center justify-center gap-1 text-[11px] text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Authentic Maheshwari Handloom Craft</span>
              </p>
            </div>
          </div>

          {/* Right Column: Write a Review Form */}
          <div className="lg:col-span-8 bg-white border border-gray-200 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Rate this Saree & Share Your Experience</span>
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              {/* Interactive Star Selection */}
              <div>
                <label className="block text-gray-700 font-bold mb-1.5">Select Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewerRating(star)}
                      className="p-1 hover:scale-115 transition-transform cursor-pointer"
                      title={`Rate ${star} out of 5 stars`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          reviewerRating > 0 && star <= reviewerRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  ))}
                  <span className={`ml-2 font-bold text-xs px-2.5 py-1 rounded-md transition-colors ${reviewerRating > 0 ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                    {reviewerRating > 0 ? `${reviewerRating} / 5 Stars` : 'Click stars to rate (1-5)'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anjali Sharma"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-rose-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Your Detailed Review *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about saree fabric quality, border finish, drape, and overall buying experience..."
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-rose-600 font-medium"
                />
              </div>

              {/* Customer Photo Upload Option */}
              <div className="p-3 bg-slate-50 border border-gray-200 rounded-xl space-y-2">
                <label className="block text-gray-700 font-bold flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-rose-600" />
                    <span>Attach Photo of Received Saree (Optional)</span>
                  </span>
                  {isUploadingReviewImage && <span className="text-rose-600 animate-pulse text-[11px]">Uploading photo...</span>}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReviewImageUpload}
                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-gray-900 file:text-white hover:file:bg-black cursor-pointer"
                />

                {reviewImage && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="w-16 h-20 rounded-lg border border-gray-300 overflow-hidden relative shadow-xs bg-white">
                      <img src={reviewImage} alt="Uploaded Customer Photo" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setReviewImage('')}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Saree photo attached successfully!</span>
                    </div>
                  </div>
                )}
              </div>

              {reviewMsg && (
                <p className={`text-xs font-bold ${reviewMsg.startsWith('✓') ? 'text-emerald-700 bg-emerald-50 p-2.5 rounded' : 'text-rose-600'}`}>
                  {reviewMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
              >
                <span>{isSubmittingReview ? 'Submitting Review...' : 'SUBMIT CUSTOMER REVIEW'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Customer Reviews List */}
        <div className="mt-8 space-y-4">
          <h3 className="font-bold text-sm text-gray-900">
            Recent Customer Reviews ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-gray-200 text-xs text-gray-500">
              No customer reviews written yet. Be the first to rate this saree!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 border border-gray-200 rounded-xl bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-xs">
                        {r.userName?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                          <span>{r.userName}</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Verified Buyer</span>
                          </span>
                        </h5>
                        <p className="text-[10px] text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold text-xs text-amber-900">
                      <span>{r.rating}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed font-normal bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    "{r.comment}"
                  </p>

                  {/* Customer Uploaded Photo */}
                  {r.image && (
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-gray-500 mb-1 flex items-center gap-1">
                        <Camera className="w-3 h-3 text-rose-600" />
                        <span>Customer Photo:</span>
                      </p>
                      <div className="w-20 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-2xs bg-slate-50">
                        <img src={r.image} alt="Customer Received Saree" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Sarees Section (Customers Also Liked) */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-rose-600 block mb-1">
              YOU MAY ALSO LIKE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-gray-900 tracking-wide">
              Customers Also Liked
            </h2>
            <div className="w-20 h-0.5 bg-rose-600/40 mx-auto mt-2.5 rounded-full" />
          </div>
          <MobileProductSlider products={relatedProducts} />
        </section>
      )}

      {/* Recommended Products Section (Matching Reference Screenshot 2 - Auto Rotating Every 8 Seconds) */}
      {recommendedProducts.length > 0 && (
        <section className="mt-12 mb-24 lg:mb-12 py-10 px-4 sm:px-8 bg-[#FAF7F2] border border-stone-200/80 rounded-3xl shadow-xs relative overflow-hidden">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-amber-800 flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              <span>CURATED FOR YOU • AUTO ROTATING</span>
            </span>
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-wide">
                Recommended Products
              </h2>
              <button
                onClick={() => shufflePdpRecommended(allStoreProducts)}
                className="p-2 rounded-full bg-white border border-stone-300 hover:border-amber-700 text-stone-700 hover:text-amber-900 transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Shuffle recommended styles"
              >
                <RefreshCw className={`w-4 h-4 ${isRecRotating ? 'animate-spin text-amber-800' : ''}`} />
              </button>
            </div>
            <div className="w-20 h-0.5 bg-amber-700/40 mx-auto mt-2.5 rounded-full" />
          </div>

          <div className={`transition-opacity duration-300 ${isRecRotating ? 'opacity-40' : 'opacity-100'}`}>
            <MobileProductSlider products={recommendedProducts} />
          </div>
        </section>
      )}



      {/* Full Screen Image Lightbox Zoom Modal (Matching Reference Image) */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center font-sans p-4 select-none animate-fade-in"
        >
          {/* Close Button Top-Right */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 bg-gray-800/80 hover:bg-black text-white p-3 rounded-md transition-colors cursor-pointer z-50 border border-gray-700 shadow-lg"
            title="Close Zoom View"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow Button */}
          {parsedImages.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-4 bg-black/60 hover:bg-black text-white p-4 rounded-md border border-white/20 transition-transform active:scale-95 cursor-pointer z-50 shadow-xl"
              title="Previous Photo"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Lightbox Center Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center relative"
          >
            <div
              className="relative overflow-hidden rounded-lg select-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              <img
                src={parsedImages[currentImageIdx] || selectedImage}
                alt={product.title}
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10 select-none pointer-events-none"
              />
              <WatermarkOverlay variant="lightbox" imageUrl={parsedImages[currentImageIdx] || selectedImage} />
            </div>

            {/* Bottom Caption Bar */}
            <div className="mt-4 flex items-center gap-3 text-white text-xs font-bold bg-gray-900/90 backdrop-blur-md px-5 py-2 rounded-full border border-gray-700 shadow-md">
              <span className="text-amber-400 font-serif font-extrabold">{product.title}</span>
              <span className="text-gray-500">•</span>
              <span>{currentImageIdx + 1} of {parsedImages.length || 1}</span>
            </div>
          </div>

          {/* Right Arrow Button */}
          {parsedImages.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-4 bg-black/60 hover:bg-black text-white p-4 rounded-md border border-white/20 transition-transform active:scale-95 cursor-pointer z-50 shadow-xl"
              title="Next Photo"
            >
              <ChevronRight className="w-8 h-8 font-extrabold" />
            </button>
          )}
        </div>
      )}

      {/* Full Screen High-Def Video Modal */}
      {isVideoModalOpen && product.videoUrl && (
        <div
          onClick={() => setIsVideoModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in"
        >
          {/* Close Button Top-Right */}
          <button
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute top-4 right-4 bg-neutral-900/80 hover:bg-black text-white p-3 rounded-full transition-colors cursor-pointer z-50 border border-neutral-700 shadow-lg"
            title="Close Video"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-neutral-950 rounded-2xl border border-amber-500/40 overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 bg-gradient-to-r from-amber-950 to-neutral-950 border-b border-amber-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-extrabold text-sm text-amber-100">{product.title}</h4>
                  <p className="text-[10px] text-amber-400/80">Authentic Saree Draping & Craftsmanship Video</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src={product.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                Your browser does not support video playback.
              </video>
            </div>

            <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-gray-300 text-[11px]">
                Have questions about this piece? Talk directly with our Maheshwar master weavers.
              </div>
              <button
                type="button"
                onClick={handleDirectWhatsAppShare}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
                <span>Inquire on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
