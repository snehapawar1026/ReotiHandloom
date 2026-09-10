'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useShop, ProductItem } from '@/context/ShopContext';
import { ProductCard } from '@/components/ProductCard';
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
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { user, addToCart, toggleWishlist, isInWishlist, setIsCartOpen } = useShop();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('');

  // Customer Review Form state
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [isUploadingReviewImage, setIsUploadingReviewImage] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    if (user?.name && !reviewerName) {
      setReviewerName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          setReviews(data.product.reviews || []);
          const parsedImages = JSON.parse(data.product.images || '[]');
          if (parsedImages.length > 0) setSelectedImage(parsedImages[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Gallery: Sticky with Fixed Max Height */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 flex flex-col sm:flex-row gap-4 h-fit">
          
          {/* Vertical Thumbnail Strip */}
          {parsedImages.length > 0 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto shrink-0 max-h-[560px]">
              {parsedImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-16 h-20 rounded-lg border-2 overflow-hidden bg-slate-100 transition-all shrink-0 ${
                    selectedImage === imgUrl ? 'border-rose-600 shadow-md ring-2 ring-rose-200' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="flex-1 h-[480px] sm:h-[560px] max-h-[580px] rounded-xl overflow-hidden bg-slate-100/80 relative border border-slate-200 shadow-sm flex items-center justify-center">
            <img
              src={selectedImage || parsedImages[0]}
              alt={product.title}
              className="w-full h-full object-contain p-1"
            />

            {/* Reoti Handloom Premium Glass Watermark Seal Overlay */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-amber-950 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-amber-300/90 shadow-md pointer-events-none flex items-center gap-1.5 z-10">
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
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-6 space-y-5">
          
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

            {/* Product Title */}
            <h1 className="text-base text-gray-600 mt-0.5 font-medium leading-snug">
              {product.title}
            </h1>

            {/* Rating Box */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-0.5 text-xs font-bold text-gray-800 bg-white">
                <span>{product.rating || 4.8}</span>
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                Based on {reviews.length > 0 ? reviews.length : (product.reviewCount || 58)} verified ratings
              </span>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="py-3.5 border-y border-gray-200 space-y-1 bg-white">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {product.discountPercent}% Off
              </span>
            </div>
            <div className="text-xs text-gray-500 font-medium">
              MRP <span className="line-through">₹{product.originalPrice.toLocaleString()}</span> <span className="text-[11px] text-gray-400">Inclusive of all taxes</span>
            </div>
          </div>

          {/* Color Selector Swatches */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">
              Select Color
            </h3>
            <p className="text-xs text-gray-600 font-semibold">{product.color}</p>
            <div className="flex gap-3 pt-1">
              {parsedImages.slice(0, 4).map((img, idx) => (
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
              ))}
            </div>
          </div>

          {/* Action Buttons: ADD TO BAG & WISHLIST */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => {
                addToCart(product);
                setIsCartOpen(true);
              }}
              className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors active:scale-98 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add To Bag</span>
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`px-6 py-3.5 border rounded-lg font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                isLiked ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-gray-300 text-gray-800 hover:border-gray-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>Wishlist</span>
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

          {/* Saree Details & Specifications Box */}
          <div className="pt-4 border-t border-gray-200 space-y-4 text-xs">
            <div>
              <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider mb-2">
                Product Specifications
              </h3>
              <div className="grid grid-cols-2 gap-3 text-gray-700 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div>Fabric: <span className="font-bold text-gray-900 block">{product.fabric}</span></div>
                <div>Weave: <span className="font-bold text-gray-900 block">{product.weaveType}</span></div>
                <div>Border: <span className="font-bold text-gray-900 block">{product.borderType || 'Gold Zari'}</span></div>
                <div>Length: <span className="font-bold text-gray-900 block">{product.lengthWithBlouse}</span></div>
              </div>
            </div>

            {/* Formatted Full Description */}
            {product.description && (
              <div className="space-y-2">
                <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
                  Description & Craft Story
                </h4>
                <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 space-y-2 shadow-2xs font-normal">
                  {product.description}
                </div>
              </div>
            )}
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
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-extrabold text-gray-900">
                {product.rating || 4.8}
              </span>
              <div className="flex flex-col items-start">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500 font-medium mt-0.5">
                  {reviews.length} Verified Customer Reviews
                </span>
              </div>
            </div>

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
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewerRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-xs text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                    {reviewerRating} / 5 Stars
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

      {/* Related Sarees Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-serif font-extrabold text-gray-900 mb-6">
            Customers Also Liked
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
