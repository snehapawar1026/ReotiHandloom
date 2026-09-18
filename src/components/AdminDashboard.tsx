'use client';

import React, { useEffect, useState } from 'react';
import { useShop } from '@/context/ShopContext';
import {
  Package,
  PlusCircle,
  ShoppingBag,
  IndianRupee,
  Layers,
  ShieldCheck,
  Lock,
  Mail,
  LogOut,
  Clock,
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle,
  Pencil,
  Trash2,
  Sliders,
  Tag,
  Bell,
  FolderPlus,
  Folder,
  Camera,
  ExternalLink,
  Eye,
  EyeOff,
  Users,
  Globe,
  UserCheck,
  LogIn,
  UserPlus,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';

const SAREE_LENGTH_OPTIONS = [
  '6.3 Meters (With Blouse Piece)',
  '5.5 Meters (Without Blouse Piece)',
  '6.5 Meters (With Heavy Blouse Piece)',
  '6.2 Meters (Standard Handloom)',
];

const SUIT_LENGTH_OPTIONS = [
  'Top 2.5 Meters, Bottom 2.5 Meters, Dupatta 2.5 Meters (3-Piece Set)',
  'Top 2.5 Meters, Dupatta 2.5 Meters (2-Piece Set)',
  'Top 2.5 Meters, Bottom 2.0 Meters, Dupatta 2.5 Meters',
  'Top 3.0 Meters, Bottom 2.5 Meters, Dupatta 2.5 Meters',
  'Top 2.5m, Bottom 2.5m, Dupatta 2.25m',
];

const POPULAR_COLORS = [
  'Crimson Red',
  'Turquoise Blue',
  'Mustard Yellow',
  'Bottle Green',
  'Royal Navy Blue',
  'Rani Pink',
  'Maroon',
  'Emerald Green',
  'Black',
  'Purple / Lavender',
  'Pastel Peach',
  'Beige / Off-White',
  'Rust Orange',
  'Pista Green',
  'Wine Red',
  'Rama Green',
  'Golden Yellow',
  'Magenta',
];

const SAREE_BLOUSE_OPTIONS = [
  'Contrast Maroon',
  'Running Match',
  'Contrast Gold',
  'Contrast Green',
  'Contrast Navy Blue',
  'Tone on Tone Matching',
  'Without Blouse',
];

const SUIT_DUPATTA_OPTIONS = [
  'Matching Dupatta (Self)',
  'Contrast Zari Dupatta',
  'Handblock Printed Dupatta',
  'Multi-color Dupatta',
  'Contrast Border Dupatta',
  'Chiffon / Silk Dupatta',
];

export default function AdminDashboard() {
  const { user, setUser, logout } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'customers' | 'add' | 'products' | 'categories' | 'push' | 'insta'>('orders');

  // Dashboard Stats
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Customer & Visitor Logs State
  const [customerData, setCustomerData] = useState<{
    stats: { totalVisits: number; totalUsers: number; loginsToday: number; totalOrders: number };
    users: any[];
    activities: any[];
  }>({
    stats: { totalVisits: 0, totalUsers: 0, loginsToday: 0, totalOrders: 0 },
    users: [],
    activities: [],
  });
  const [activityFilter, setActivityFilter] = useState<'ALL' | 'VISIT' | 'LOGIN' | 'REGISTER' | 'ORDER'>('ALL');

  // Instagram Feed Manager state
  const [instaPosts, setInstaPosts] = useState<any[]>([]);
  const [instaImage, setInstaImage] = useState('');
  const [instaCaption, setInstaCaption] = useState('');
  const [instaLikes, setInstaLikes] = useState('1,850');
  const [instaPostUrl, setInstaPostUrl] = useState('https://www.instagram.com/reoti_handloom');
  const [isInstaUploading, setIsInstaUploading] = useState(false);
  const [instaFormMsg, setInstaFormMsg] = useState('');

  // Form states for Category creation
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState(''); // Circle Avatar Icon Image
  const [catBannerImage, setCatBannerImage] = useState(''); // Category Hero Banner Image
  const [catParentId, setCatParentId] = useState('');
  const [catIsParent, setCatIsParent] = useState(true);
  const [catIsHidden, setCatIsHidden] = useState(false);
  const [isCatUploading, setIsCatUploading] = useState(false);
  const [isCatBannerUploading, setIsCatBannerUploading] = useState(false);
  const [catFormMsg, setCatFormMsg] = useState('');

  // Category Manager state (Edit Modal)
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDescription, setEditCatDescription] = useState('');
  const [editCatImage, setEditCatImage] = useState(''); // Circle Avatar Icon Image
  const [editCatBannerImage, setEditCatBannerImage] = useState(''); // Category Hero Banner Image
  const [editCatParentId, setEditCatParentId] = useState('');
  const [editCatIsParent, setEditCatIsParent] = useState(true);
  const [editCatIsHidden, setEditCatIsHidden] = useState(false);
  const [isEditCatUploading, setIsEditCatUploading] = useState(false);
  const [isEditCatBannerUploading, setIsEditCatBannerUploading] = useState(false);
  const [editCatMsg, setEditCatMsg] = useState('');

  // Broadcast Push Notification state
  const [pushTitle, setPushTitle] = useState('🎉 Royal Maheshwari Festive Collection!');
  const [pushMessage, setPushMessage] = useState('Shop authentic Maheshwari sarees directly from Maheshwar looms. Limited stock!');
  const [pushLink, setPushLink] = useState('/products');
  const [pushImage, setPushImage] = useState('');
  const [isPushSending, setIsPushSending] = useState(false);
  const [pushResultMsg, setPushResultMsg] = useState('');

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle || !pushMessage) {
      setPushResultMsg('Please enter notification title and message.');
      return;
    }

    setIsPushSending(true);
    setPushResultMsg('');

    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pushTitle,
          message: pushMessage,
          url: pushLink,
          image: pushImage || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPushResultMsg(`✓ Push notification sent successfully to ${data.sentCount || 0} subscriber(s)!`);
      } else {
        setPushResultMsg('Failed to send push notification: ' + data.error);
      }
    } catch (err: any) {
      setPushResultMsg('Error sending push: ' + err.message);
    } finally {
      setIsPushSending(false);
    }
  };

  // Admin Auth Form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // New Product (Saree / Suit) Form state
  const [productType, setProductType] = useState<'saree' | 'suit'>('saree');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [fabric, setFabric] = useState('Silk Cotton');
  const [weaveType, setWeaveType] = useState('Garbha Reshami Border');
  const [borderType, setBorderType] = useState('Gold Zari');
  const [color, setColor] = useState('Crimson Red');
  const [blouseColor, setBlouseColor] = useState('');
  const [lengthWithBlouse, setLengthWithBlouse] = useState('6.3 Meters (With Blouse Piece)');
  const [designCode, setDesignCode] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string>('');
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [stock, setStock] = useState('');
  const [formMsg, setFormMsg] = useState('');

  // Edit Product Modal state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editProductType, setEditProductType] = useState<'saree' | 'suit'>('saree');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editFabric, setEditFabric] = useState('Silk Cotton');
  const [editWeaveType, setEditWeaveType] = useState('Garbha Reshami Border');
  const [editBorderType, setEditBorderType] = useState('Gold Zari');
  const [editColor, setEditColor] = useState('Crimson Red');
  const [editBlouseColor, setEditBlouseColor] = useState('');
  const [editLengthWithBlouse, setEditLengthWithBlouse] = useState('6.3 Meters (With Blouse Piece)');
  const [editDesignCode, setEditDesignCode] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editImagesList, setEditImagesList] = useState<string[]>([]);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsBestSeller, setEditIsBestSeller] = useState(false);
  const [editIsTrending, setEditIsTrending] = useState(false);
  const [editIsOutOfStock, setEditIsOutOfStock] = useState(false);
  const [editStock, setEditStock] = useState('');
  const [isEditUploading, setIsEditUploading] = useState(false);
  const [editMsg, setEditMsg] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (data.success && data.user.role === 'admin') {
        setUser(data.user);
        fetchData();
      } else {
        setAuthError(data.error || 'Invalid Admin Email or Password.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchInstaPosts = async () => {
    try {
      const res = await fetch('/api/instagram');
      const data = await res.json();
      if (data.success && data.posts) {
        setInstaPosts(data.posts);
      }
    } catch (e) {
      console.error('Error fetching instagram posts:', e);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resOrders, resProducts, resCategories, resActivity, resCustomers] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/products?includeAll=true').then((r) => r.json()),
        fetch('/api/categories?includeHidden=true').then((r) => r.json()),
        fetch('/api/admin/activity').then((r) => r.json()),
        fetch('/api/admin/customers').then((r) => r.json()),
      ]);

      if (resOrders.success) setOrders(resOrders.orders);
      if (resProducts.success) setProducts(resProducts.products);
      if (resActivity.success) setActivities(resActivity.activities || []);
      if (resCustomers.success) {
        setCustomerData({
          stats: resCustomers.stats || { totalVisits: 0, totalUsers: 0, loginsToday: 0, totalOrders: 0 },
          users: resCustomers.users || [],
          activities: resCustomers.activities || [],
        });
      }
      if (resCategories.success) {
        setCategories(resCategories.categories);
        if (resCategories.categories.length > 0) {
          const silkCottonCat = resCategories.categories.find(
            (c: any) =>
              c.name.toLowerCase().includes('silk cotton') ||
              c.slug.includes('silk-cotton')
          );
          const defaultCatId = silkCottonCat ? silkCottonCat.id : resCategories.categories[0].id;
          setCategoryId(defaultCatId);
          setEditCategoryId(defaultCatId);
        }
      }
      fetchInstaPosts();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInstaImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsInstaUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setInstaImage(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsInstaUploading(false);
    }
  };

  const handleAddInstaPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instaPostUrl && !instaImage) {
      setInstaFormMsg('Please enter an Instagram Post/Reel Link (URL) or upload a photo.');
      return;
    }

    setInstaFormMsg('Fetching Instagram post details live...');

    try {
      const res = await fetch('/api/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: instaImage || null,
          caption: instaCaption || null,
          likes: instaLikes || null,
          postUrl: instaPostUrl || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInstaFormMsg('✓ Real Instagram Reel/Post added & live on homepage!');
        setInstaImage('');
        setInstaCaption('');
        setInstaPostUrl('');
        setInstaLikes('1,850');
        fetchInstaPosts();
      } else {
        setInstaFormMsg('Error: ' + data.error);
      }
    } catch (err: any) {
      setInstaFormMsg('Error: ' + err.message);
    }
  };

  const handleDeleteInstaPost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Instagram post from the homepage feed?')) return;

    try {
      const res = await fetch(`/api/instagram?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('Instagram post deleted successfully.');
        fetchInstaPosts();
      } else {
        alert('Failed to delete post: ' + data.error);
      }
    } catch (err: any) {
      alert('Error deleting post: ' + err.message);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  // Multiple File Upload Handler (New Product)
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    Array.from(fileList).forEach((f) => formData.append('files', f));

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.urls) {
        setImagesList((prev) => [...prev, ...data.urls]);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setImagesList((prev) => {
      if (index <= 0 || index >= prev.length) return prev;
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const handleRemoveImage = (index: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    setImagesList((prev) => {
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Multiple File Upload Handler (Edit Product Modal)
  const handleEditMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsEditUploading(true);
    const formData = new FormData();
    Array.from(fileList).forEach((f) => formData.append('files', f));

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.urls) {
        setEditImagesList((prev) => [...prev, ...data.urls]);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsEditUploading(false);
    }
  };

  const handleEditSetPrimaryImage = (index: number) => {
    setEditImagesList((prev) => {
      if (index <= 0 || index >= prev.length) return prev;
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const handleEditRemoveImage = (index: number) => {
    setEditImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditMoveImage = (index: number, direction: 'left' | 'right') => {
    setEditImagesList((prev) => {
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !originalPrice || !categoryId) {
      setFormMsg('Please fill in required product fields.');
      return;
    }

    const finalImages = imagesList.length > 0
      ? imagesList
      : [imageUrl || uploadedPreview || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'];

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || title,
          price: parseFloat(price),
          originalPrice: parseFloat(originalPrice),
          fabric,
          weaveType,
          borderType,
          color,
          blouseColor: blouseColor.trim() || null,
          lengthWithBlouse,
          designCode: designCode.trim() || null,
          categoryId,
          images: JSON.stringify(finalImages),
          isFeatured,
          isBestSeller,
          isTrending,
          isOutOfStock,
          stock: stock.trim() !== '' ? parseInt(stock) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormMsg('✓ Saree Product added successfully to inventory!');
        setTitle('');
        setPrice('');
        setOriginalPrice('');
        setDescription('');
        setBlouseColor('');
        setDesignCode('');
        setImageUrl('');
        setUploadedPreview('');
        setImagesList([]);
        setStock('');
        setIsBestSeller(false);
        setIsFeatured(false);
        setIsTrending(false);
        setIsOutOfStock(false);
        fetchData();
      } else {
        setFormMsg('Error: ' + data.error);
      }
    } catch (e: any) {
      setFormMsg('Error: ' + e.message);
    }
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    const isSuit = Boolean(
      (p.title && /suit|kurta|dress material/i.test(p.title)) ||
      (p.lengthWithBlouse && /top|dupatta|duppta|pant|salwar/i.test(p.lengthWithBlouse)) ||
      (categories.find((c) => c.id === p.categoryId)?.slug?.includes('suit')) ||
      (categories.find((c) => c.id === p.categoryId)?.name?.toLowerCase().includes('suit'))
    );
    setEditProductType(isSuit ? 'suit' : 'saree');
    setEditTitle(p.title || '');
    setEditDescription(p.description || '');
    setEditPrice(p.price?.toString() || '');
    setEditOriginalPrice(p.originalPrice?.toString() || '');
    setEditFabric(p.fabric || 'Silk Cotton');
    setEditWeaveType(p.weaveType || 'Garbha Reshami Border');
    setEditBorderType(p.borderType || 'Gold Zari');
    setEditColor(p.color || 'Crimson Red');
    setEditBlouseColor(p.blouseColor || '');
    setEditLengthWithBlouse(p.lengthWithBlouse || (isSuit ? 'Top 2.5 Meters, Bottom 2.5 Meters, Dupatta 2.5 Meters (3-Piece Set)' : '6.3 Meters (With Blouse Piece)'));
    setEditDesignCode(p.designCode || '');
    setEditCategoryId(p.categoryId || categories[0]?.id || '');
    setEditIsOutOfStock(Boolean(p.isOutOfStock));
    setEditStock(p.stock !== undefined && p.stock !== null ? p.stock.toString() : '');
    setEditIsFeatured(p.isFeatured || false);
    setEditIsBestSeller(p.isBestSeller || false);
    setEditIsTrending(p.isTrending || false);
    
    let parsedImgs: string[] = [];
    try {
      const parsed = JSON.parse(p.images || '[]');
      if (Array.isArray(parsed)) parsedImgs = parsed;
      else if (typeof parsed === 'string') parsedImgs = [parsed];
    } catch (e) {
      if (p.images) parsedImgs = [p.images];
    }
    setEditImagesList(parsedImgs);
    setEditImageUrl(parsedImgs[0] || '');
    setEditMsg('');
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setEditMsg('Saving changes...');

    const finalEditImages = editImagesList.length > 0
      ? editImagesList
      : [editImageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'];

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          title: editTitle,
          description: editDescription,
          price: parseFloat(editPrice),
          originalPrice: parseFloat(editOriginalPrice),
          fabric: editFabric,
          weaveType: editWeaveType,
          borderType: editBorderType,
          color: editColor,
          blouseColor: editBlouseColor.trim() || null,
          lengthWithBlouse: editLengthWithBlouse,
          designCode: editDesignCode.trim() || null,
          categoryId: editCategoryId,
          isOutOfStock: editIsOutOfStock,
          stock: editStock.trim() !== '' ? parseInt(editStock) : '',
          images: JSON.stringify(finalEditImages),
          isFeatured: editIsFeatured,
          isBestSeller: editIsBestSeller,
          isTrending: editIsTrending,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditMsg('✓ Saree updated successfully!');
        fetchData();
        setTimeout(() => {
          setEditingProduct(null);
        }, 1000);
      } else {
        setEditMsg('Error: ' + data.error);
      }
    } catch (err: any) {
      setEditMsg('Error: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from inventory?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('Saree deleted successfully.');
        fetchData();
      } else {
        alert('Failed to delete: ' + data.error);
      }
    } catch (err: any) {
      alert('Error deleting product: ' + err.message);
    }
  };

  // Category Upload & CRUD Handlers
  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCatUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setCatImage(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsCatUploading(false);
    }
  };

  const handleEditCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsEditCatUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setEditCatImage(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsEditCatUploading(false);
    }
  };

  const handleCatBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCatBannerUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setCatBannerImage(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsCatBannerUploading(false);
    }
  };

  const handleEditCatBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsEditCatBannerUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setEditCatBannerImage(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsEditCatBannerUploading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) {
      setCatFormMsg('Please enter category name.');
      return;
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: catName,
          description: catDescription,
          image: catImage,
          bannerImage: catBannerImage,
          parentId: catParentId || null,
          isParent: catParentId ? false : catIsParent,
          isHidden: catIsHidden,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCatFormMsg('✓ Category added successfully!');
        setCatName('');
        setCatDescription('');
        setCatImage('');
        setCatBannerImage('');
        setCatParentId('');
        setCatIsParent(true);
        setCatIsHidden(false);
        fetchData();
      } else {
        setCatFormMsg('Error: ' + data.error);
      }
    } catch (err: any) {
      setCatFormMsg('Error: ' + err.message);
    }
  };

  const openEditCatModal = (cat: any) => {
    setEditingCategory(cat);
    setEditCatName(cat.name || '');
    setEditCatDescription(cat.description || '');
    setEditCatImage(cat.image || '');
    setEditCatBannerImage(cat.bannerImage || '');
    setEditCatParentId(cat.parentId || '');
    setEditCatIsParent(cat.isParent ?? !cat.parentId);
    setEditCatIsHidden(Boolean(cat.isHidden));
    setEditCatMsg('');
  };

  const handleSaveEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName) return;
    setEditCatMsg('Saving changes...');

    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editCatName,
          description: editCatDescription,
          image: editCatImage,
          bannerImage: editCatBannerImage,
          parentId: editCatParentId || null,
          isParent: editCatParentId ? false : editCatIsParent,
          isHidden: editCatIsHidden,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditCatMsg('✓ Category updated successfully!');
        fetchData();
        setTimeout(() => {
          setEditingCategory(null);
        }, 1000);
      } else {
        setEditCatMsg('Error: ' + data.error);
      }
    } catch (err: any) {
      setEditCatMsg('Error: ' + err.message);
    }
  };

  const handleToggleCategoryVisibility = async (cat: any) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cat.id,
          isHidden: !cat.isHidden,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err: any) {
      console.error('Error toggling category visibility:', err);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('Category deleted successfully.');
        fetchData();
      } else {
        alert(data.error || 'Failed to delete category.');
      }
    } catch (err: any) {
      alert('Error deleting category: ' + err.message);
    }
  };

  // If user is not logged in as Admin, show Admin Password Login Form
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 px-4 font-sans">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-amber-950 text-white p-6 text-center">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 mx-auto bg-amber-100 mb-2">
              <img src="/logo.jpg" alt="Reoti Handloom" className="w-full h-full object-cover object-top rounded-full" />
            </div>
            <h2 className="font-serif font-extrabold text-xl tracking-tight text-amber-100">
              Admin Portal Security
            </h2>
            <p className="text-[11px] text-amber-200/80 mt-1">
              Enter Admin Password to access Seller Dashboard
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Admin Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter Admin Email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 text-xs focus:ring-1 focus:ring-amber-950 font-bold text-gray-900"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Admin Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter Admin Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 text-xs focus:ring-1 focus:ring-amber-950 font-bold text-gray-900"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            {authError && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded border border-rose-200">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 bg-amber-950 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isVerifying ? 'Authenticating...' : 'UNLOCK ADMIN PANEL'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Dynamically extract all unique Border Types and Design Codes from existing saree inventory
  const defaultBorderTypes = ['Gold Zari', 'Silver Zari', 'Resham Border With Silver Zari', 'Tissue Zari', 'Garbha Reshami Border'];
  const extractedBorderTypes = products.map((p) => p.borderType).filter(Boolean);
  const existingBorderTypes = Array.from(new Set([...defaultBorderTypes, ...extractedBorderTypes]));

  const defaultDesignCodes = ['Silver Zari', 'Gold Zari', 'MS-SILVER-ZARI', 'MS-GOLD-ZARI', 'MS-GARBHA-RESHAM'];
  const extractedDesignCodes = products.map((p) => p.designCode).filter(Boolean);
  const existingDesignCodes = Array.from(new Set([...defaultDesignCodes, ...extractedDesignCodes]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-amber-800 uppercase flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>AUTHENTICATED ADMIN PORTAL</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-950">
            Seller & Inventory Admin Dashboard
          </h1>
        </div>

        {/* Overview Stats Badges & Logout */}
        <div className="flex items-center gap-4 text-xs">
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 font-bold flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-amber-700" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Total Sales</p>
              <p className="text-sm">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-rose-950 font-bold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-rose-700" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Total Orders</p>
              <p className="text-sm">{orders.length}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="p-3 bg-gray-900 text-white rounded-lg hover:bg-black font-bold flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Live Store Activity & Visitor Alerts Card */}
      {activities.length > 0 && (
        <div className="mt-6 p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3 font-sans shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-extrabold text-xs text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-700 animate-bounce" />
              <span>Live Seller Alerts & Real-time Customer Activity</span>
            </h3>
            <span className="text-[10px] bg-amber-200 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full">
              {activities.length} Recent Events
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activities.slice(0, 6).map((act) => (
              <div key={act.id} className="p-3 bg-white border border-amber-200/90 rounded-xl text-xs space-y-1 shadow-2xs">
                <p className="font-bold text-amber-950 flex items-center justify-between">
                  <span>{act.title}</span>
                </p>
                {act.details && <p className="text-[11px] text-gray-600 leading-snug">{act.details}</p>}
                <p className="text-[9px] text-gray-400 font-mono pt-0.5">
                  {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-gray-200 mt-6 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-amber-900 text-amber-950'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'customers'
              ? 'border-amber-900 text-amber-950'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4 text-amber-800" />
          <span>Customer Logs & Visitors ({customerData.users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-amber-900 text-amber-950'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Saree Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'add'
              ? 'border-amber-900 text-amber-950'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Maheshwari Saree</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'categories'
              ? 'border-amber-900 text-amber-950'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <FolderPlus className="w-4 h-4 text-amber-800" />
          <span>Category Manager ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('push')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'push'
              ? 'border-amber-900 text-amber-950'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-700" />
          <span>Send Push Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('insta')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'insta'
              ? 'border-amber-900 text-amber-950'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Camera className="w-4 h-4 text-rose-600" />
          <span>Instagram Feed ({instaPosts.length})</span>
        </button>
      </div>

      {/* Tab: Customer Logs & Visitors */}
      {activeTab === 'customers' && (
        <div className="mt-6 space-y-6">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-amber-900">
                <span className="text-xs font-bold uppercase tracking-wider">Total Visitors</span>
                <Globe className="w-5 h-5 text-amber-700" />
              </div>
              <p className="text-2xl font-serif font-extrabold text-amber-950">
                {customerData.stats.totalVisits.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-500">Tracked Store Visits</p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-emerald-900">
                <span className="text-xs font-bold uppercase tracking-wider">Registered Users</span>
                <UserCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <p className="text-2xl font-serif font-extrabold text-emerald-950">
                {customerData.stats.totalUsers.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-500">Customer Accounts</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-blue-900">
                <span className="text-xs font-bold uppercase tracking-wider">Logins Today</span>
                <LogIn className="w-5 h-5 text-blue-700" />
              </div>
              <p className="text-2xl font-serif font-extrabold text-blue-950">
                {customerData.stats.loginsToday.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-500">Last 24 Hours</p>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-rose-900">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                <ShoppingBag className="w-5 h-5 text-rose-700" />
              </div>
              <p className="text-2xl font-serif font-extrabold text-rose-950">
                {customerData.stats.totalOrders.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-500">Placed Orders</p>
            </div>
          </div>

          {/* Section 1: Registered Customers Directory */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
            <div className="p-4 bg-amber-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-sm text-amber-100">
                  Registered Customer Directory ({customerData.users.length})
                </h3>
              </div>
              <span className="text-[10px] bg-amber-900 text-amber-200 font-mono px-2 py-0.5 rounded">
                Admin Alert Phone: 9617444445
              </span>
            </div>

            {customerData.users.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-xs">
                No customer accounts registered yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-50 text-amber-950 font-bold border-b border-amber-200">
                    <tr>
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Mobile Number</th>
                      <th className="p-3">Joined Date</th>
                      <th className="p-3 text-center">Orders Placed</th>
                      <th className="p-3 text-right">Quick Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customerData.users.map((c) => (
                      <tr key={c.id} className="hover:bg-amber-50/40">
                        <td className="p-3 font-bold text-gray-900">{c.name}</td>
                        <td className="p-3 text-gray-600 font-mono text-[11px]">{c.email}</td>
                        <td className="p-3 text-gray-800 font-semibold">{c.phone || 'N/A'}</td>
                        <td className="p-3 text-gray-500 font-mono text-[11px]">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            {c.orders?.length || 0} Orders
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <a
                            href={`https://wa.me/91${c.phone || '9617444445'}?text=${encodeURIComponent(
                              `Hello ${c.name}, thank you for shopping with Reoti Handloom Maheshwar!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1 rounded text-[11px]"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 2: Real-time Visitor & Customer Activity Feed */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden space-y-4 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
              <div>
                <h3 className="font-serif font-bold text-base text-amber-950 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-700" />
                  <span>Real-Time Visitor & User Activity Log</span>
                </h3>
                <p className="text-[11px] text-gray-500">
                  Track website visits, logins, user registrations, and order activities.
                </p>
              </div>

              {/* Activity Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                {(['ALL', 'VISIT', 'LOGIN', 'REGISTER', 'ORDER'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActivityFilter(filter)}
                    className={`px-3 py-1 rounded-full border text-[11px] transition-colors ${
                      activityFilter === filter
                        ? 'bg-amber-950 text-white border-amber-950 font-bold'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {filter === 'ALL'
                      ? 'All Activity'
                      : filter === 'VISIT'
                      ? 'Visits 🌐'
                      : filter === 'LOGIN'
                      ? 'Logins 🔐'
                      : filter === 'REGISTER'
                      ? 'Signups 👤'
                      : 'Orders 🛍️'}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Activity Cards */}
            {(() => {
              const filteredList = customerData.activities.filter((act) =>
                activityFilter === 'ALL' ? true : act.type === activityFilter
              );

              if (filteredList.length === 0) {
                return (
                  <div className="text-center py-10 text-gray-500 text-xs">
                    No activity logs recorded for this category yet.
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {filteredList.map((act) => {
                    const waText = encodeURIComponent(
                      `🚨 *Reoti Store Activity Alert*\n\n` +
                      `📌 *Event:* ${act.title}\n` +
                      `👤 *User:* ${act.userEmail || 'Visitor'}\n` +
                      `📝 *Details:* ${act.details || 'N/A'}\n` +
                      `🕒 *Time:* ${new Date(act.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
                    );
                    const adminWaUrl = `https://wa.me/919617444445?text=${waText}`;

                    return (
                      <div
                        key={act.id}
                        className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-100/50 transition-colors"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                act.type === 'ORDER'
                                  ? 'bg-rose-100 text-rose-800'
                                  : act.type === 'LOGIN'
                                  ? 'bg-blue-100 text-blue-800'
                                  : act.type === 'REGISTER'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {act.type}
                            </span>
                            <h4 className="font-bold text-gray-900">{act.title}</h4>
                          </div>

                          {act.details && (
                            <p className="text-[11px] text-gray-600 font-mono">{act.details}</p>
                          )}

                          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono pt-0.5">
                            <span>Email: {act.userEmail || 'Guest / Visitor'}</span>
                            <span>•</span>
                            <span>IP: {act.userIp || '127.0.0.1'}</span>
                            <span>•</span>
                            <span>{new Date(act.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        <a
                          href={adminWaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send WA Alert (9617444445)</span>
                        </a>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Tab 1: Orders Dashboard */}
      {activeTab === 'orders' && (
        <div className="mt-6 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg text-gray-500 text-xs font-semibold">
              No customer orders received yet.
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-amber-50 text-amber-950 font-bold uppercase border-b border-amber-200">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-amber-900">#{o.orderNumber}</td>
                      <td className="p-3 font-semibold">{o.customerName}</td>
                      <td className="p-3 text-gray-600">{o.customerPhone}</td>
                      <td className="p-3 text-gray-600 max-w-xs truncate">{o.shippingAddress}</td>
                      <td className="p-3 font-bold text-rose-700">₹{o.totalAmount.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-[10px]">
                          {o.paymentMethod} ({o.paymentStatus})
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          <span>{o.status}</span>
                        </span>
                      </td>
                      <td className="p-3 text-gray-400 text-[10px]">
                        {new Date(o.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saree Catalog List */}
      {activeTab === 'products' && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-amber-950 text-lg">
              Saree Inventory ({products.length} Items)
            </h3>
            <button
              onClick={() => setActiveTab('add')}
              className="px-3.5 py-2 bg-amber-950 text-amber-100 text-xs font-bold rounded-lg hover:bg-black flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Add New Saree</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const imgs = JSON.parse(p.images || '[]');
              return (
                <div key={p.id} className="p-3.5 border border-slate-200 rounded-xl flex gap-3.5 bg-white shadow-xs hover:border-amber-300 transition-all relative group">
                  <div className="relative w-20 h-28 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-100">
                    <img
                      src={imgs[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <WatermarkOverlay variant="card" className="scale-75" />
                  </div>
                  <div className="flex-1 text-xs space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{p.title}</h4>
                        {p.isBestSeller && (
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                            BESTSELLER
                          </span>
                        )}
                        {p.isTrending && (
                          <span className="bg-orange-100 text-orange-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase flex items-center gap-0.5">
                            🔥 TRENDING
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-amber-800 font-medium">{p.fabric}</p>
                      <p className="text-[10px] text-gray-500">Border: {p.borderType} • Color: {p.color}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-extrabold text-rose-700 text-sm">₹{p.price.toLocaleString()}</span>
                        {p.originalPrice && (
                          <span className="line-through text-gray-400 text-[11px]">₹{p.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        {p.isOutOfStock ? (
                          <span className="text-[10px] text-rose-700 font-extrabold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                            OUT OF STOCK
                          </span>
                        ) : p.stock !== undefined && p.stock !== null && p.stock !== '' && Number(p.stock) > 0 ? (
                          <span className="text-[10px] text-amber-900 font-extrabold bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            📦 Stock: {p.stock} units
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-800" />
                        <span>Edit Saree</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id, p.title)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Add Product (Saree / Suit) Form */}
      {activeTab === 'add' && (
        <div className="mt-6 max-w-2xl bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-serif font-bold text-amber-950">
                Add New {productType === 'suit' ? 'Suit / Dress Material' : 'Maheshwari Saree'} Details
              </h3>
              <p className="text-[11px] text-gray-500">
                {productType === 'suit' ? 'Add authentic handcrafted suit sets & unstitched dress materials' : 'Add authentic handcrafted Maheshwari sarees to store inventory'}
              </p>
            </div>

            {/* Product Type Switcher Dropdown / Pills */}
            <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setProductType('saree');
                  if (lengthWithBlouse.includes('Top') || !lengthWithBlouse) {
                    setLengthWithBlouse('6.3 Meters (With Blouse Piece)');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  productType === 'saree'
                    ? 'bg-amber-950 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-100/70'
                }`}
              >
                <span>🥻 Saree (साड़ी)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setProductType('suit');
                  if (lengthWithBlouse === '6.3 Meters (With Blouse Piece)' || !lengthWithBlouse) {
                    setLengthWithBlouse('Top 2.5 Meters, Bottom 2.5 Meters, Dupatta 2.5 Meters (3-Piece Set)');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  productType === 'suit'
                    ? 'bg-rose-900 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-rose-50'
                }`}
              >
                <span>👗 Suit (सूट)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                {productType === 'suit' ? 'Suit Title *' : 'Saree Title *'}
              </label>
              <input
                type="text"
                required
                placeholder={productType === 'suit' ? 'e.g. Pure Handloom Maheshwari Silk Cotton Suit Set with Zari Dupatta' : 'e.g. Royal Crimson Gold Zari Maheshwari Silk Saree'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-amber-800 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 4999"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-amber-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Original MRP (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 7999"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-amber-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                  <span>Stock Quantity</span>
                  <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 4 (Leave blank if unmanaged)"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-amber-800 text-xs"
                />
              </div>
            </div>

            {/* Collection Badges & Highlight Checkboxes */}
            <div className="p-3.5 bg-rose-50/50 border border-rose-200/80 rounded-xl space-y-2">
              <label className="block text-rose-950 font-bold mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-rose-600" />
                <span>Collection Badges & Display Tags</span>
              </label>
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded text-xs font-extrabold uppercase tracking-wide">
                    ★ Mark as BESTSELLER {productType === 'suit' ? 'Suit' : 'Saree'}
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded text-xs font-bold">
                    Mark as Featured Collection
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <span className="bg-orange-100 text-orange-900 px-2.5 py-1 rounded text-xs font-extrabold uppercase tracking-wide flex items-center gap-1">
                    🔥 Mark as TRENDING {productType === 'suit' ? 'Suit' : 'Saree'}
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={isOutOfStock}
                    onChange={(e) => setIsOutOfStock(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <span className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${isOutOfStock ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-gray-700 hover:bg-slate-200'}`}>
                    {isOutOfStock ? '✕ OUT OF STOCK' : '[ ] Mark as Out of Stock'}
                  </span>
                </label>
              </div>
            </div>

            {/* Product Specifications Section */}
            <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-800" />
                  <span className="font-bold text-amber-950 text-xs uppercase tracking-wider">
                    Specification Heading (हेडिंग चुनें):
                  </span>
                </div>

                <select
                  value={productType}
                  onChange={(e) => {
                    const type = e.target.value as 'saree' | 'suit';
                    setProductType(type);
                    if (type === 'suit') {
                      if (lengthWithBlouse === '6.3 Meters (With Blouse Piece)' || !lengthWithBlouse) {
                        setLengthWithBlouse('Top 2.5 Meters, Bottom 2.5 Meters, Dupatta 2.5 Meters (3-Piece Set)');
                      }
                    } else {
                      if (lengthWithBlouse.includes('Top') || !lengthWithBlouse) {
                        setLengthWithBlouse('6.3 Meters (With Blouse Piece)');
                      }
                    }
                  }}
                  className="border-2 border-amber-700 bg-white rounded-lg px-3 py-1.5 text-xs font-bold text-amber-950 shadow-xs focus:ring-2 focus:ring-amber-800 cursor-pointer"
                >
                  <option value="saree">🥻 SAREE SPECIFICATIONS (साड़ी)</option>
                  <option value="suit">👗 SUIT SPECIFICATIONS (सूट)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Fabric</label>
                  <select
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium"
                  >
                    <option value="Silk Cotton">Silk Cotton</option>
                    <option value="Pure Silk">Pure Silk</option>
                    <option value="Tissue Silk">Tissue Silk</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Chanderi Silk">Chanderi Silk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                    <span>Border Type</span>
                    <span className="text-[10px] text-amber-800 font-normal">Select or type custom</span>
                  </label>
                  <select
                    value={existingBorderTypes.includes(borderType) ? borderType : 'CUSTOM'}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setBorderType('');
                      } else {
                        setBorderType(e.target.value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="">-- Select Existing Border Type --</option>
                    {existingBorderTypes.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                    <option value="CUSTOM">➕ Type New Border Type...</option>
                  </select>

                  {(!existingBorderTypes.includes(borderType) || borderType === '') && (
                    <input
                      type="text"
                      placeholder="Type new Border Type (e.g. Kadhwa Zari / Zari Border)"
                      value={borderType}
                      onChange={(e) => setBorderType(e.target.value)}
                      className="w-full border border-amber-400 bg-amber-50/50 rounded p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-amber-800 text-amber-950 placeholder:font-normal"
                    />
                  )}
                </div>

                {/* Dynamic Color Field with Dropdown + Custom Input */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                    <span>{productType === 'suit' ? 'Suit Color' : 'Saree Color'}</span>
                    <span className="text-[10px] text-amber-800 font-normal">Select or type custom</span>
                  </label>
                  <select
                    value={POPULAR_COLORS.includes(color) ? color : (color ? 'CUSTOM' : '')}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setColor('');
                      } else {
                        setColor(e.target.value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="">-- Select {productType === 'suit' ? 'Suit' : 'Saree'} Color --</option>
                    {POPULAR_COLORS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="CUSTOM">➕ Type Custom Color...</option>
                  </select>

                  {(!POPULAR_COLORS.includes(color) || color === '') && (
                    <input
                      type="text"
                      placeholder={`Type ${productType === 'suit' ? 'Suit' : 'Saree'} Color (e.g. Crimson Red / Mustard Yellow)`}
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full border border-amber-400 bg-amber-50/50 rounded p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-amber-800 text-amber-950 placeholder:font-normal"
                    />
                  )}
                </div>

                {/* Dynamic Blouse / Dupatta Color Field with Dropdown + Custom Input */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                    <span>{productType === 'suit' ? 'Dupatta Color' : 'Blouse Color'}</span>
                    <span className="text-[10px] text-amber-800 font-normal">Select or type custom</span>
                  </label>
                  <select
                    value={(productType === 'suit' ? SUIT_DUPATTA_OPTIONS : SAREE_BLOUSE_OPTIONS).includes(blouseColor) ? blouseColor : (blouseColor ? 'CUSTOM' : '')}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setBlouseColor('');
                      } else {
                        setBlouseColor(e.target.value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="">-- Select {productType === 'suit' ? 'Dupatta' : 'Blouse'} Color --</option>
                    {(productType === 'suit' ? SUIT_DUPATTA_OPTIONS : SAREE_BLOUSE_OPTIONS).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    <option value="CUSTOM">➕ Type Custom {productType === 'suit' ? 'Dupatta' : 'Blouse'} Color...</option>
                  </select>

                  {(!(productType === 'suit' ? SUIT_DUPATTA_OPTIONS : SAREE_BLOUSE_OPTIONS).includes(blouseColor) || blouseColor === '') && (
                    <input
                      type="text"
                      placeholder={`Type ${productType === 'suit' ? 'Dupatta' : 'Blouse'} Color (e.g. Contrast Maroon / Running Match)`}
                      value={blouseColor}
                      onChange={(e) => setBlouseColor(e.target.value)}
                      className="w-full border border-amber-400 bg-amber-50/50 rounded p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-amber-800 text-amber-950 placeholder:font-normal"
                    />
                  )}
                </div>

                {/* Dynamic Length / Dimensions Field with Dropdown + Custom Input */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                    <span>{productType === 'suit' ? 'Suit Dimensions / Length' : 'Length / Blouse'}</span>
                    <span className="text-[10px] text-amber-800 font-normal">Select or type custom</span>
                  </label>
                  <select
                    value={(productType === 'suit' ? SUIT_LENGTH_OPTIONS : SAREE_LENGTH_OPTIONS).includes(lengthWithBlouse) ? lengthWithBlouse : (lengthWithBlouse ? 'CUSTOM' : '')}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setLengthWithBlouse('');
                      } else {
                        setLengthWithBlouse(e.target.value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="">-- Select Length / Dimensions --</option>
                    {(productType === 'suit' ? SUIT_LENGTH_OPTIONS : SAREE_LENGTH_OPTIONS).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    <option value="CUSTOM">➕ Type Custom Length / Dimensions...</option>
                  </select>

                  {(!(productType === 'suit' ? SUIT_LENGTH_OPTIONS : SAREE_LENGTH_OPTIONS).includes(lengthWithBlouse) || lengthWithBlouse === '') && (
                    <input
                      type="text"
                      placeholder={productType === 'suit' ? 'e.g. 2.5 Meters top 2.5 Meters Duppta' : 'e.g. 6.3 Meters (With Blouse Piece)'}
                      value={lengthWithBlouse}
                      onChange={(e) => setLengthWithBlouse(e.target.value)}
                      className="w-full border border-amber-400 bg-amber-50/50 rounded p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-amber-800 text-amber-950 placeholder:font-normal"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-1 flex items-center justify-between">
                    <span>Design Code (Color Group)</span>
                    <span className="text-[10px] text-amber-800 font-normal">Select or type custom</span>
                  </label>
                  <select
                    value={existingDesignCodes.includes(designCode) ? designCode : 'CUSTOM'}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setDesignCode('');
                      } else {
                        setDesignCode(e.target.value);
                      }
                    }}
                    className="w-full border border-amber-300 bg-amber-50/30 rounded p-2 text-xs font-semibold text-amber-950 focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="">-- Select Existing Design Code --</option>
                    {existingDesignCodes.map((dc) => (
                      <option key={dc} value={dc}>
                        {dc}
                      </option>
                    ))}
                    <option value="CUSTOM">➕ Type New Design Code...</option>
                  </select>

                  {(!existingDesignCodes.includes(designCode) || designCode === '') && (
                    <input
                      type="text"
                      placeholder="Type new Design Code (e.g. MS-SILVER-ZARI)"
                      value={designCode}
                      onChange={(e) => setDesignCode(e.target.value)}
                      className="w-full border border-amber-400 bg-amber-50/50 rounded p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-amber-800 text-amber-950 placeholder:font-normal"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium"
                  >
                    {categories
                      .filter((c) => c.isParent || !c.parentId)
                      .map((parent) => {
                        const children = categories.filter((c) => c.parentId === parent.id);
                        return (
                          <optgroup key={parent.id} label={`📁 PARENT: ${parent.name}`}>
                            <option value={parent.id}>
                              📁 {parent.name} (Parent Category)
                            </option>
                            {children.map((child) => (
                              <option key={child.id} value={child.id}>
                                &nbsp;&nbsp;↳ {child.name} (Child Category)
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    {categories.filter(
                      (c) => !c.isParent && c.parentId && !categories.some((p) => p.id === c.parentId)
                    ).map((c) => (
                      <option key={c.id} value={c.id}>
                        ↳ {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Multiple Image Upload & Primary Cover Photo Selection Box */}
            <div className="space-y-3 p-4 bg-amber-50/60 border border-amber-200/90 rounded-2xl shadow-2xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-amber-200/60 pb-2">
                <div>
                  <label className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <Upload className="w-4 h-4 text-amber-800" />
                    <span>Upload {productType === 'suit' ? 'Suit' : 'Saree'} Photos ({imagesList.length} Photos Added)</span>
                  </label>
                  <p className="text-[11px] text-amber-900/80 font-medium mt-0.5">
                    📸 Select 1 or multiple photos from PC/Mobile. The photo with <span className="font-bold text-amber-950">⭐ PRIMARY DEFAULT COVER</span> badge will be default thumbnail!
                  </p>
                </div>
                {isUploading && (
                  <span className="text-amber-800 animate-pulse text-xs font-bold shrink-0">
                    Uploading photos...
                  </span>
                )}
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultipleImageUpload}
                className="block w-full text-xs text-gray-700 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-extrabold file:bg-amber-900 file:text-white hover:file:bg-black cursor-pointer bg-white p-1 rounded-xl border border-amber-300"
              />

              {/* Gallery Thumbnails List with Primary Cover Selection */}
              {imagesList.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-bold text-gray-700 block uppercase tracking-wider">
                    Product Photos Gallery (Click "★ Set as Default Cover" to choose main thumbnail):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {imagesList.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`group relative bg-white border-2 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between p-1.5 transition-all ${
                          idx === 0
                            ? 'border-amber-600 ring-2 ring-amber-400/50 bg-amber-50/30'
                            : 'border-gray-200 hover:border-amber-400'
                        }`}
                      >
                        <div className="relative aspect-4/5 w-full rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <WatermarkOverlay />

                          {/* Primary Cover Badge */}
                          {idx === 0 ? (
                            <span className="absolute top-1 left-1 bg-amber-900 text-amber-50 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow flex items-center gap-1 uppercase tracking-wider z-10">
                              ⭐ Primary Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="absolute top-1 left-1 bg-black/75 hover:bg-amber-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-90 hover:opacity-100 transition-all cursor-pointer z-10"
                            >
                              ★ Set as Cover
                            </button>
                          )}

                          {/* Delete Photo Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow transition-all cursor-pointer z-10"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Reorder Buttons */}
                        <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500 font-bold px-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, 'left')}
                            className="px-1.5 py-0.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Move left"
                          >
                            ←
                          </button>
                          <span>Photo #{idx + 1}</span>
                          <button
                            type="button"
                            disabled={idx === imagesList.length - 1}
                            onClick={() => handleMoveImage(idx, 'right')}
                            className="px-1.5 py-0.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Move right"
                          >
                            →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-amber-950 font-bold mb-1 flex items-center justify-between">
                <span>Description & Craft Story</span>
                <span className="text-[10px] text-amber-800 font-normal">Appears in Product Details Accordion</span>
              </label>
              <textarea
                rows={4}
                placeholder={productType === 'suit' ? 'Enter detailed suit fabric details, dupatta styling, weave style, heritage details...' : 'Enter detailed craft story, weave style, heritage details, color contrast notes...'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-amber-300 bg-amber-50/20 rounded p-2.5 text-xs font-medium focus:ring-1 focus:ring-amber-800"
              />
            </div>

            {formMsg && (
              <p className={`text-xs font-bold ${formMsg.startsWith('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                {formMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-950 hover:bg-black text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              SAVE {productType === 'suit' ? 'SUIT' : 'SAREE'} TO INVENTORY
            </button>
          </form>
        </div>
      )}

      {/* Edit Product (Saree / Suit) Modal Overlay */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-start justify-center p-4 sm:p-6 pt-10 sm:pt-14 overflow-hidden">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-amber-900/20 relative text-xs overflow-hidden">
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-amber-900/20 shrink-0 bg-amber-950 text-amber-50">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-serif font-bold text-amber-100">
                  Edit {editProductType === 'suit' ? 'Suit / Dress Material' : 'Saree'} Details
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Product Type Toggle in Edit Modal */}
                <div className="flex items-center gap-1 bg-amber-900/80 p-0.5 rounded-lg border border-amber-800">
                  <button
                    type="button"
                    onClick={() => {
                      setEditProductType('saree');
                      if (editLengthWithBlouse.includes('Top') || !editLengthWithBlouse) {
                        setEditLengthWithBlouse('6.3 Meters (With Blouse Piece)');
                      }
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      editProductType === 'saree' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-amber-200 hover:text-white'
                    }`}
                  >
                    🥻 Saree
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditProductType('suit');
                      if (editLengthWithBlouse === '6.3 Meters (With Blouse Piece)' || !editLengthWithBlouse) {
                        setEditLengthWithBlouse('Top 2.5 Meters, Bottom 2.5 Meters, Dupatta 2.5 Meters (3-Piece Set)');
                      }
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      editProductType === 'suit' ? 'bg-rose-500 text-white shadow-xs' : 'text-amber-200 hover:text-white'
                    }`}
                  >
                    👗 Suit
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-amber-800/80 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form with Scrollable Body & Fixed Footer */}
            <form onSubmit={handleSaveEditProduct} className="flex flex-col flex-1 min-h-0 bg-white">
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    {editProductType === 'suit' ? 'Suit Title *' : 'Saree Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Original MRP (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editOriginalPrice}
                      onChange={(e) => setEditOriginalPrice(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                      <span>Stock Quantity</span>
                      <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 4 (Leave blank if unmanaged)"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>

                {/* Edit Collection Badges & Highlight Checkboxes */}
                <div className="p-3.5 bg-rose-50/50 border border-rose-200/80 rounded-xl space-y-2">
                  <label className="block text-rose-950 font-bold mb-1 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-rose-600" />
                    <span>Collection Badges & Display Tags</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                      <input
                        type="checkbox"
                        checked={editIsBestSeller}
                        onChange={(e) => setEditIsBestSeller(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded text-xs font-extrabold uppercase tracking-wide">
                        ★ Mark as BESTSELLER {editProductType === 'suit' ? 'Suit' : 'Saree'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                      <input
                        type="checkbox"
                        checked={editIsFeatured}
                        onChange={(e) => setEditIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded text-xs font-bold">
                        Mark as Featured Collection
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                      <input
                        type="checkbox"
                        checked={editIsTrending}
                        onChange={(e) => setEditIsTrending(e.target.checked)}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <span className="bg-orange-100 text-orange-900 px-2.5 py-1 rounded text-xs font-extrabold uppercase tracking-wide flex items-center gap-1">
                        🔥 Mark as TRENDING {editProductType === 'suit' ? 'Suit' : 'Saree'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                      <input
                        type="checkbox"
                        checked={editIsOutOfStock}
                        onChange={(e) => setEditIsOutOfStock(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <span className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${editIsOutOfStock ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-gray-700 hover:bg-slate-200'}`}>
                        {editIsOutOfStock ? '✕ OUT OF STOCK' : '[ ] Mark as Out of Stock'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Edit Product Specifications Section */}
                <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-amber-800" />
                      <span className="font-bold text-amber-950 text-xs uppercase tracking-wider">
                        Specification Heading (हेडिंग चुनें):
                      </span>
                    </div>

                    <select
                      value={editProductType}
                      onChange={(e) => {
                        const type = e.target.value as 'saree' | 'suit';
                        setEditProductType(type);
                        if (type === 'suit') {
                          if (editLengthWithBlouse === '6.3 Meters (With Blouse Piece)' || !editLengthWithBlouse) {
                            setEditLengthWithBlouse('Top 2.5 Meters, Bottom 2.5 Meters, Dupatta 2.5 Meters (3-Piece Set)');
                          }
                        } else {
                          if (editLengthWithBlouse.includes('Top') || !editLengthWithBlouse) {
                            setEditLengthWithBlouse('6.3 Meters (With Blouse Piece)');
                          }
                        }
                      }}
                      className="border-2 border-amber-700 bg-white rounded-lg px-3 py-1.5 text-xs font-bold text-amber-950 shadow-xs focus:ring-2 focus:ring-amber-800 cursor-pointer"
                    >
                      <option value="saree">🥻 SAREE SPECIFICATIONS (साड़ी)</option>
                      <option value="suit">👗 SUIT SPECIFICATIONS (सूट)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Fabric</label>
                      <select
                        value={editFabric}
                        onChange={(e) => setEditFabric(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800"
                      >
                        <option value="Silk Cotton">Silk Cotton</option>
                        <option value="Pure Silk">Pure Silk</option>
                        <option value="Tissue Silk">Tissue Silk</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Chanderi Silk">Chanderi Silk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                        <span>Border Type</span>
                        <span className="text-[10px] text-amber-800 font-normal">Select or type custom</span>
                      </label>
                      <select
                        value={existingBorderTypes.includes(editBorderType) ? editBorderType : 'CUSTOM'}
                        onChange={(e) => {
                          if (e.target.value === 'CUSTOM') {
                            setEditBorderType('');
                          } else {
                            setEditBorderType(e.target.value);
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800"
                      >
                        <option value="">-- Select Existing Border Type --</option>
                        {existingBorderTypes.map((bt) => (
                          <option key={bt} value={bt}>
                            {bt}
                          </option>
                        ))}
                        <option value="CUSTOM">➕ Type New Border Type...</option>
                      </select>

                      {(!existingBorderTypes.includes(editBorderType) || editBorderType === '') && (
                        <input
                          type="text"
                          placeholder="Type new Border Type (e.g. Kadhwa Zari / Zari Border)"
                          value={editBorderType}
                          onChange={(e) => setEditBorderType(e.target.value)}
                          className="w-full border border-amber-400 bg-amber-50/50 rounded-lg p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-amber-800 text-amber-950 placeholder:font-normal"
                        />
                      )}
                    </div>

                    {/* Dynamic Edit Color Field with Dropdown + Custom Input */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                        <span>{editProductType === 'suit' ? 'Suit Color' : 'Saree Color'}</span>
                        <span className="text-[10px] text-amber-800 font-normal">Select or type custom</span>
                      </label>
                      <select
                        value={POPULAR_COLORS.includes(editColor) ? editColor : (editColor ? 'CUSTOM' : '')}
                        onChange={(e) => {
                          if (e.target.value === 'CUSTOM') {
                            setEditColor('');
                          } else {
                            setEditColor(e.target.value);
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800"
                      >
                        <option value="">-- Select {editProductType === 'suit' ? 'Suit' : 'Saree'} Color --</option>
                        {POPULAR_COLORS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="CUSTOM">➕ Type Custom Color...</option>
                      </select>

                      {(!POPULAR_COLORS.includes(editColor) || editColor === '') && (
                        <input
                          type="text"
                          placeholder={`Type ${editProductType === 'suit' ? 'Suit' : 'Saree'} Color (e.g. Crimson Red / Mustard Yellow)`}
                          value={editColor}
                          onChange={(e) => setEditColor(e.target.value)}
                          className="w-full border border-amber-400 bg-amber-50/50 rounded-lg p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-amber-800 text-amber-950 placeholder:font-normal"
                        />
                      )}
                    </div>

                    {/* Dynamic Edit Blouse / Dupatta Color Field with Dropdown + Custom Input */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                        <span>{editProductType === 'suit' ? 'Dupatta Color' : 'Blouse Color'}</span>
                        <span className="text-[10px] text-amber-800 font-normal">Select or type custom</span>
                      </label>
                      <select
                        value={(editProductType === 'suit' ? SUIT_DUPATTA_OPTIONS : SAREE_BLOUSE_OPTIONS).includes(editBlouseColor) ? editBlouseColor : (editBlouseColor ? 'CUSTOM' : '')}
                        onChange={(e) => {
                          if (e.target.value === 'CUSTOM') {
                            setEditBlouseColor('');
                          } else {
                            setEditBlouseColor(e.target.value);
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800"
                      >
                        <option value="">-- Select {editProductType === 'suit' ? 'Dupatta' : 'Blouse'} Color --</option>
                        {(editProductType === 'suit' ? SUIT_DUPATTA_OPTIONS : SAREE_BLOUSE_OPTIONS).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                        <option value="CUSTOM">➕ Type Custom {editProductType === 'suit' ? 'Dupatta' : 'Blouse'} Color...</option>
                      </select>

                      {(!(editProductType === 'suit' ? SUIT_DUPATTA_OPTIONS : SAREE_BLOUSE_OPTIONS).includes(editBlouseColor) || editBlouseColor === '') && (
                        <input
                          type="text"
                          placeholder={`Type ${editProductType === 'suit' ? 'Dupatta' : 'Blouse'} Color (e.g. Contrast Maroon / Running Match)`}
                          value={editBlouseColor}
                          onChange={(e) => setEditBlouseColor(e.target.value)}
                          className="w-full border border-amber-400 bg-amber-50/50 rounded-lg p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-amber-800 text-amber-950 placeholder:font-normal"
                        />
                      )}
                    </div>

                    {/* Dynamic Edit Length / Dimensions Field with Dropdown + Custom Input */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                        <span>{editProductType === 'suit' ? 'Suit Dimensions / Length' : 'Length / Blouse'}</span>
                        <span className="text-[10px] text-amber-800 font-normal">Select or type custom</span>
                      </label>
                      <select
                        value={(editProductType === 'suit' ? SUIT_LENGTH_OPTIONS : SAREE_LENGTH_OPTIONS).includes(editLengthWithBlouse) ? editLengthWithBlouse : (editLengthWithBlouse ? 'CUSTOM' : '')}
                        onChange={(e) => {
                          if (e.target.value === 'CUSTOM') {
                            setEditLengthWithBlouse('');
                          } else {
                            setEditLengthWithBlouse(e.target.value);
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800"
                      >
                        <option value="">-- Select Length / Dimensions --</option>
                        {(editProductType === 'suit' ? SUIT_LENGTH_OPTIONS : SAREE_LENGTH_OPTIONS).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                        <option value="CUSTOM">➕ Type Custom Length / Dimensions...</option>
                      </select>

                      {(!(editProductType === 'suit' ? SUIT_LENGTH_OPTIONS : SAREE_LENGTH_OPTIONS).includes(editLengthWithBlouse) || editLengthWithBlouse === '') && (
                        <input
                          type="text"
                          placeholder={editProductType === 'suit' ? 'e.g. 2.5 Meters top 2.5 Meters Duppta' : 'e.g. 6.3 Meters (With Blouse Piece)'}
                          value={editLengthWithBlouse}
                          onChange={(e) => setEditLengthWithBlouse(e.target.value)}
                          className="w-full border border-amber-400 bg-amber-50/50 rounded-lg p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-amber-800 text-amber-950 placeholder:font-normal"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-amber-900 font-bold mb-1 flex items-center justify-between">
                        <span>Design Code (Color Group)</span>
                        <span className="text-[10px] text-amber-800 font-normal">Select or type custom</span>
                      </label>
                      <select
                        value={existingDesignCodes.includes(editDesignCode) ? editDesignCode : 'CUSTOM'}
                        onChange={(e) => {
                          if (e.target.value === 'CUSTOM') {
                            setEditDesignCode('');
                          } else {
                            setEditDesignCode(e.target.value);
                          }
                        }}
                        className="w-full border border-amber-300 bg-amber-50/30 rounded-lg p-2.5 text-xs font-semibold text-amber-950 focus:ring-1 focus:ring-amber-800"
                      >
                        <option value="">-- Select Existing Design Code --</option>
                        {existingDesignCodes.map((dc) => (
                          <option key={dc} value={dc}>
                            {dc}
                          </option>
                        ))}
                        <option value="CUSTOM">➕ Type New Design Code...</option>
                      </select>

                      {(!existingDesignCodes.includes(editDesignCode) || editDesignCode === '') && (
                        <input
                          type="text"
                          placeholder="Type new Design Code (e.g. MS-SILVER-ZARI)"
                          value={editDesignCode}
                          onChange={(e) => setEditDesignCode(e.target.value)}
                          className="w-full border border-amber-400 bg-amber-50/50 rounded-lg p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-amber-800 text-amber-950 placeholder:font-normal"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Category *</label>
                      <select
                        value={editCategoryId}
                        onChange={(e) => setEditCategoryId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium"
                      >
                        {categories
                          .filter((c) => c.isParent || !c.parentId)
                          .map((parent) => {
                            const children = categories.filter((c) => c.parentId === parent.id);
                            return (
                              <optgroup key={parent.id} label={`📁 PARENT: ${parent.name}`}>
                                <option value={parent.id}>
                                  📁 {parent.name} (Parent Category)
                                </option>
                                {children.map((child) => (
                                  <option key={child.id} value={child.id}>
                                    &nbsp;&nbsp;↳ {child.name} (Child Category)
                                  </option>
                                ))}
                              </optgroup>
                            );
                          })}
                        {categories.filter(
                          (c) => !c.isParent && c.parentId && !categories.some((p) => p.id === c.parentId)
                        ).map((c) => (
                          <option key={c.id} value={c.id}>
                            ↳ {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Multiple Image Upload & Primary Cover Photo Selection Box (Edit Modal) */}
                <div className="space-y-3 p-4 bg-amber-50/60 border border-amber-200/90 rounded-2xl shadow-2xs font-sans">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-amber-200/60 pb-2">
                    <div>
                      <label className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                        <Upload className="w-4 h-4 text-amber-800" />
                        <span>{editProductType === 'suit' ? 'Suit' : 'Saree'} Photos Gallery ({editImagesList.length} Photos)</span>
                      </label>
                      <p className="text-[11px] text-amber-900/80 font-medium mt-0.5">
                        📸 Upload 1 or multiple photos. Click <span className="font-bold text-amber-950">"★ Set as Default Cover"</span> to make any photo the primary thumbnail!
                      </p>
                    </div>
                    {isEditUploading && (
                      <span className="text-amber-800 animate-pulse text-xs font-bold shrink-0">Uploading photos...</span>
                    )}
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEditMultipleImageUpload}
                    className="block w-full text-xs text-gray-700 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-extrabold file:bg-amber-900 file:text-white hover:file:bg-black cursor-pointer bg-white p-1 rounded-xl border border-amber-300"
                  />

                  {editImagesList.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <span className="text-[11px] font-bold text-gray-700 block uppercase tracking-wider">
                        Current {editProductType === 'suit' ? 'Suit' : 'Saree'} Photos (Index 0 is default thumbnail):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {editImagesList.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className={`group relative bg-white border-2 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between p-1.5 transition-all ${
                              idx === 0
                                ? 'border-amber-600 ring-2 ring-amber-400/50 bg-amber-50/30'
                                : 'border-gray-200 hover:border-amber-400'
                            }`}
                          >
                            <div className="relative aspect-4/5 w-full rounded-lg overflow-hidden bg-gray-100">
                              <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                              <WatermarkOverlay />

                              {/* Primary Cover Badge */}
                              {idx === 0 ? (
                                <span className="absolute top-1 left-1 bg-amber-900 text-amber-50 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow flex items-center gap-1 uppercase tracking-wider z-10">
                                  ⭐ Primary Cover
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleEditSetPrimaryImage(idx)}
                                  className="absolute top-1 left-1 bg-black/75 hover:bg-amber-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-90 hover:opacity-100 transition-all cursor-pointer z-10"
                                >
                                  ★ Set as Cover
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleEditRemoveImage(idx)}
                                className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow transition-all cursor-pointer z-10"
                                title="Delete this photo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500 font-bold px-0.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleEditMoveImage(idx, 'left')}
                                className="px-1.5 py-0.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="Move left"
                              >
                                ←
                              </button>
                              <span>Photo #{idx + 1}</span>
                              <button
                                type="button"
                                disabled={idx === editImagesList.length - 1}
                                onClick={() => handleEditMoveImage(idx, 'right')}
                                className="px-1.5 py-0.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="Move right"
                              >
                                →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Description & Craft Story (Appears in Product Details Accordion)</label>
                  <textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium"
                  />
                </div>

                {editMsg && (
                  <p className={`text-xs font-bold ${editMsg.startsWith('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {editMsg}
                  </p>
                )}
              </div>

              {/* Modal Fixed Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-gray-200 bg-gray-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-100 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-950 hover:bg-black text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Category Manager */}
      {activeTab === 'categories' && (
        <div className="mt-6 space-y-6">
          {/* Add Category Form Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-2xl">
            <h3 className="text-lg font-serif font-bold text-amber-950 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-amber-800" />
              <span>Add New Saree Category</span>
            </h3>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garbha Reshami Special, Tissue Zari, Royal Mulberry Silk"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-amber-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Category Hierarchy & Type *</label>
                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                      <input
                        type="radio"
                        name="catHierarchy"
                        checked={catIsParent && !catParentId}
                        onChange={() => {
                          setCatIsParent(true);
                          setCatParentId('');
                        }}
                        className="w-4 h-4 text-amber-900 focus:ring-amber-800"
                      />
                      <span className="bg-amber-100 text-amber-950 px-2.5 py-1 rounded text-xs font-extrabold border border-amber-300">
                        📁 Top-Level Parent Category
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                      <input
                        type="radio"
                        name="catHierarchy"
                        checked={!!catParentId}
                        onChange={() => {
                          setCatIsParent(false);
                          const firstParent = categories.find((c) => c.isParent || !c.parentId);
                          if (firstParent) setCatParentId(firstParent.id);
                        }}
                        className="w-4 h-4 text-amber-900 focus:ring-amber-800"
                      />
                      <span className="bg-indigo-50 text-indigo-900 px-2.5 py-1 rounded text-xs font-extrabold border border-indigo-200">
                        ↳ Child / Sub-Category
                      </span>
                    </label>
                  </div>

                  {!!catParentId && (
                    <div className="pt-1">
                      <label className="block text-amber-950 font-bold mb-1">Select Parent Category *</label>
                      <select
                        value={catParentId}
                        onChange={(e) => {
                          setCatParentId(e.target.value);
                          setCatIsParent(false);
                        }}
                        className="w-full border border-amber-300 rounded-lg p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800 text-gray-900"
                      >
                        {categories
                          .filter((c) => c.isParent || !c.parentId)
                          .map((parent) => (
                            <option key={parent.id} value={parent.id}>
                              📁 {parent.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Hide Category Checkbox Option */}
                <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl mt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-rose-950">
                    <input
                      type="checkbox"
                      checked={catIsHidden}
                      onChange={(e) => setCatIsHidden(e.target.checked)}
                      className="w-4 h-4 text-rose-700 rounded focus:ring-rose-600"
                    />
                    <span>🙈 Hide this Category from Website Storefront</span>
                  </label>
                  <p className="text-[10px] text-rose-800/80 mt-1 pl-6">
                    Check this box if you want to temporarily hide this parent or sub-category from the storefront.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Short description of craft weaving style or heritage..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs font-medium"
                />
              </div>

              {/* Category Image Upload 1: Circle Avatar Icon */}
              <div className="space-y-2 p-3.5 bg-amber-50/70 border border-amber-300/80 rounded-xl">
                <label className="block font-extrabold text-xs text-amber-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <Upload className="w-4 h-4 text-amber-800" />
                    <span>1. Category Circle Avatar Icon (Circle Carousel Photo)</span>
                  </span>
                  {isCatUploading && <span className="text-amber-700 animate-pulse text-[11px]">Uploading photo...</span>}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCatImageUpload}
                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-amber-900 file:text-white hover:file:bg-amber-950 cursor-pointer bg-white p-1 border rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Or paste direct image URL (e.g. /uploads/saree_123.jpg)"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-xs font-mono bg-white mt-1"
                />

                {catImage && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-amber-600 overflow-hidden relative shadow-xs bg-white shrink-0">
                      <img src={catImage} alt="Avatar Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCatImage('')}
                        className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[11px] text-emerald-800 font-semibold space-y-0.5">
                      <p className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Circle Avatar Icon set!</span>
                      </p>
                      <p className="text-gray-500 font-mono text-[10px] truncate max-w-xs">{catImage}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Category Image Upload 2: Category Hero Banner Image */}
              <div className="space-y-2 p-3.5 bg-amber-100/60 border border-amber-300 rounded-xl">
                <label className="block font-extrabold text-xs text-amber-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <Upload className="w-4 h-4 text-amber-800" />
                    <span>2. Category Hero Banner Header Image (Products Page Banner)</span>
                  </span>
                  {isCatBannerUploading && <span className="text-amber-700 animate-pulse text-[11px]">Uploading banner...</span>}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCatBannerImageUpload}
                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-amber-900 file:text-white hover:file:bg-amber-950 cursor-pointer bg-white p-1 border rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Or paste direct banner image URL (e.g. /uploads/maheshwari_legacy_banner.png)"
                  value={catBannerImage}
                  onChange={(e) => setCatBannerImage(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-xs font-mono bg-white mt-1"
                />

                {catBannerImage && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="w-24 h-12 rounded border-2 border-amber-700 overflow-hidden relative shadow-xs bg-white shrink-0">
                      <img src={catBannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCatBannerImage('')}
                        className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[11px] text-emerald-800 font-semibold space-y-0.5">
                      <p className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Hero Banner Image set!</span>
                      </p>
                      <p className="text-gray-500 font-mono text-[10px] truncate max-w-xs">{catBannerImage}</p>
                    </div>
                  </div>
                )}
              </div>

              {catFormMsg && (
                <p className={`text-xs font-bold ${catFormMsg.startsWith('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {catFormMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-950 hover:bg-black text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-amber-400" />
                <span>CREATE CATEGORY</span>
              </button>
            </form>
          </div>

          {/* Active Categories List */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-amber-950 text-lg flex items-center gap-2">
              <Folder className="w-5 h-5 text-amber-800" />
              <span>Active Saree Categories ({categories.length})</span>
            </h3>

            {categories.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg text-gray-500 text-xs font-semibold">
                No categories found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className={`p-4 border rounded-xl bg-white shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between space-y-3 ${cat.isHidden ? 'border-rose-300 bg-rose-50/20' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-3">
                      {/* Avatar & Banner Previews */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        {cat.image ? (
                          <div className="w-12 h-12 rounded-full border-2 border-amber-600 overflow-hidden shadow-2xs relative" title="Circle Avatar Image">
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-900 font-bold">
                            <Folder className="w-5 h-5 text-amber-800" />
                          </div>
                        )}

                        {cat.bannerImage && (
                          <div className="w-14 h-8 rounded border border-amber-500 overflow-hidden shadow-2xs relative" title="Hero Banner Header Image">
                            <img src={cat.bannerImage} alt={`${cat.name} Banner`} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="font-bold text-gray-900 text-sm">{cat.name}</h4>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                            {cat._count?.products || 0} Sarees
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {cat.isParent || !cat.parentId ? (
                            <span className="bg-amber-100 text-amber-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                              📁 PARENT CATEGORY
                            </span>
                          ) : (
                            <span className="bg-indigo-50 text-indigo-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-200">
                              ↳ Sub of {cat.parent?.name || categories.find((p) => p.id === cat.parentId)?.name || 'Parent'}
                            </span>
                          )}

                          {cat.isHidden ? (
                            <span className="bg-rose-100 text-rose-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-rose-300 flex items-center gap-1">
                              <EyeOff className="w-3 h-3 text-rose-700" />
                              <span>HIDDEN</span>
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>VISIBLE</span>
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] font-mono text-gray-400">slug: {cat.slug}</p>
                        {cat.description && <p className="text-[11px] text-gray-600 line-clamp-2">{cat.description}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => openEditCatModal(cat)}
                        className="flex-1 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-md font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-800" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleCategoryVisibility(cat)}
                        className={`py-1.5 px-2.5 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                          cat.isHidden
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                        }`}
                      >
                        {cat.isHidden ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-800" />
                            <span>Show</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-amber-800" />
                            <span>Hide</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="py-1.5 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Category Modal Overlay */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-start justify-center p-4 sm:p-6 pt-10 sm:pt-14 overflow-hidden">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl border border-amber-900/20 relative text-xs overflow-hidden">
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-amber-900/20 shrink-0 bg-amber-950 text-amber-50">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-serif font-bold text-amber-100">
                  Edit Category Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-amber-800/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form with Scrollable Body & Fixed Footer */}
            <form onSubmit={handleSaveEditCategory} className="flex flex-col flex-1 min-h-0 bg-white">
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Category Hierarchy & Type *</label>
                  <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                        <input
                          type="radio"
                          name="editCatHierarchy"
                          checked={editCatIsParent && !editCatParentId}
                          onChange={() => {
                            setEditCatIsParent(true);
                            setEditCatParentId('');
                          }}
                          className="w-4 h-4 text-amber-900 focus:ring-amber-800"
                        />
                        <span className="bg-amber-100 text-amber-950 px-2.5 py-1 rounded text-xs font-extrabold border border-amber-300">
                          📁 Top-Level Parent Category
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                        <input
                          type="radio"
                          name="editCatHierarchy"
                          checked={!!editCatParentId}
                          onChange={() => {
                            setEditCatIsParent(false);
                            const firstParent = categories.find((c) => (c.isParent || !c.parentId) && c.id !== editingCategory?.id);
                            if (firstParent) setEditCatParentId(firstParent.id);
                          }}
                          className="w-4 h-4 text-amber-900 focus:ring-amber-800"
                        />
                        <span className="bg-indigo-50 text-indigo-900 px-2.5 py-1 rounded text-xs font-extrabold border border-indigo-200">
                          ↳ Child / Sub-Category
                        </span>
                      </label>
                    </div>

                    {!!editCatParentId && (
                      <div className="pt-1">
                        <label className="block text-amber-950 font-bold mb-1">Select Parent Category *</label>
                        <select
                          value={editCatParentId}
                          onChange={(e) => {
                            setEditCatParentId(e.target.value);
                            setEditCatIsParent(false);
                          }}
                          className="w-full border border-amber-300 rounded-lg p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800 text-gray-900"
                        >
                          {categories
                            .filter((c) => (c.isParent || !c.parentId) && c.id !== editingCategory?.id)
                            .map((parent) => (
                              <option key={parent.id} value={parent.id}>
                                📁 {parent.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Hide Category Checkbox in Edit Modal */}
                  <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl mt-3">
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-rose-950">
                      <input
                        type="checkbox"
                        checked={editCatIsHidden}
                        onChange={(e) => setEditCatIsHidden(e.target.checked)}
                        className="w-4 h-4 text-rose-700 rounded focus:ring-rose-600"
                      />
                      <span>🙈 Hide this Category from Website Storefront</span>
                    </label>
                    <p className="text-[10px] text-rose-800/80 mt-1 pl-6">
                      Check this box if you want to hide this category from the website storefront.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editCatDescription}
                    onChange={(e) => setEditCatDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium"
                  />
                </div>

                {/* Edit Category Image 1: Circle Avatar Icon */}
                <div className="space-y-2 p-3.5 bg-amber-50/70 border border-amber-300/80 rounded-xl">
                  <label className="block font-extrabold text-xs text-amber-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <Upload className="w-4 h-4 text-amber-800" />
                      <span>1. Category Circle Avatar Icon (Circle Carousel Photo)</span>
                    </span>
                    {isEditCatUploading && <span className="text-amber-700 animate-pulse text-[11px]">Uploading photo...</span>}
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditCatImageUpload}
                    className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-amber-900 file:text-white hover:file:bg-amber-950 cursor-pointer bg-white p-1 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Or paste direct image URL (e.g. /uploads/saree_123.jpg)"
                    value={editCatImage}
                    onChange={(e) => setEditCatImage(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs font-mono bg-white mt-1"
                  />

                  {editCatImage && (
                    <div className="pt-2 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-amber-600 overflow-hidden relative shadow-xs bg-white shrink-0">
                        <img src={editCatImage} alt="Avatar Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEditCatImage('')}
                          className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-gray-500 font-mono text-[10px] truncate max-w-xs">{editCatImage}</p>
                    </div>
                  )}
                </div>

                {/* Edit Category Image 2: Category Hero Banner Image */}
                <div className="space-y-2 p-3.5 bg-amber-100/60 border border-amber-300 rounded-xl">
                  <label className="block font-extrabold text-xs text-amber-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <Upload className="w-4 h-4 text-amber-800" />
                      <span>2. Category Hero Banner Header Image (Products Page Banner)</span>
                    </span>
                    {isEditCatBannerUploading && <span className="text-amber-700 animate-pulse text-[11px]">Uploading banner...</span>}
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditCatBannerImageUpload}
                    className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-amber-900 file:text-white hover:file:bg-amber-950 cursor-pointer bg-white p-1 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Or paste direct banner image URL (e.g. /uploads/maheshwari_legacy_banner.png)"
                    value={editCatBannerImage}
                    onChange={(e) => setEditCatBannerImage(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs font-mono bg-white mt-1"
                  />

                  {editCatBannerImage && (
                    <div className="pt-2 flex items-center gap-3">
                      <div className="w-24 h-12 rounded border-2 border-amber-700 overflow-hidden relative shadow-xs bg-white shrink-0">
                        <img src={editCatBannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEditCatBannerImage('')}
                          className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-gray-500 font-mono text-[10px] truncate max-w-xs">{editCatBannerImage}</p>
                    </div>
                  )}
                </div>

                {editCatMsg && (
                  <p className={`text-xs font-bold ${editCatMsg.startsWith('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {editCatMsg}
                  </p>
                )}
              </div>

              {/* Modal Fixed Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-gray-200 bg-gray-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-100 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-950 hover:bg-black text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  SAVE CATEGORY CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Push Notifications Tab Panel */}
      {activeTab === 'push' && (
        <div className="mt-8 max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300">
              <Bell className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="font-serif font-extrabold text-lg text-gray-900">
                Broadcast Web Push Notification
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Send real-time browser push notifications to all subscribed customers across India.
              </p>
            </div>
          </div>

          <form onSubmit={handleSendPush} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Notification Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 🎉 Royal Maheshwari Festive Sale - 30% OFF!"
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Notification Message Body *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Shop authentic Maheshwari silk-cotton sarees directly from Maheshwar looms. Free shipping across India!"
                value={pushMessage}
                onChange={(e) => setPushMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Target URL / Page Link
              </label>
              <input
                type="text"
                placeholder="e.g. /products or /products/yellow-silver-zari"
                value={pushLink}
                onChange={(e) => setPushLink(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Banner Image URL (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. /uploads/saree_1789062703690_a4mpx.jpeg"
                value={pushImage}
                onChange={(e) => setPushImage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-900 font-medium"
              />
            </div>

            {pushResultMsg && (
              <p
                className={`p-3 rounded-lg text-xs font-bold ${
                  pushResultMsg.startsWith('✓')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {pushResultMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isPushSending}
              className="w-full py-3.5 bg-amber-900 hover:bg-amber-950 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-200" />
              <span>{isPushSending ? 'Broadcasting Push Notification...' : 'SEND BROADCAST PUSH NOTIFICATION'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Instagram Feed Manager Tab Panel */}
      {activeTab === 'insta' && (
        <div className="mt-8 space-y-6">
          {/* Add Instagram Post Form Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs max-w-2xl">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center p-0.5">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-serif font-extrabold text-lg text-gray-900">
                  Add New Instagram Feed Post
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Upload photos or videos from your Instagram account (@reoti_handloom) to display live on the Homepage.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddInstaPost} className="space-y-4 text-xs font-sans">
              {/* Primary Instagram Link Input Box */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-xl space-y-1.5 shadow-2xs">
                <label className="block text-gray-900 font-extrabold text-xs flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-rose-600" />
                  <span>Paste Instagram Post or Reel Link (URL) *</span>
                </label>
                <p className="text-[11px] text-gray-500 font-medium">
                  Copy link from Instagram App/Web and paste here. Real photo, caption & likes count will be <b>automatically extracted!</b>
                </p>
                <input
                  type="text"
                  placeholder="e.g. https://www.instagram.com/reel/DclLir-JOJD/"
                  value={instaPostUrl}
                  onChange={(e) => setInstaPostUrl(e.target.value)}
                  className="w-full border border-amber-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-rose-500 font-bold bg-white text-gray-900"
                />
              </div>

              {/* Optional Photo Upload Override */}
              <div className="space-y-2 p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                <label className="block font-bold text-gray-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-amber-700" />
                    <span>Upload Custom Photo (Optional - Auto-extracted from link if left empty)</span>
                  </span>
                  {isInstaUploading && <span className="text-amber-700 animate-pulse text-[11px]">Uploading photo...</span>}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInstaImageUpload}
                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-amber-900 file:text-white hover:file:bg-black cursor-pointer"
                />

                {instaImage && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="w-20 h-20 rounded-lg border border-gray-300 overflow-hidden relative shadow-xs bg-white shrink-0">
                      <img src={instaImage} alt="Insta Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setInstaImage('')}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[11px] text-emerald-800 font-semibold space-y-0.5 overflow-hidden">
                      <p className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Custom Photo selected!</span>
                      </p>
                      <p className="text-gray-500 font-mono text-[10px] truncate">{instaImage}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Post Caption & Saree Story (Optional - Auto-extracted from link)
                </label>
                <textarea
                  rows={2}
                  placeholder="Leave empty to auto-extract caption from Instagram, or type custom notes..."
                  value={instaCaption}
                  onChange={(e) => setInstaCaption(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Display Likes Count (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1,842"
                  value={instaLikes}
                  onChange={(e) => setInstaLikes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-rose-500 font-medium"
                />
              </div>

              {instaFormMsg && (
                <p className={`p-3 rounded-lg text-xs font-bold ${instaFormMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                  {instaFormMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>PUBLISH INSTAGRAM REEL / POST TO HOMEPAGE</span>
              </button>
            </form>
          </div>

          {/* Current Feed Posts Grid */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-amber-950 text-lg flex items-center gap-2">
              <Camera className="w-5 h-5 text-rose-600" />
              <span>Current Homepage Instagram Posts ({instaPosts.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {instaPosts.map((p, idx) => (
                <div key={p.id || idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="aspect-square bg-slate-100 relative">
                      <img src={p.image} alt={p.caption} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {p.likes || '1,840'} Likes
                      </div>
                    </div>
                    <div className="p-3 text-xs space-y-1">
                      <p className="font-bold text-rose-700 text-[11px]">@{p.handle || 'reoti_handloom'}</p>
                      <p className="text-gray-700 line-clamp-3 text-[11px] leading-snug">{p.caption}</p>
                    </div>
                  </div>

                  <div className="p-3 border-t border-gray-100 flex items-center justify-between gap-2 bg-gray-50">
                    {p.postUrl && (
                      <a
                        href={p.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                      >
                        <span>View on Insta</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {p.id && !p.id.startsWith('default-') && (
                      <button
                        onClick={() => handleDeleteInstaPost(p.id)}
                        className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded font-bold text-[10px] flex items-center gap-1 transition-colors ml-auto cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
