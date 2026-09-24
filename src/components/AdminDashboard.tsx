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
  Flame,
  MapPin,
  Smartphone,
  Laptop,
  Gift,
  Sparkles,
  RotateCcw,
  User,
  ArrowLeft,
  ChevronRight,
  LayoutGrid,
  Truck,
  CheckCircle2,
  Search,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Video,
  BookOpen,
  Play,
} from 'lucide-react';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';
import BlogManagerTab from '@/components/BlogManagerTab';

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

  const [activeTab, setActiveTab] = useState<'hub' | 'orders' | 'leads' | 'customers' | 'add' | 'products' | 'semi_products' | 'add_semi' | 'categories' | 'push' | 'insta' | 'blogs'>('hub');

  // Dashboard Stats
  const [orders, setOrders] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
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
  const [activityFilter, setActivityFilter] = useState<'ALL' | 'LEAD' | 'VISIT' | 'LOGIN' | 'REGISTER' | 'ORDER'>('ALL');
  const [activityRoleFilter, setActivityRoleFilter] = useState<'CUSTOMERS' | 'ADMIN' | 'ALL'>('CUSTOMERS');
  const [handloomFilter, setHandloomFilter] = useState<'sarees' | 'suits' | 'all'>('sarees');
  const [catFilter, setCatFilter] = useState<'all' | 'sarees' | 'suits' | 'semi'>('all');
  const [semiSubcategoryFilter, setSemiSubcategoryFilter] = useState<string>('ALL');

  // Activity role segregation logic (Hooks must be at top-level before any early returns)
  const knownAdminIps = React.useMemo(() => new Set(
    customerData.activities
      .filter((a) => a.userEmail === 'reotihandloom@gmail.com' || a.pageUrl?.includes('manage') || a.isAdmin)
      .map((a) => a.userIp)
      .filter(Boolean)
  ), [customerData.activities]);

  const isActAdmin = React.useCallback((a: any) =>
    Boolean(
      a.isAdmin === true ||
      a.userRole === 'ADMIN' ||
      a.type === 'ADMIN_VISIT' ||
      a.type === 'ADMIN_ACTION' ||
      a.userEmail === 'reotihandloom@gmail.com' ||
      a.userEmail?.toLowerCase().includes('admin') ||
      a.userName?.toUpperCase() === 'REOTI' ||
      a.pageUrl?.startsWith('/admin') ||
      a.pageUrl?.startsWith('/reoti-studio-manage') ||
      a.title?.toLowerCase().includes('admin') ||
      (a.userIp && knownAdminIps.has(a.userIp))
    ), [knownAdminIps]);

  const customerActs = React.useMemo(() => customerData.activities.filter((a) => !isActAdmin(a)), [customerData.activities, isActAdmin]);
  const adminActs = React.useMemo(() => customerData.activities.filter((a) => isActAdmin(a)), [customerData.activities, isActAdmin]);

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

  // Order Management state (Amazon / Myntra / Nykaa style order processing & tracking)
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<any | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any | null>(null);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Out of Stock / Saree Unavailable');
  const [cancelCustomNote, setCancelCustomNote] = useState<string>('');
  const [dispatchCourier, setDispatchCourier] = useState<string>('Delhivery');
  const [dispatchTrackingNumber, setDispatchTrackingNumber] = useState<string>('');
  const [dispatchTrackingUrl, setDispatchTrackingUrl] = useState<string>('');
  const [dispatchEstimatedDelivery, setDispatchEstimatedDelivery] = useState<string>('3-5 Business Days');
  const [dispatchNotes, setDispatchNotes] = useState<string>('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState<boolean>(false);
  const [orderActionMsg, setOrderActionMsg] = useState<string>('');

  const getCustomerStatusWhatsAppUrl = (order: any, targetStatus?: string, extraData: any = {}) => {
    const custPhone = (order.customerPhone || '').replace(/\D/g, '');
    if (!custPhone) return '#';

    const orderNum = order.orderNumber || order.id;
    const status = (targetStatus || order.status || 'PROCESSING').toUpperCase();
    const courier = extraData.courierPartner || order.courierPartner || 'Reoti Handloom Express';
    const trackNo = extraData.trackingNumber || order.trackingNumber || '';
    const est = extraData.estimatedDelivery || order.estimatedDelivery || '3-5 Business Days';
    const reason = extraData.cancellationReason || order.cancellationReason || 'Order cancelled';
    const isCod = (order.paymentMethod || '').toUpperCase().includes('COD') || (order.paymentMethod || '').toUpperCase().includes('CASH') || order.paymentStatus === 'PENDING_COD';
    const isPaid = order.paymentStatus === 'PAID' || (!isCod && (order.paymentMethod || '').toLowerCase().includes('razorpay'));

    let msgText = '';

    if (status === 'CONFIRMED') {
      msgText =
        `Greetings from Reoti Handloom! 🙏\n\n` +
        `We are delighted to confirm that your *Reoti Handloom Maheshwari Order #${orderNum}* has been *ACCEPTED & CONFIRMED* by our master weavers!\n\n` +
        `📦 *Order Total:* ₹${Number(order.totalAmount || 0).toLocaleString()}\n` +
        (isCod
          ? `💵 *Payment Mode:* Cash on Delivery (Pay ₹${Number(order.totalAmount || 0).toLocaleString()} upon delivery)\n`
          : `💳 *Payment Mode:* Prepaid Online (Paid Successfully)\n`) +
        `🧵 *Status:* Confirmed & Under Preparation at Maheshwar Workshop\n` +
        `📍 *Delivery Address:* ${order.shippingAddress || 'Your Address'}\n\n` +
        `🔍 *Track Order in Real-Time:* https://reotihandloom.com (Click "ORDERS" at top)\n\n` +
        `Thank you for patronizing authentic Indian handloom heritage! 🌸\n` +
        `📞 *Customer Support:* +91 96174 44445`;
    } else if (status === 'PACKED') {
      msgText =
        `Greetings from Reoti Handloom! 🙏\n\n` +
        `Your *Reoti Handloom Maheshwari Order #${orderNum}* has successfully passed our quality inspection and is now *SAFELY PACKED* in heritage gift packaging!\n\n` +
        `📦 *Status:* Packed & Ready for Courier Dispatch\n` +
        (isCod
          ? `💵 *Payment on Delivery:* ₹${Number(order.totalAmount || 0).toLocaleString()} (Cash / UPI accepted by courier executive)\n`
          : `💳 *Payment Status:* Pre-Paid Online\n`) +
        `🚚 *Next Step:* Handover to Logistics Partner\n\n` +
        `🔍 *Track Order:* https://reotihandloom.com\n\n` +
        `Thank you for supporting handloom craftsmanship! 🌸\n` +
        `📞 *Customer Support:* +91 96174 44445`;
    } else if (status === 'SHIPPED' || status === 'IN_TRANSIT') {
      msgText =
        `Greetings from Reoti Handloom! 🙏\n\n` +
        `Your *Reoti Handloom Maheshwari Order #${orderNum}* has been *DISPATCHED* from our Maheshwar workshop!\n\n` +
        `📦 *Status:* In-Transit (Dispatched)\n` +
        `🚚 *Courier Partner:* ${courier}\n` +
        `🔖 *Tracking / AWB No:* ${trackNo || 'RH-' + orderNum}\n` +
        `📅 *Estimated Delivery:* ${est}\n` +
        (isCod
          ? `💵 *Amount to Pay on Delivery:* ₹${Number(order.totalAmount || 0).toLocaleString()} (Cash or UPI to delivery agent)\n\n`
          : `💳 *Payment Status:* Pre-Paid Online (Zero collection required)\n\n`) +
        `🔍 *Track Order in Real-Time:* https://reotihandloom.com (Click "ORDERS" at top)\n\n` +
        `Thank you for supporting authentic handloom weavers of Maheshwar! 🌸\n` +
        `📞 *Customer Support:* +91 96174 44445`;
    } else if (status === 'OUT_FOR_DELIVERY') {
      msgText =
        `Greetings from Reoti Handloom! 🙏\n\n` +
        `Exciting news! Your *Reoti Handloom Maheshwari Order #${orderNum}* is *OUT FOR DELIVERY* today!\n\n` +
        `🛵 *Status:* Out for Delivery\n` +
        `🚚 *Courier Partner:* ${courier}\n` +
        (trackNo ? `🔖 *Tracking No:* ${trackNo}\n` : '') +
        `📍 *Delivery Address:* ${order.shippingAddress || 'Your Address'}\n` +
        (isCod
          ? `💵 *Amount Payable:* ₹${Number(order.totalAmount || 0).toLocaleString()} (Please keep exact cash or UPI ready for delivery executive)\n\n`
          : `💳 *Payment:* Pre-Paid Online (No collection needed)\n\n`) +
        `Please keep your phone handy to receive the parcel from the delivery executive.\n\n` +
        `📞 *Customer Support:* +91 96174 44445`;
    } else if (status === 'DELIVERED') {
      msgText =
        `Greetings from Reoti Handloom! 🙏\n\n` +
        `Your *Reoti Handloom Maheshwari Order #${orderNum}* has been *SUCCESSFULLY DELIVERED*!\n\n` +
        (isCod
          ? `💵 *Payment:* ₹${Number(order.totalAmount || 0).toLocaleString()} Cash on Delivery received upon delivery.\n`
          : `💳 *Payment:* Pre-Paid Online.\n`) +
        `🌸 We hope you adore your authentic handcrafted Maheshwari saree/suit!\n` +
        `⭐ We would love to receive your feedback & review on our website.\n\n` +
        `📞 *For Future Orders or Queries:* +91 96174 44445\n` +
        `🌐 *Website:* https://reotihandloom.com\n\n` +
        `Thank you for celebrating genuine Indian handloom heritage with Reoti Handloom! 🌸`;
    } else if (status === 'CANCELLED') {
      const refundInfo = isCod
        ? `💵 *Payment Info:* Cash on Delivery Order (Zero payment charged. No refund required).`
        : `💳 *Refund Info:* Full refund of ₹${Number(order.totalAmount || 0).toLocaleString()} will be automatically credited to your original payment method in 3-5 working days.`;

      msgText =
        `Greetings from Reoti Handloom! 🙏\n\n` +
        `Important update regarding your *Reoti Handloom Maheshwari Order #${orderNum}*:\n\n` +
        `❌ *Order Status:* CANCELLED\n` +
        `⚠️ *Reason:* ${reason}\n` +
        `${refundInfo}\n\n` +
        `We sincerely apologize for any inconvenience caused. If you would like assistance selecting any other pure Maheshwari saree or suit, please reply directly to this message.\n\n` +
        `📞 *Customer Support:* +91 96174 44445\n` +
        `🌐 *Website:* https://reotihandloom.com\n\n` +
        `Thank you for your patience and understanding!`;
    } else {
      msgText =
        `Greetings from Reoti Handloom! 🙏\n\n` +
        `Thank you for placing your order with *Reoti Handloom Maheshwar*!\n\n` +
        `📦 *Order ID:* #${orderNum}\n` +
        `💰 *Total Amount:* ₹${Number(order.totalAmount || 0).toLocaleString()}\n` +
        (isCod
          ? `💵 *Payment Mode:* Cash on Delivery (Pay upon arrival)\n`
          : `💳 *Payment Mode:* Prepaid Online\n`) +
        `📍 *Shipping Address:* ${order.shippingAddress || 'Your Address'}\n` +
        `🧵 *Status:* Order Placed (Under Review by Master Weavers)\n\n` +
        `🔍 *Track Order:* https://reotihandloom.com (Click "ORDERS" at top)\n\n` +
        `📞 *Support Helpline:* +91 96174 44445`;
    }

    return `https://wa.me/91${custPhone}?text=${encodeURIComponent(msgText)}`;
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, extraData: any = {}, shouldNotifyWhatsApp: boolean = true) => {
    setIsUpdatingOrder(true);

    // Auto-open WhatsApp message for customer synchronously
    if (shouldNotifyWhatsApp) {
      const targetOrder = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (targetOrder) {
        const waUrl = getCustomerStatusWhatsAppUrl(targetOrder, newStatus, extraData);
        if (waUrl && waUrl !== '#') {
          try {
            window.open(waUrl, '_blank');
          } catch (e) {
            console.error('WhatsApp popup error:', e);
          }
        }
      }
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
          ...extraData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId || o.orderNumber === orderId
              ? { ...o, status: newStatus, ...extraData, updatedAt: new Date().toISOString() }
              : o
          )
        );
        setOrderActionMsg(`✅ Order #${data.order?.orderNumber || orderId} status updated to ${newStatus}`);
        setTimeout(() => setOrderActionMsg(''), 4000);
      } else {
        alert(data.error || 'Failed to update order');
      }
    } catch (err: any) {
      alert('Error updating order: ' + err.message);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleOpenDispatchModal = (order: any) => {
    setSelectedOrderForDispatch(order);
    setDispatchCourier(order.courierPartner || 'Delhivery');
    setDispatchTrackingNumber(order.trackingNumber || '');
    setDispatchTrackingUrl(order.trackingUrl || '');
    setDispatchEstimatedDelivery(order.estimatedDelivery || '3-5 Business Days');
    setDispatchNotes(order.notes || '');
  };

  const handleSaveDispatchAndNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDispatch) return;

    let autoUrl = dispatchTrackingUrl.trim();
    const trackNo = dispatchTrackingNumber.trim();
    if (!autoUrl && trackNo) {
      const c = dispatchCourier.toLowerCase();
      if (c.includes('anjani')) {
        autoUrl = `https://www.shreeanjanicourier.com/`;
      } else if (c.includes('maruti')) {
        autoUrl = `https://track.shreemaruti.com/`;
      } else if (c.includes('dtdc')) {
        autoUrl = `https://track.dtdc.com/ctrack/track?strRefNo=${trackNo}`;
      } else if (c.includes('delhivery')) {
        autoUrl = `https://www.delhivery.com/track/package/${trackNo}`;
      } else if (c.includes('blue')) {
        autoUrl = `https://www.bluedart.com/tracking`;
      } else if (c.includes('post') || c.includes('speed')) {
        autoUrl = `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
      } else if (c.includes('shiprocket')) {
        autoUrl = `https://shiprocket.co/tracking/${trackNo}`;
      }
    }

    const dispatchData = {
      courierPartner: dispatchCourier,
      trackingNumber: trackNo,
      trackingUrl: autoUrl,
      estimatedDelivery: dispatchEstimatedDelivery,
      notes: dispatchNotes,
    };

    // Auto-open WhatsApp tracking message IMMEDIATELY (sync)
    const waUrl = getCustomerStatusWhatsAppUrl(selectedOrderForDispatch, 'SHIPPED', dispatchData);
    if (waUrl && waUrl !== '#') {
      try {
        window.open(waUrl, '_blank');
      } catch (e) {
        console.error('Error opening WhatsApp tracking:', e);
      }
    }

    await handleUpdateOrderStatus(selectedOrderForDispatch.id, 'SHIPPED', dispatchData, false);

    setSelectedOrderForDispatch(null);
  };

  const handleOpenCancelModal = (order: any) => {
    setSelectedOrderForCancel(order);
    setCancelReason('Out of Stock / Saree Unavailable');
    setCancelCustomNote('');
  };

  const handleConfirmCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForCancel) return;

    const finalReason = cancelReason.includes('Other')
      ? (cancelCustomNote.trim() || 'Unforeseen circumstances')
      : cancelReason;
    
    const noteText = `Cancelled by Admin. Reason: ${finalReason}${cancelCustomNote ? `. Note: ${cancelCustomNote}` : ''}`;

    const cancelData = {
      cancellationReason: finalReason,
      notes: noteText,
    };

    // Auto-open WhatsApp message directly
    const waUrl = getCustomerStatusWhatsAppUrl(selectedOrderForCancel, 'CANCELLED', cancelData);
    if (waUrl && waUrl !== '#') {
      try {
        window.open(waUrl, '_blank');
      } catch (err) {
        console.error('Popup error:', err);
      }
    }

    await handleUpdateOrderStatus(selectedOrderForCancel.id, 'CANCELLED', cancelData, false);

    setSelectedOrderForCancel(null);
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
  const [color, setColor] = useState('');
  const [blouseColor, setBlouseColor] = useState('');
  const [lengthWithBlouse, setLengthWithBlouse] = useState('6.3 Meters (With Blouse Piece)');
  const [designCode, setDesignCode] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [semiCategoryId, setSemiCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoUploading, setIsVideoUploading] = useState(false);
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
  const [editColor, setEditColor] = useState('');
  const [editBlouseColor, setEditBlouseColor] = useState('');
  const [editLengthWithBlouse, setEditLengthWithBlouse] = useState('6.3 Meters (With Blouse Piece)');
  const [editDesignCode, setEditDesignCode] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [isEditVideoUploading, setIsEditVideoUploading] = useState(false);
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

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const t = Date.now();
      const [resOrders, resProducts, resCategories, resActivity, resCustomers, resLeads] = await Promise.all([
        fetch(`/api/orders?_t=${t}`, { cache: 'no-store' }).then((r) => r.json()),
        fetch(`/api/products?includeAll=true&_t=${t}`, { cache: 'no-store' }).then((r) => r.json()),
        fetch(`/api/categories?includeHidden=true&_t=${t}`, { cache: 'no-store' }).then((r) => r.json()),
        fetch(`/api/admin/activity?_t=${t}`, { cache: 'no-store' }).then((r) => r.json()),
        fetch(`/api/admin/customers?_t=${t}`, { cache: 'no-store' }).then((r) => r.json()),
        fetch(`/api/leads?_t=${t}`, { cache: 'no-store' }).then((r) => r.json()),
      ]);

      if (resOrders.success) setOrders(resOrders.orders);
      if (resProducts.success) setProducts(resProducts.products);
      if (resActivity.success) setActivities(resActivity.activities || []);
      if (resLeads.success) setLeads(resLeads.leads || []);
      if (resCustomers.success) {
        setCustomerData({
          stats: resCustomers.stats || { totalVisits: 0, totalUsers: 0, loginsToday: 0, totalOrders: 0 },
          users: resCustomers.users || [],
          activities: resCustomers.activities || [],
        });
      }
      if (resCategories.success && Array.isArray(resCategories.categories)) {
        setCategories(resCategories.categories);
        setCategoryId((prev) => {
          if (prev) return prev;
          const silkCottonCat = resCategories.categories.find(
            (c: any) =>
              c.name?.toLowerCase().includes('silk cotton') ||
              c.slug?.includes('silk-cotton')
          );
          return silkCottonCat ? silkCottonCat.id : (resCategories.categories[0]?.id || '');
        });
        setSemiCategoryId((prev) => {
          if (prev) return prev;
          const semiCat = resCategories.categories.find(
            (c: any) =>
              c.slug === 'semi-maheshwari-sarees' ||
              c.id === 'semi-maheshwari-sarees-id' ||
              c.name?.toLowerCase().includes('semi maheshwari')
          );
          return semiCat ? semiCat.id : '';
        });
      }
      fetchInstaPosts();
    } catch (e) {
      console.error(e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Live Auto-Refresh Effect for Admin Dashboard (every 15 seconds + tab focus)
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData(true);

      const interval = setInterval(() => {
        fetchData(false); // Silent background auto-refresh
      }, 15000);

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          fetchData(false);
        }
      };

      window.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleVisibilityChange);

      return () => {
        clearInterval(interval);
        window.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleVisibilityChange);
      };
    }
  }, [user]);

  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
      }
    } catch (e) {
      console.error('Failed to update lead:', e);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this lead?')) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete lead:', e);
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
      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`Server returned status ${res.status}: ${responseText.slice(0, 100) || 'Upload failed'}`);
      }

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
      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`Server returned status ${res.status}: ${responseText.slice(0, 100) || 'Upload failed'}`);
      }

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

  // Video File Upload Handler
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isEdit) setIsEditVideoUploading(true);
    else setIsVideoUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (isEdit) setEditVideoUrl(data.url);
        else setVideoUrl(data.url);
      } else {
        alert('Video upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Video upload error: ' + err.message);
    } finally {
      if (isEdit) setIsEditVideoUploading(false);
      else setIsVideoUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent, isSemiParam?: boolean) => {
    e.preventDefault();
    const isSemi = isSemiParam !== undefined ? isSemiParam : activeTab === 'add_semi';
    const semiCat = categories.find(
      (c) => c.slug === 'semi-maheshwari-sarees' || c.id === 'semi-maheshwari-sarees-id' || c.name?.toLowerCase().includes('semi maheshwari')
    );
    const effectiveCategoryId = isSemi ? (semiCategoryId || semiCat?.id || 'semi-maheshwari-sarees-id') : categoryId;

    if (!title || !price || !effectiveCategoryId) {
      setFormMsg('Please fill in required product fields (Title, Price, Category).');
      return;
    }

    const effectiveOriginalPrice = originalPrice && originalPrice.trim() !== '' ? parseFloat(originalPrice) : parseFloat(price);

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
          originalPrice: effectiveOriginalPrice,
          fabric: isSemi ? (fabric || 'Semi Maheshwari') : fabric,
          weaveType: isSemi ? (weaveType || 'Modern Weave Zari Border') : weaveType,
          borderType,
          color,
          blouseColor: blouseColor.trim() || null,
          lengthWithBlouse,
          designCode: designCode.trim() || null,
          categoryId: effectiveCategoryId,
          images: JSON.stringify(finalImages),
          videoUrl: videoUrl.trim() || null,
          isFeatured,
          isBestSeller,
          isTrending,
          isOutOfStock,
          stock: stock.trim() !== '' ? parseInt(stock) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormMsg(`✓ ${isSemi ? 'Semi Maheshwari' : 'Maheshwari'} Saree added successfully to inventory!`);
        setTitle('');
        setPrice('');
        setOriginalPrice('');
        setDescription('');
        setColor('');
        setBlouseColor('');
        setDesignCode('');
        setImageUrl('');
        setVideoUrl('');
        setUploadedPreview('');
        setImagesList([]);
        setStock('');
        setIsBestSeller(false);
        setIsFeatured(false);
        setIsTrending(false);
        setIsOutOfStock(false);
        fetchData();
        setTimeout(() => {
          setActiveTab(isSemi ? 'semi_products' : 'products');
          setFormMsg('');
        }, 1200);
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
      (categories.find((c) => c.id === p.categoryId || c.slug === p.categoryId)?.slug?.includes('suit')) ||
      (categories.find((c) => c.id === p.categoryId || c.slug === p.categoryId)?.name?.toLowerCase().includes('suit'))
    );
    setEditProductType(isSuit ? 'suit' : 'saree');
    setEditTitle(p.title || '');
    setEditDescription(p.description || '');
    setEditPrice(p.price?.toString() || '');
    setEditOriginalPrice(p.originalPrice?.toString() || '');
    setEditFabric(p.fabric || 'Silk Cotton');
    setEditWeaveType(p.weaveType || 'Garbha Reshami Border');
    setEditBorderType(p.borderType || 'Gold Zari');
    setEditColor(p.color || '');
    setEditBlouseColor(p.blouseColor || '');
    setEditLengthWithBlouse(p.lengthWithBlouse || (isSuit ? 'Top 2.5 Meters, Dupatta 2.5 Meters (2-Piece Set)' : '6.3 Meters (With Blouse Piece)'));
    setEditDesignCode(p.designCode || '');

    const matchingCat = categories.find(
      (c) =>
        c.id === p.categoryId ||
        c.slug === p.categoryId ||
        c.id === p.category?.id ||
        c.slug === p.category?.slug ||
        (p.category?.name && c.name?.trim().toLowerCase() === p.category.name.trim().toLowerCase()) ||
        (p.categoryName && c.name?.trim().toLowerCase() === p.categoryName.trim().toLowerCase())
    );
    setEditCategoryId(matchingCat ? matchingCat.id : (p.categoryId || categories[0]?.id || ''));

    setEditIsOutOfStock(Boolean(p.isOutOfStock));
    setEditStock(p.stock !== undefined && p.stock !== null ? p.stock.toString() : '');
    setEditIsFeatured(p.isFeatured || false);
    setEditIsBestSeller(p.isBestSeller || false);
    setEditIsTrending(p.isTrending || false);
    setEditVideoUrl(p.videoUrl || '');
    
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

    if (!editTitle || !editPrice || !editCategoryId) {
      setEditMsg('Please fill in required fields (Title, Price, Category).');
      return;
    }

    setEditMsg('Saving changes...');

    const effectiveEditOriginalPrice = editOriginalPrice && editOriginalPrice.trim() !== '' ? parseFloat(editOriginalPrice) : parseFloat(editPrice);

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
          originalPrice: effectiveEditOriginalPrice,
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
          videoUrl: editVideoUrl.trim() || null,
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
      let res = await fetch('/api/upload', { method: 'POST', body: formData });
      let data = await res.json();
      if (!data.success) {
        res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'image/jpeg' },
          body: file,
        });
        data = await res.json();
      }
      if (data.success) {
        setCatImage(data.url);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      try {
        const res2 = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'image/jpeg' },
          body: file,
        });
        const data2 = await res2.json();
        if (data2.success) {
          setCatImage(data2.url);
          return;
        }
      } catch (e) {}
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
      let res = await fetch('/api/upload', { method: 'POST', body: formData });
      let data = await res.json();
      if (!data.success) {
        res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'image/jpeg' },
          body: file,
        });
        data = await res.json();
      }
      if (data.success) {
        setEditCatImage(data.url);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      try {
        const res2 = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'image/jpeg' },
          body: file,
        });
        const data2 = await res2.json();
        if (data2.success) {
          setEditCatImage(data2.url);
          return;
        }
      } catch (e) {}
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
      let res = await fetch('/api/upload', { method: 'POST', body: formData });
      let data = await res.json();
      if (!data.success) {
        res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'image/jpeg' },
          body: file,
        });
        data = await res.json();
      }
      if (data.success) {
        setCatBannerImage(data.url);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      try {
        const res2 = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'image/jpeg' },
          body: file,
        });
        const data2 = await res2.json();
        if (data2.success) {
          setCatBannerImage(data2.url);
          return;
        }
      } catch (e) {}
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
      let res = await fetch('/api/upload', { method: 'POST', body: formData });
      let data = await res.json();
      if (!data.success) {
        res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'image/jpeg' },
          body: file,
        });
        data = await res.json();
      }
      if (data.success) {
        setEditCatBannerImage(data.url);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      try {
        const res2 = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'image/jpeg' },
          body: file,
        });
        const data2 = await res2.json();
        if (data2.success) {
          setEditCatBannerImage(data2.url);
          return;
        }
      } catch (e) {}
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

  // Helper to accurately partition Semi Maheshwari vs Authentic Maheshwari Handloom products
  const isSemiMaheshwariProduct = (p: any) => {
    if (!p) return false;
    const catId = p.categoryId || p.category?.id || '';
    const catObj = categories.find((c) => c.id === catId || c.slug === catId);
    const catSlug = (p.category?.slug || catObj?.slug || '').toLowerCase();
    const catName = (p.category?.name || catObj?.name || '').toLowerCase();
    const parentId = catObj?.parentId || '';
    const title = (p.title || '').toLowerCase();
    const fabric = (p.fabric || '').toLowerCase();
    return (
      catSlug.includes('semi-maheshwari') ||
      catName.includes('semi maheshwari') ||
      fabric.includes('semi') ||
      title.includes('semi maheshwari') ||
      title.includes('semi-maheshwari') ||
      catId === 'semi-maheshwari-sarees-id' ||
      parentId === 'semi-maheshwari-sarees-id'
    );
  };

  // Helper to accurately partition Suit / Dress Material vs Saree products
  const isSuitProduct = (p: any) => {
    if (!p) return false;
    const catId = p.categoryId || p.category?.id || '';
    const catObj = categories.find((c) => c.id === catId || c.slug === catId);
    const catSlug = (p.category?.slug || catObj?.slug || '').toLowerCase();
    const catName = (p.category?.name || catObj?.name || '').toLowerCase();
    const parentId = (catObj?.parentId || '').toLowerCase();
    const title = (p.title || '').toLowerCase();
    const lengthWithBlouse = (p.lengthWithBlouse || '').toLowerCase();
    return (
      catSlug.includes('suit') ||
      catName.includes('suit') ||
      parentId.includes('suit') ||
      parentId === 'maheshwari-suits-id' ||
      catId === 'maheshwari-suits-id' ||
      title.includes('suit') ||
      title.includes('dress material') ||
      lengthWithBlouse.includes('top') ||
      lengthWithBlouse.includes('dupatta')
    );
  };

  const maheshwariProducts = products.filter((p) => !isSemiMaheshwariProduct(p));
  const maheshwariSarees = maheshwariProducts.filter((p) => !isSuitProduct(p));
  const maheshwariSuits = maheshwariProducts.filter((p) => isSuitProduct(p));
  const semiMaheshwariProducts = products.filter((p) => isSemiMaheshwariProduct(p));

  // Category partitioning helpers
  const isSuitCategory = (c: any) => {
    if (!c) return false;
    const name = (c.name || '').toLowerCase();
    const slug = (c.slug || '').toLowerCase();
    const parent = categories.find((p) => p.id === c.parentId);
    const parentName = (parent?.name || '').toLowerCase();
    const parentSlug = (parent?.slug || '').toLowerCase();
    return name.includes('suit') || slug.includes('suit') || parentName.includes('suit') || parentSlug.includes('suit') || c.id === 'maheshwari-suits-id' || c.parentId === 'maheshwari-suits-id';
  };

  const isSemiCategory = (c: any) => {
    if (!c) return false;
    const name = (c.name || '').toLowerCase();
    const slug = (c.slug || '').toLowerCase();
    const parent = categories.find((p) => p.id === c.parentId);
    const parentName = (parent?.name || '').toLowerCase();
    const parentSlug = (parent?.slug || '').toLowerCase();
    return name.includes('semi') || slug.includes('semi') || parentName.includes('semi') || parentSlug.includes('semi') || c.id === 'semi-maheshwari-sarees-id' || c.parentId === 'semi-maheshwari-sarees-id';
  };

  const isSareeCategory = (c: any) => {
    return !isSuitCategory(c) && !isSemiCategory(c);
  };

  const getCategoryDisplayName = (catIdOrSlug?: string, productCategory?: any) => {
    if (!catIdOrSlug && !productCategory) return 'General';
    const found = categories.find(
      (c) =>
        c.id === catIdOrSlug ||
        c.slug === catIdOrSlug ||
        c.id === productCategory?.id ||
        c.slug === productCategory?.slug ||
        c.name?.toLowerCase() === catIdOrSlug?.toLowerCase()
    );
    if (found) {
      return found.name;
    }
    if (productCategory?.name) return productCategory.name;
    return catIdOrSlug || 'General';
  };

  // Dynamically extract all unique Border Types
  const defaultBorderTypes = ['Gold Zari', 'Silver Zari', 'Resham Border With Silver Zari', 'Tissue Zari', 'Garbha Reshami Border'];
  const extractedBorderTypes = products.map((p) => p.borderType).filter(Boolean);
  const existingBorderTypes = Array.from(new Set([...defaultBorderTypes, ...extractedBorderTypes]));

  // Authentic Maheshwari Handloom Design Codes
  const defaultMaheshwariDesignCodes = ['Silver Zari', 'Gold Zari', 'MS-SILVER-ZARI', 'MS-GOLD-ZARI', 'MS-GARBHA-RESHAM'];
  const extractedMaheshwariDesignCodes = maheshwariProducts.map((p) => p.designCode).filter(Boolean);
  const existingMaheshwariDesignCodes = Array.from(new Set([...defaultMaheshwariDesignCodes, ...extractedMaheshwariDesignCodes]));

  // Semi Maheshwari Design Codes
  const extractedSemiDesignCodes = semiMaheshwariProducts.map((p) => p.designCode).filter(Boolean);
  const existingSemiDesignCodes = Array.from(new Set([...extractedSemiDesignCodes]));

  const getTabName = (tab: string) => {
    switch (tab) {
      case 'orders': return 'Orders';
      case 'leads': return 'Leads';
      case 'customers': return 'Live Visitors';
      case 'products': return 'Pure Maheshwari Catalog';
      case 'add': return 'Add Pure Maheshwari';
      case 'semi_products': return 'Semi Maheshwari Catalog';
      case 'add_semi': return 'Add Semi Saree';
      case 'categories': return 'Categories';
      case 'push': return 'Push Alerts';
      case 'insta': return 'Instagram Feed';
      case 'blogs': return 'Blogs & Stories';
      default: return 'Dashboard';
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'orders': return 'Customer Orders Management';
      case 'leads': return 'High-Intent Customer Leads';
      case 'customers': return 'Live Visitors & Device Activity Logs';
      case 'products': return 'Pure Maheshwari Handloom Catalog';
      case 'add': return 'Add Pure Maheshwari Saree / Suit';
      case 'semi_products': return 'Semi Maheshwari Sarees Catalog';
      case 'add_semi': return 'Add Semi Maheshwari Saree';
      case 'categories': return 'Category & Subcategory Hierarchy Manager';
      case 'push': return 'Push Notifications Broadcaster';
      case 'insta': return 'Instagram Feed Showcase Manager';
      case 'blogs': return 'Handloom Heritage Stories & Blog Management';
      default: return 'Admin Control Center';
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'orders': return <Package className="w-5 h-5 text-amber-700" />;
      case 'leads': return <Flame className="w-5 h-5 text-rose-600 animate-pulse" />;
      case 'customers': return <Users className="w-5 h-5 text-amber-700" />;
      case 'products': return <Layers className="w-5 h-5 text-amber-700" />;
      case 'add': return <PlusCircle className="w-5 h-5 text-amber-700" />;
      case 'semi_products': return <Sparkles className="w-5 h-5 text-rose-600" />;
      case 'add_semi': return <Sparkles className="w-5 h-5 text-rose-600" />;
      case 'categories': return <FolderPlus className="w-5 h-5 text-amber-700" />;
      case 'push': return <Bell className="w-5 h-5 text-amber-700" />;
      case 'insta': return <Camera className="w-5 h-5 text-rose-600" />;
      case 'blogs': return <BookOpen className="w-5 h-5 text-amber-700" />;
      default: return <LayoutGrid className="w-5 h-5 text-amber-700" />;
    }
  };

  const navigateTo = (tab: any) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
        <div className="flex items-center gap-3 text-xs flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => navigateTo('orders')}
            className="p-2.5 sm:p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-bold flex items-center gap-2 hover:bg-amber-100/70 transition-colors cursor-pointer text-left"
          >
            <IndianRupee className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Total Sales</p>
              <p className="text-sm font-extrabold">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('orders')}
            className="p-2.5 sm:p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 font-bold flex items-center gap-2 hover:bg-rose-100/70 transition-colors cursor-pointer text-left"
          >
            <ShoppingBag className="w-4 h-4 text-rose-700 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Total Orders</p>
              <p className="text-sm font-extrabold">{orders.length}</p>
            </div>
          </button>
          
          <button
            onClick={logout}
            className="p-3 bg-gray-900 text-white rounded-xl hover:bg-black font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Control Hub (Main Dashboard View) */}
      {activeTab === 'hub' && (
        <div className="mt-6 space-y-8 animate-fadeIn">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-amber-950 to-amber-900 text-white rounded-2xl shadow-sm gap-3">
            <div>
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <LayoutGrid className="w-4 h-4" />
                <span>Dashboard Control Modules</span>
              </div>
              <p className="text-sm text-amber-100/90 font-medium mt-0.5">
                Click any module below to open its dedicated workspace
              </p>
            </div>
            <button
              type="button"
              onClick={() => fetchData(true)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Sync Live Data</span>
            </button>
          </div>

          {/* Modern Full-Width Control Center Hub Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Orders */}
            <div
              onClick={() => navigateTo('orders')}
              className="p-5 rounded-2xl border border-amber-200/80 bg-white hover:border-amber-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 group-hover:bg-amber-950 group-hover:text-white transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-950 border border-amber-200">
                  {orders.length} Orders
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-serif font-extrabold text-base text-gray-900 group-hover:text-amber-900">Customer Orders</h4>
                <p className="text-xs text-gray-500 mt-1">Track fulfillments, dispatch & receipts</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-800 group-hover:text-amber-950">
                  <span>Open Orders Module</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 2: Leads */}
            <div
              onClick={() => navigateTo('leads')}
              className="p-5 rounded-2xl border border-rose-200/80 bg-white hover:border-rose-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-900 group-hover:bg-rose-900 group-hover:text-white transition-colors">
                  <Flame className="w-5 h-5 text-rose-600 group-hover:text-rose-200 animate-pulse" />
                </div>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-900 border border-rose-200">
                  {leads.length} Leads
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-serif font-extrabold text-base text-gray-900 group-hover:text-rose-900">High-Intent Leads</h4>
                <p className="text-xs text-gray-500 mt-1">Direct 1-click WhatsApp customer contact</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-rose-800 group-hover:text-rose-950">
                  <span>View Leads & Numbers</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 3: Real-Time Visitors & Admin Breakdown */}
            <div className="p-5 rounded-2xl border border-amber-200/80 bg-white hover:border-amber-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5">
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-950 border border-emerald-300">
                    👤 {customerActs.length} Customers
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-900 border border-slate-300">
                    🛡️ {adminActs.length} Admin
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-serif font-extrabold text-base text-gray-900">Live Visitors</h4>
                <p className="text-xs text-gray-500 mt-1">Real-time IP, device & city analytics</p>
                <div className="grid grid-cols-2 gap-2 mt-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActivityRoleFilter('CUSTOMERS');
                      navigateTo('customers');
                    }}
                    className="py-2 px-2 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-950 text-center transition-all cursor-pointer shadow-xs"
                  >
                    👤 Customer Logs
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActivityRoleFilter('ADMIN');
                      navigateTo('customers');
                    }}
                    className="py-2 px-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-black text-center transition-all cursor-pointer shadow-xs"
                  >
                    🛡️ Admin Logs
                  </button>
                </div>
              </div>
            </div>

            {/* Card 4: Pure Maheshwari Handloom Catalog */}
            <div className="p-5 rounded-2xl border border-amber-200/80 bg-white hover:border-amber-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5">
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                    🥻 {maheshwariSarees.length} Sarees
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-950 border border-rose-200">
                    👗 {maheshwariSuits.length} Suits
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-serif font-extrabold text-base text-gray-900">Pure Maheshwari</h4>
                <p className="text-xs text-gray-500 mt-1">Silk cotton sarees & 3-pc suits</p>
                <div className="grid grid-cols-2 gap-2 mt-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      setHandloomFilter('sarees');
                      navigateTo('products');
                    }}
                    className="py-2 px-2 rounded-xl text-xs font-bold bg-amber-950 text-white hover:bg-black text-center transition-all cursor-pointer shadow-xs"
                  >
                    🥻 Saree Catalog
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHandloomFilter('suits');
                      navigateTo('products');
                    }}
                    className="py-2 px-2 rounded-xl text-xs font-bold bg-rose-900 text-white hover:bg-black text-center transition-all cursor-pointer shadow-xs"
                  >
                    👗 Suit Catalog
                  </button>
                </div>
              </div>
            </div>

            {/* Card 5: Semi Maheshwari Collection */}
            <div className="p-5 rounded-2xl border border-rose-200/80 bg-white hover:border-rose-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5">
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-900">
                  <Sparkles className="w-5 h-5 text-rose-600" />
                </div>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-900 border border-rose-200">
                  {semiMaheshwariProducts.length} Items
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-serif font-extrabold text-base text-gray-900">Semi Maheshwari</h4>
                <p className="text-xs text-gray-500 mt-1">Party-wear zari weave sarees</p>
                <div className="flex items-center gap-2 mt-3.5">
                  <button
                    type="button"
                    onClick={() => navigateTo('semi_products')}
                    className="flex-1 py-2 px-2.5 rounded-xl text-xs font-bold bg-rose-900 text-white hover:bg-black text-center transition-all cursor-pointer shadow-xs"
                  >
                    View Catalog
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFabric('Semi Maheshwari');
                      setWeaveType('Modern Weave Zari Border');
                      setProductType('saree');
                      const semiCat = categories.find(
                        (c) => c.slug === 'semi-maheshwari-sarees' || c.id === 'semi-maheshwari-sarees-id' || isSemiCategory(c)
                      );
                      if (semiCat) setSemiCategoryId(semiCat.id);
                      setFormMsg('');
                      navigateTo('add_semi');
                    }}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-950 border border-rose-300 text-center transition-all cursor-pointer"
                    title="Add new semi saree"
                  >
                    ➕ Add
                  </button>
                </div>
              </div>
            </div>

            {/* Card 6: Category Manager */}
            <div
              onClick={() => navigateTo('categories')}
              className="p-5 rounded-2xl border border-amber-200/80 bg-white hover:border-amber-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 group-hover:bg-amber-950 group-hover:text-white transition-colors">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  {categories.length} Categories
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-serif font-extrabold text-base text-gray-900 group-hover:text-amber-900">Category Manager</h4>
                <p className="text-xs text-gray-500 mt-1">Organize parent & subcategories & banners</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-800 group-hover:text-amber-950">
                  <span>Manage Categories</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 7: Push Alerts */}
            <div
              onClick={() => navigateTo('push')}
              className="p-5 rounded-2xl border border-amber-200/80 bg-white hover:border-amber-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 group-hover:bg-amber-950 group-hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  Broadcast
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-serif font-extrabold text-base text-gray-900 group-hover:text-amber-900">Push Notifications</h4>
                <p className="text-xs text-gray-500 mt-1">Send discount alerts & sale notifications</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-800 group-hover:text-amber-950">
                  <span>Send Broadcaster</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 8: Instagram Feed */}
            <div
              onClick={() => navigateTo('insta')}
              className="p-5 rounded-2xl border border-rose-200/80 bg-white hover:border-rose-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-900 group-hover:bg-rose-900 group-hover:text-white transition-colors">
                  <Camera className="w-5 h-5 text-rose-600 group-hover:text-white" />
                </div>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-900 border border-rose-200">
                  Gallery
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-serif font-extrabold text-base text-gray-900 group-hover:text-rose-900">Instagram Feed</h4>
                <p className="text-xs text-gray-500 mt-1">Sync Instagram reels & posts showcase</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-rose-800 group-hover:text-rose-950">
                  <span>Manage Social Feed</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 9: Handloom Stories & Blogs */}
            <div
              onClick={() => navigateTo('blogs')}
              className="p-5 rounded-2xl border border-amber-200/80 bg-white hover:border-amber-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 group-hover:bg-amber-950 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5 text-amber-800 group-hover:text-white" />
                </div>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-950 border border-amber-200">
                  Stories & Videos
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-serif font-extrabold text-base text-gray-900 group-hover:text-amber-950">Handloom Stories & Blogs</h4>
                <p className="text-xs text-gray-500 mt-1">Add & publish craft articles with photo & video media</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-800 group-hover:text-amber-950">
                  <span>Manage Blogs & Media</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

          </div>

          {/* Quick Snapshot Overview on Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            {/* Recent Leads Preview */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-600 animate-pulse" />
                  <h3 className="font-serif font-extrabold text-base text-amber-950">Recent High-Intent Leads</h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('leads')}
                  className="text-xs font-bold text-rose-800 hover:text-rose-950 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>View All ({leads.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-xs">
                  No leads captured yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {leads.slice(0, 4).map((lead) => (
                    <div key={lead.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{lead.name || 'Valued Buyer'}</span>
                          <span className="font-mono text-gray-700 bg-white px-1.5 py-0.5 rounded border border-rose-200 font-bold text-[11px]">
                            +91 {lead.phone}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{lead.productInterest || 'Collection'} • {lead.city || 'India'}</p>
                      </div>
                      <a
                        href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Namaste ${lead.name || ''}! 🙏\nThank you for visiting Reoti Handloom.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Live Visitors Preview */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-700" />
                  <h3 className="font-serif font-extrabold text-base text-amber-950">Live Visitor Activity</h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('customers')}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>View All Logs ({customerData.activities.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {customerData.activities.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-xs">
                  No visitor activity recorded yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {customerData.activities.slice(0, 4).map((act, i) => (
                    <div key={act.id || i} className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{act.userName || act.userEmail || 'Guest Visitor'}</span>
                          <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950">
                            {act.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{act.details || act.city || 'Browsing Store'}</p>
                      </div>
                      <span className="font-mono text-[10px] text-gray-400">
                        {new Date(act.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Sub-Module Dedicated Workspace (When activeTab is not 'hub') */}
      {activeTab !== 'hub' && (
        <div className="mt-4 mb-6 bg-white border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Left: Prominent Back Button & Title */}
            <div className="flex items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('hub')}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-950 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer group shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300 group-hover:-translate-x-1 transition-transform" />
                <span>← Back to Dashboard Hub</span>
              </button>

              <div className="h-8 w-px bg-gray-200 hidden sm:block" />

              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                  <button
                    onClick={() => navigateTo('hub')}
                    className="hover:text-amber-900 cursor-pointer font-bold"
                  >
                    Control Hub
                  </button>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-amber-900 font-extrabold">{getTabName(activeTab)}</span>
                </div>
                <h2 className="text-base sm:text-xl font-serif font-extrabold text-amber-950 flex items-center gap-2 mt-0.5">
                  {getTabIcon(activeTab)}
                  <span>{getTabTitle(activeTab)}</span>
                </h2>
              </div>
            </div>

            {/* Right: Contextual Shortcuts & Jump Selector */}
            <div className="flex items-center gap-2 flex-wrap sm:justify-end">
              {activeTab === 'products' && (
                <button
                  type="button"
                  onClick={() => {
                    setFabric('Silk Cotton');
                    setProductType('saree');
                    setFormMsg('');
                    navigateTo('add');
                  }}
                  className="px-3.5 py-2 bg-amber-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>➕ Add Pure Maheshwari</span>
                </button>
              )}

              {activeTab === 'add' && (
                <button
                  type="button"
                  onClick={() => navigateTo('products')}
                  className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl border border-amber-300 shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-800" />
                  <span>View Handloom Catalog</span>
                </button>
              )}

              {activeTab === 'semi_products' && (
                <button
                  type="button"
                  onClick={() => {
                    setFabric('Semi Maheshwari');
                    setWeaveType('Modern Weave Zari Border');
                    setProductType('saree');
                    const semiCat = categories.find(
                      (c) => c.slug === 'semi-maheshwari-sarees' || c.id === 'semi-maheshwari-sarees-id' || c.name?.toLowerCase().includes('semi maheshwari')
                    );
                    if (semiCat) setCategoryId(semiCat.id);
                    setFormMsg('');
                    navigateTo('add_semi');
                  }}
                  className="px-3.5 py-2 bg-rose-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                  <span>➕ Add Semi Saree</span>
                </button>
              )}

              {activeTab === 'add_semi' && (
                <button
                  type="button"
                  onClick={() => navigateTo('semi_products')}
                  className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold text-xs rounded-xl border border-rose-300 shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-800" />
                  <span>View Semi Catalog</span>
                </button>
              )}

              {/* Quick Jump Dropdown */}
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1.5 text-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Jump:</span>
                <select
                  value={activeTab}
                  onChange={(e) => navigateTo(e.target.value as any)}
                  className="bg-transparent font-bold text-amber-950 outline-none cursor-pointer text-xs"
                >
                  <option value="orders">📦 Orders ({orders.length})</option>
                  <option value="leads">🔥 Leads ({leads.length})</option>
                  <option value="customers">👥 Live Visitors ({customerData.activities.length})</option>
                  <option value="products">🥻 Pure Maheshwari ({maheshwariProducts.length})</option>
                  <option value="add">➕ Add Pure Maheshwari</option>
                  <option value="semi_products">✨ Semi Maheshwari ({semiMaheshwariProducts.length})</option>
                  <option value="add_semi">➕ Add Semi Saree</option>
                  <option value="categories">📁 Category Manager ({categories.length})</option>
                  <option value="push">🔔 Push Alerts</option>
                  <option value="insta">📷 Instagram Feed</option>
                  <option value="blogs">📖 Handloom Blogs & Stories</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => fetchData(true)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Refresh real-time data"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Sync</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Leads & Enquiries */}
      {activeTab === 'leads' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-rose-900">
                <span className="text-xs font-bold uppercase tracking-wider">Total Leads</span>
                <Flame className="w-5 h-5 text-rose-600" />
              </div>
              <p className="text-2xl font-serif font-extrabold text-rose-950">{leads.length}</p>
              <p className="text-[10px] text-gray-500">Captured Phone Numbers</p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-amber-900">
                <span className="text-xs font-bold uppercase tracking-wider">New Leads</span>
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-serif font-extrabold text-amber-950">
                {leads.filter((l) => l.status === 'NEW').length}
              </p>
              <p className="text-[10px] text-gray-500">Pending Contact</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-blue-900">
                <span className="text-xs font-bold uppercase tracking-wider">Contacted</span>
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-serif font-extrabold text-blue-950">
                {leads.filter((l) => l.status === 'CONTACTED').length}
              </p>
              <p className="text-[10px] text-gray-500">Discussed on WhatsApp/Call</p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-emerald-900">
                <span className="text-xs font-bold uppercase tracking-wider">Converted Orders</span>
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-serif font-extrabold text-emerald-950">
                {leads.filter((l) => l.status === 'CONVERTED').length}
              </p>
              <p className="text-[10px] text-gray-500">Successfully Sold</p>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-[#4A0E17] to-[#780016] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="font-serif font-bold text-sm text-amber-100">
                  Visitor Mobile Numbers & High-Intent Leads ({leads.length})
                </h3>
              </div>
              <span className="text-xs bg-amber-400/20 text-amber-200 font-mono px-3 py-1 rounded-full border border-amber-300/30">
                1-Click WhatsApp Direct Connect
              </span>
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                No customer leads captured yet. As visitors enter their mobile numbers in the welcome offer or checkout, they will appear here instantly!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-50/80 text-amber-950 font-bold border-b border-amber-200">
                    <tr>
                      <th className="p-3">Customer / Name</th>
                      <th className="p-3">Mobile Number</th>
                      <th className="p-3">Location / City</th>
                      <th className="p-3">Product / Saree Interested</th>
                      <th className="p-3">Lead Source</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Instant Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    {leads.map((lead) => {
                      const waMsg = encodeURIComponent(
                        `Namaste ${lead.name || ''}! 🙏\nThank you for visiting *Reoti Handloom Maheshwar*.\nWe noticed your interest in our authentic handcrafted sarees (${lead.productInterest || 'Collection'}).\nWould you like to see a quick WhatsApp Video Call or get exclusive photos?`
                      );
                      const waUrl = `https://wa.me/91${lead.phone.replace(/\D/g, '')}?text=${waMsg}`;
                      const callUrl = `tel:+91${lead.phone.replace(/\D/g, '')}`;

                      return (
                        <tr key={lead.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="p-3 font-bold text-gray-900">{lead.name || 'Valued Buyer'}</td>
                          <td className="p-3">
                            <span className="font-mono font-bold text-base text-gray-900 bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200">
                              +91 {lead.phone}
                            </span>
                          </td>
                          <td className="p-3 text-gray-700">
                            <span className="inline-flex items-center gap-1 font-semibold">
                              <MapPin className="w-3.5 h-3.5 text-rose-600" />
                              {lead.city || 'India'}
                            </span>
                          </td>
                          <td className="p-3 text-gray-800 font-medium max-w-[200px] truncate">
                            {lead.productInterest || 'General Handloom Collection'}
                            {lead.notes && <div className="text-[10px] text-gray-500 font-mono">{lead.notes}</div>}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                lead.source === 'ABANDONED_CHECKOUT'
                                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {lead.source === 'ABANDONED_CHECKOUT' ? '🛒 Checkout Lead' : '🎁 Offer Popup'}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500 font-mono text-[11px]">
                            {new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                          </td>
                          <td className="p-3">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                              className={`text-[11px] font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer ${
                                lead.status === 'NEW'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300 font-extrabold'
                                  : lead.status === 'CONTACTED'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : lead.status === 'CONVERTED'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-gray-50 text-gray-600 border-gray-300'
                              }`}
                            >
                              <option value="NEW">🔴 New Lead</option>
                              <option value="CONTACTED">🔵 Contacted (WhatsApp/Call)</option>
                              <option value="CONVERTED">🟢 Converted / Sold</option>
                              <option value="LOST">⚪ Not Interested</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm transition-all"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                              <a
                                href={callUrl}
                                className="inline-flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-sm transition-all"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

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
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
            {/* 1. Header & Live Indicator */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h3 className="font-serif font-bold text-lg text-amber-950 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span>Real-Time Visitor & User Activity Log</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time tracking of genuine customer traffic, product views, leads, and store operations.
                </p>
              </div>

              {/* Clear Old Logs Action Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Clear test / old activity logs?')) {
                      await fetch('/api/admin/activity?type=ALL', { method: 'DELETE' });
                      fetchData();
                    }
                  }}
                  className="px-3 py-1.5 text-xs text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset / Clear Activity Feed</span>
                </button>
              </div>
            </div>

            {/* 2. Top-Level Role Segregation Tabs (Customers vs Admin vs All) */}
            {(() => {
              const customerVisits = customerActs.filter((a) => a.type === 'VISIT' || a.type === 'VIEW_PRODUCT').length;
              const customerLeads = customerActs.filter((a) => a.type === 'LEAD').length;
              const customerOrders = customerActs.filter((a) => a.type === 'ORDER').length;

              return (
                <div className="space-y-4">
                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-center">
                      <span className="text-[10px] uppercase font-extrabold text-emerald-800 tracking-wider block">
                        👥 Real Customer Visits
                      </span>
                      <span className="text-xl sm:text-2xl font-serif font-black text-emerald-950">
                        {customerVisits}
                      </span>
                    </div>

                    <div className="bg-rose-50/80 border border-rose-200/80 rounded-xl p-3 text-center">
                      <span className="text-[10px] uppercase font-extrabold text-rose-800 tracking-wider block">
                        🔥 Customer Leads
                      </span>
                      <span className="text-xl sm:text-2xl font-serif font-black text-rose-950">
                        {customerLeads}
                      </span>
                    </div>

                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-center">
                      <span className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wider block">
                        🛍️ Customer Orders
                      </span>
                      <span className="text-xl sm:text-2xl font-serif font-black text-amber-950">
                        {customerOrders}
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                      <span className="text-[10px] uppercase font-extrabold text-slate-700 tracking-wider block">
                        🛡️ Admin Operations
                      </span>
                      <span className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                        {adminActs.length}
                      </span>
                    </div>
                  </div>

                  {/* Big Primary Switcher Tabs: Customers / Admin / All */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActivityRoleFilter('CUSTOMERS')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          activityRoleFilter === 'CUSTOMERS'
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-white/60'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Real Customers & Visitors ({customerActs.length})</span>
                      </button>

                      <button
                        onClick={() => setActivityRoleFilter('ADMIN')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          activityRoleFilter === 'ADMIN'
                            ? 'bg-amber-950 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-white/60'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin & Management ({adminActs.length})</span>
                      </button>

                      <button
                        onClick={() => setActivityRoleFilter('ALL')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          activityRoleFilter === 'ALL'
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-white/60'
                        }`}
                      >
                        <span>All ({customerData.activities.length})</span>
                      </button>
                    </div>

                    {/* Secondary Filter Sub-Pills */}
                    <div className="flex flex-wrap gap-1 text-[11px] font-semibold">
                      {(['ALL', 'LEAD', 'VISIT', 'LOGIN', 'REGISTER', 'ORDER'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setActivityFilter(filter)}
                          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                            activityFilter === filter
                              ? 'bg-white text-gray-900 font-extrabold shadow-2xs border border-gray-300'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {filter === 'ALL'
                            ? 'All Types'
                            : filter === 'LEAD'
                            ? '🔥 Leads'
                            : filter === 'VISIT'
                            ? '🌐 Visits'
                            : filter === 'LOGIN'
                            ? '🔐 Logins'
                            : filter === 'REGISTER'
                            ? '👤 Signups'
                            : '🛍️ Orders'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Render Log Feed */}
                  {(() => {
                    let baseList =
                      activityRoleFilter === 'CUSTOMERS'
                        ? customerActs
                        : activityRoleFilter === 'ADMIN'
                        ? adminActs
                        : customerData.activities;

                    if (activityFilter !== 'ALL') {
                      baseList = baseList.filter((a) => a.type === activityFilter);
                    }

                    if (baseList.length === 0) {
                      return (
                        <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 space-y-2">
                          <p className="text-sm font-semibold text-gray-600">
                            No {activityRoleFilter === 'CUSTOMERS' ? 'Customer' : activityRoleFilter === 'ADMIN' ? 'Admin' : ''} activity records found for this filter.
                          </p>
                          <p className="text-xs text-gray-400">
                            New website visits, views, leads, and orders will appear here in real-time.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                        {baseList.map((act) => {
                          const isAdmin = isActAdmin(act);
                          const waText = encodeURIComponent(
                            `🚨 *Reoti Store Activity Alert*\n\n` +
                            `📌 *Event:* ${act.title}\n` +
                            `👤 *User:* ${act.userEmail || act.userPhone || (isAdmin ? 'Admin' : 'Visitor')}\n` +
                            `📍 *Location:* ${act.location || act.city || 'India'}\n` +
                            `📱 *Device:* ${act.device || 'Web'}\n` +
                            `📝 *Details:* ${act.details || 'N/A'}\n` +
                            `🕒 *Time:* ${new Date(act.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
                          );
                          const adminWaUrl = `https://wa.me/919617444445?text=${waText}`;

                          return (
                            <div
                              key={act.id}
                              className={`p-4 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-all ${
                                isAdmin
                                  ? 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/70'
                                  : 'bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50/60'
                              }`}
                            >
                              <div className="space-y-1.5 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Role Indicator Pill */}
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                                      isAdmin
                                        ? 'bg-amber-950 text-amber-200 border border-amber-800'
                                        : 'bg-emerald-700 text-white'
                                    }`}
                                  >
                                    {isAdmin ? <ShieldCheck className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                                    <span>{isAdmin ? 'Admin' : 'Customer'}</span>
                                  </span>

                                  {/* Event Type Badge */}
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                      act.type === 'LEAD'
                                        ? 'bg-rose-600 text-white shadow-xs'
                                        : act.type === 'ORDER'
                                        ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
                                        : act.type === 'LOGIN'
                                        ? 'bg-blue-100 text-blue-800 font-bold'
                                        : act.type === 'REGISTER'
                                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                                        : 'bg-amber-100 text-amber-900 font-semibold'
                                    }`}
                                  >
                                    {act.type}
                                  </span>

                                  {/* Exact Location Pill */}
                                  {(act.location || act.city) && (
                                    <span className="inline-flex items-center gap-1 bg-white text-gray-900 font-bold px-2 py-0.5 rounded text-[10px] border border-gray-300 shadow-2xs">
                                      <MapPin className="w-3 h-3 text-rose-600" />
                                      {act.location || act.city}
                                    </span>
                                  )}

                                  {/* Device Info */}
                                  {act.device && (
                                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded text-[10px]">
                                      {act.device}
                                    </span>
                                  )}

                                  <h4 className="font-bold text-gray-900">{act.title}</h4>
                                </div>

                                {act.details && (
                                  <p className="text-[11px] text-gray-600 font-mono pl-0.5">{act.details}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500 font-mono pt-0.5">
                                  {act.userPhone && (
                                    <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                      📞 +91 {act.userPhone}
                                    </span>
                                  )}
                                  <span>User: {act.userEmail || (act.userPhone ? `Phone: ${act.userPhone}` : (isAdmin ? 'Admin' : 'Anonymous Visitor'))}</span>
                                  <span>•</span>
                                  <span>IP: {act.userIp || '127.0.0.1'}</span>
                                  <span>•</span>
                                  <span>{new Date(act.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                                </div>
                              </div>

                              {/* WhatsApp / Action CTA */}
                              {act.userPhone ? (
                                <a
                                  href={`https://wa.me/91${act.userPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                    `Namaste! Thank you for visiting Reoti Handloom Maheshwar. How may we assist you today?`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  <span>WhatsApp Customer</span>
                                </a>
                              ) : (
                                <a
                                  href={adminWaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="shrink-0 inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>Share Alert</span>
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Tab 1: Orders Dashboard (Amazon / Myntra / Nykaa Style Order Fulfillment & Tracking) */}
      {activeTab === 'orders' && (
        <div className="mt-6 space-y-6">
          {/* Order Action Toast Notice */}
          {orderActionMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-bold text-xs flex items-center justify-between shadow-xs animate-in fade-in">
              <span>{orderActionMsg}</span>
              <button onClick={() => setOrderActionMsg('')} className="text-emerald-700 hover:text-emerald-950 font-black">✕</button>
            </div>
          )}

          {/* Metric Summary Counters */}
          {(() => {
            const totalCount = orders.length;
            const processingCount = orders.filter((o) => (o.status || 'PROCESSING').toUpperCase() === 'PROCESSING').length;
            const confirmedCount = orders.filter((o) => ['CONFIRMED', 'PACKED'].includes((o.status || '').toUpperCase())).length;
            const shippedCount = orders.filter((o) => ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes((o.status || '').toUpperCase())).length;
            const deliveredCount = orders.filter((o) => (o.status || '').toUpperCase() === 'DELIVERED').length;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div
                  onClick={() => setOrderStatusFilter('ALL')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    orderStatusFilter === 'ALL'
                      ? 'bg-amber-950 text-amber-100 border-amber-900 shadow-sm'
                      : 'bg-white border-amber-200/80 text-gray-800 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider">All Orders</span>
                    <Package className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-xl font-serif font-black mt-1">{totalCount}</p>
                  <p className="text-[10px] opacity-75">₹{orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0).toLocaleString()} Value</p>
                </div>

                <div
                  onClick={() => setOrderStatusFilter('PROCESSING')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    orderStatusFilter === 'PROCESSING'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950 hover:bg-amber-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider">🟡 New / Action</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-serif font-black mt-1">{processingCount}</p>
                  <p className="text-[10px] opacity-75">Needs Acceptance</p>
                </div>

                <div
                  onClick={() => setOrderStatusFilter('CONFIRMED')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    orderStatusFilter === 'CONFIRMED'
                      ? 'bg-blue-800 text-white border-blue-900 shadow-sm'
                      : 'bg-blue-50/80 border-blue-200 text-blue-950 hover:bg-blue-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider">🔵 Confirmed</span>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-serif font-black mt-1">{confirmedCount}</p>
                  <p className="text-[10px] opacity-75">Ready to Pack</p>
                </div>

                <div
                  onClick={() => setOrderStatusFilter('SHIPPED')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    orderStatusFilter === 'SHIPPED'
                      ? 'bg-indigo-800 text-white border-indigo-900 shadow-sm'
                      : 'bg-indigo-50/80 border-indigo-200 text-indigo-950 hover:bg-indigo-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider">🚚 Dispatched</span>
                    <Truck className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-serif font-black mt-1">{shippedCount}</p>
                  <p className="text-[10px] opacity-75">In-Transit / Courier</p>
                </div>

                <div
                  onClick={() => setOrderStatusFilter('DELIVERED')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                    orderStatusFilter === 'DELIVERED'
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                      : 'bg-emerald-50/80 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider">🟢 Delivered</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-serif font-black mt-1">{deliveredCount}</p>
                  <p className="text-[10px] opacity-75">Fulfilled Orders</p>
                </div>
              </div>
            );
          })()}

          {/* Search & Filter Bar */}
          <div className="bg-white p-3.5 border border-gray-200 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search by Order #, Customer, Phone or City..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white"
              />
            </div>

            {/* Status Pills Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-bold">
              {(['ALL', 'PROCESSING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    orderStatusFilter === st
                      ? 'bg-amber-950 text-amber-100 shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st === 'ALL'
                    ? 'All'
                    : st === 'PROCESSING'
                    ? '🟡 Placed'
                    : st === 'CONFIRMED'
                    ? '🔵 Confirmed'
                    : st === 'PACKED'
                    ? '📦 Packed'
                    : st === 'SHIPPED'
                    ? '🚚 Dispatched'
                    : st === 'DELIVERED'
                    ? '🟢 Delivered'
                    : '🔴 Cancelled'}
                </button>
              ))}
            </div>
          </div>

          {/* Filtered Orders Listing */}
          {(() => {
            let filtered = [...orders];

            if (orderStatusFilter !== 'ALL') {
              if (orderStatusFilter === 'CONFIRMED') {
                filtered = filtered.filter((o) => ['CONFIRMED', 'PACKED'].includes((o.status || '').toUpperCase()));
              } else if (orderStatusFilter === 'SHIPPED') {
                filtered = filtered.filter((o) => ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes((o.status || '').toUpperCase()));
              } else {
                filtered = filtered.filter((o) => (o.status || 'PROCESSING').toUpperCase() === orderStatusFilter);
              }
            }

            if (orderSearchQuery.trim()) {
              const q = orderSearchQuery.toLowerCase().replace(/^#/, '');
              filtered = filtered.filter(
                (o) =>
                  o.orderNumber?.toLowerCase().includes(q) ||
                  o.id?.toLowerCase().includes(q) ||
                  o.customerName?.toLowerCase().includes(q) ||
                  o.customerPhone?.includes(q) ||
                  o.shippingAddress?.toLowerCase().includes(q)
              );
            }

            if (filtered.length === 0) {
              return (
                <div className="text-center py-16 bg-amber-50/30 border border-dashed border-amber-200 rounded-2xl text-gray-500 text-xs font-semibold space-y-2">
                  <Package className="w-8 h-8 text-amber-800/40 mx-auto" />
                  <p className="text-sm font-bold text-gray-700">No orders match your filter criteria.</p>
                  <p className="text-gray-400">Try changing the status tab or clearing the search query.</p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {filtered.map((order) => {
                  let orderItems: any[] = [];
                  try {
                    orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
                  } catch (e) {}

                  const orderStatus = (order.status || 'PROCESSING').toUpperCase();
                  const waUrl = getCustomerStatusWhatsAppUrl(order, orderStatus);
                  const isProcessing = orderStatus === 'PROCESSING';

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:border-amber-400 transition-all font-sans"
                    >
                      {/* Top Header Strip */}
                      <div className="bg-gradient-to-r from-amber-50 via-rose-50/40 to-amber-50 px-4 py-3 border-b border-amber-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-amber-950 text-white font-bold text-xs">
                            #{order.orderNumber || order.id}
                          </div>
                          <div>
                            <span className="font-mono text-gray-500 text-[11px] block">
                              Placed on {new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="font-extrabold text-gray-900 text-sm">
                              {order.customerName}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Payment status badge */}
                          {(() => {
                            const isCod = (order.paymentMethod || '').toUpperCase().includes('COD') || (order.paymentMethod || '').toUpperCase().includes('CASH') || order.paymentStatus === 'PENDING_COD';
                            const isPaid = order.paymentStatus === 'PAID';
                            return (
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                                isCod
                                  ? isPaid
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-amber-100 text-amber-950 border-amber-400 font-black'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              }`}>
                                {isCod
                                  ? isPaid
                                    ? '💵 COD (Cash Collected ✓)'
                                    : `💵 COD (Collect ₹${Number(order.totalAmount).toLocaleString()})`
                                  : `💳 ONLINE PAID (₹${Number(order.totalAmount).toLocaleString()})`}
                              </span>
                            );
                          })()}

                          {/* Total Amount */}
                          <div className="bg-white px-3 py-1 rounded-xl border border-gray-200 font-extrabold text-rose-800 text-sm shadow-2xs">
                            ₹{Number(order.totalAmount).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Main Card Body */}
                      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        
                        {/* Column 1: Ordered Sarees / Items Breakdown (6 cols) */}
                        <div className="lg:col-span-5 space-y-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                            Ordered Sarees & Handloom Items ({orderItems.length || 1})
                          </span>
                          
                          <div className="space-y-2">
                            {orderItems.length > 0 ? (
                              orderItems.map((item: any, idx: number) => {
                                const title = item.product?.title || item.title || 'Maheshwari Handloom Saree';
                                const img = item.product?.image || item.image || (item.product?.images ? JSON.parse(item.product.images || '[]')[0] : '/uploads/saree_1789221965397_lf0kg.jpeg');
                                const price = item.price || item.product?.price || order.totalAmount;
                                const qty = item.quantity || 1;

                                return (
                                  <div key={idx} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                                      <img src={img} alt={title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-xs">
                                      <h5 className="font-bold text-gray-900 truncate">{title}</h5>
                                      <p className="text-[11px] text-gray-500 mt-0.5">
                                        Qty: <span className="font-bold text-gray-900">{qty}</span> • Price: <span className="font-bold text-rose-800">₹{Number(price).toLocaleString()}</span>
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 font-medium">
                                Handloom Product Item • Total: ₹{Number(order.totalAmount).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Column 2: Customer Delivery Address & Direct Contact (4 cols) */}
                        <div className="lg:col-span-4 space-y-2.5 text-xs bg-amber-50/30 p-3.5 rounded-xl border border-amber-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-600" />
                            <span>Delivery Destination</span>
                          </span>

                          <p className="text-gray-800 font-medium text-[11px] leading-relaxed">
                            {order.shippingAddress || 'Maheshwar, Madhya Pradesh, India'}
                          </p>

                          <div className="pt-2 border-t border-amber-100 flex items-center justify-between gap-2">
                            <div className="font-mono font-bold text-gray-900 text-xs">
                              📞 +91 {order.customerPhone}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`tel:+91${(order.customerPhone || '').replace(/\D/g, '')}`}
                                className="p-1.5 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-700"
                                title="Call Customer"
                              >
                                📞
                              </a>
                              <a
                                href={`https://wa.me/91${(order.customerPhone || '').replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                                title="Chat on WhatsApp"
                              >
                                💬
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Column 3: Status & Tracking Fulfillment Actions (3 cols) */}
                        <div className="lg:col-span-3 space-y-3 text-xs flex flex-col justify-between h-full">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                              Fulfillment Status
                            </span>

                            {/* Status Selector Dropdown */}
                            <select
                              value={orderStatus}
                              disabled={isUpdatingOrder}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`w-full text-xs font-bold rounded-xl p-2 border outline-none cursor-pointer shadow-2xs transition-all ${
                                orderStatus === 'DELIVERED'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : orderStatus === 'SHIPPED' || orderStatus === 'IN_TRANSIT'
                                  ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                                  : orderStatus === 'CONFIRMED' || orderStatus === 'PACKED'
                                  ? 'bg-blue-50 text-blue-900 border-blue-300'
                                  : orderStatus === 'CANCELLED'
                                  ? 'bg-rose-50 text-rose-900 border-rose-300'
                                  : 'bg-amber-50 text-amber-950 border-amber-300'
                              }`}
                            >
                              <option value="PROCESSING">🟡 Placed (New Order)</option>
                              <option value="CONFIRMED">🔵 Confirmed (Accepted)</option>
                              <option value="PACKED">📦 Packed (Ready for Dispatch)</option>
                              <option value="SHIPPED">🚚 Dispatched (In-Transit)</option>
                              <option value="OUT_FOR_DELIVERY">🛵 Out For Delivery</option>
                              <option value="DELIVERED">🟢 Delivered to Customer</option>
                              <option value="CANCELLED">🔴 Cancelled / Out of Stock</option>
                              <option value="RETURNED">↩️ Returned (RTO - Restocked)</option>
                            </select>

                            {/* Tracking Info if Dispatched */}
                            {order.trackingNumber && (
                              <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-gray-700 space-y-0.5">
                                <p><span className="text-gray-500">Courier:</span> <span className="font-bold">{order.courierPartner || 'Delhivery'}</span></p>
                                <p><span className="text-gray-500">AWB:</span> <span className="font-mono font-bold text-amber-900">{order.trackingNumber}</span></p>
                              </div>
                            )}
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="space-y-1.5 pt-2">
                            {/* If COD and not marked PAID yet: Cash Collection Button */}
                            {(() => {
                              const isCod = (order.paymentMethod || '').toUpperCase().includes('COD') || (order.paymentMethod || '').toUpperCase().includes('CASH') || order.paymentStatus === 'PENDING_COD';
                              if (isCod && order.paymentStatus !== 'PAID' && orderStatus !== 'CANCELLED') {
                                return (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateOrderStatus(
                                        order.id,
                                        order.status || 'PROCESSING',
                                        {
                                          paymentStatus: 'PAID',
                                          notes: `${order.notes || ''} [COD Cash Collected: ₹${Number(order.totalAmount).toLocaleString()}]`,
                                        },
                                        false
                                      )
                                    }
                                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                                    title="Mark COD Cash as Collected from Customer"
                                  >
                                    <span>💵 Mark Cash Collected (₹{Number(order.totalAmount).toLocaleString()})</span>
                                  </button>
                                );
                              }
                              return null;
                            })()}

                            {/* If New / Processing: Prominent "Accept Order" button */}
                            {isProcessing && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Accept Order</span>
                              </button>
                            )}

                            {/* Add Tracking & Dispatch Details Modal Trigger (if not cancelled) */}
                            {orderStatus !== 'CANCELLED' && (
                              <button
                                type="button"
                                onClick={() => handleOpenDispatchModal(order)}
                                className="w-full py-1.5 bg-amber-950 hover:bg-black text-amber-100 font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                              >
                                <Truck className="w-3.5 h-3.5 text-amber-300" />
                                <span>{order.trackingNumber ? 'Edit Courier & Tracking' : '🚚 Dispatch & Add Tracking'}</span>
                              </button>
                            )}

                            {/* 1-Click WhatsApp Dynamic Status Notification Link (if not cancelled) */}
                            {orderStatus !== 'CANCELLED' && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                                title="Send real-time status update to customer on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                <span>
                                  {orderStatus === 'CONFIRMED'
                                    ? '📲 Send "Confirmed" Alert'
                                    : orderStatus === 'PACKED'
                                    ? '📲 Send "Packed" Alert'
                                    : orderStatus === 'SHIPPED' || orderStatus === 'IN_TRANSIT'
                                    ? '📲 Send "Dispatched" Alert'
                                    : orderStatus === 'OUT_FOR_DELIVERY'
                                    ? '📲 Send "Out for Delivery" Alert'
                                    : orderStatus === 'DELIVERED'
                                    ? '📲 Send "Delivered" Greeting'
                                    : '📲 Send WhatsApp Update'}
                                </span>
                              </a>
                            )}

                            {/* View / Print Invoice */}
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForInvoice(order)}
                              className="w-full py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                            >
                              <span>📄 View & Print Invoice</span>
                            </button>

                            {/* Cancel Order Action (if not already cancelled) */}
                            {orderStatus !== 'CANCELLED' && (
                              <button
                                type="button"
                                onClick={() => handleOpenCancelModal(order)}
                                className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                                title="Cancel order and immediately notify customer on WhatsApp"
                              >
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>❌ Cancel Order & WhatsApp</span>
                              </button>
                            )}

                            {/* If CANCELLED: Show Reason and Resend WhatsApp button */}
                            {orderStatus === 'CANCELLED' && (
                              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 text-[11px] text-rose-950">
                                <div className="flex items-center gap-1 font-extrabold text-rose-900">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                  <span>Order Cancelled</span>
                                </div>
                                {order.cancellationReason && (
                                  <p className="text-[10px] text-rose-700">
                                    <span className="font-semibold">Reason:</span> {order.cancellationReason}
                                  </p>
                                )}
                                <a
                                  href={getCustomerStatusWhatsAppUrl(order, 'CANCELLED')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-1 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer text-[10px] mt-1 shadow-2xs"
                                  title="Send or resend cancellation message to customer"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>📲 Resend WhatsApp Notice</span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Tab: Maheshwari Saree & Suit Handloom Catalog List */}
      {activeTab === 'products' && (
        <div className="mt-6 space-y-5">
          {/* Header & Separate Sub-Tab Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <h3 className="font-serif font-bold text-amber-950 text-xl flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-800" />
                <span>
                  {handloomFilter === 'sarees' && `Maheshwari Sarees Catalog (${maheshwariSarees.length})`}
                  {handloomFilter === 'suits' && `Maheshwari Suits Catalog (${maheshwariSuits.length})`}
                  {handloomFilter === 'all' && `All Handloom Inventory (${maheshwariProducts.length})`}
                </span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {handloomFilter === 'sarees' && 'Authentic handcrafted pure Maheshwari sarees.'}
                {handloomFilter === 'suits' && 'Handcrafted pure Maheshwari unstitched suit sets & dress materials.'}
                {handloomFilter === 'all' && 'View all pure handloom sarees and suits.'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter Tabs: Sarees vs Suits vs All */}
              <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200">
                <button
                  type="button"
                  onClick={() => setHandloomFilter('sarees')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    handloomFilter === 'sarees'
                      ? 'bg-amber-950 text-white shadow-xs'
                      : 'text-amber-900 hover:bg-amber-100/70'
                  }`}
                >
                  <span>🥻 Sarees ({maheshwariSarees.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHandloomFilter('suits')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    handloomFilter === 'suits'
                      ? 'bg-rose-900 text-white shadow-xs'
                      : 'text-amber-900 hover:bg-rose-50'
                  }`}
                >
                  <span>👗 Suits ({maheshwariSuits.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHandloomFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    handloomFilter === 'all'
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-200/60'
                  }`}
                >
                  <span>All ({maheshwariProducts.length})</span>
                </button>
              </div>

              {/* Contextual Add Buttons */}
              <button
                onClick={() => {
                  setActiveTab('add');
                  setProductType(handloomFilter === 'suits' ? 'suit' : 'saree');
                  setFabric('Silk Cotton');
                  setFormMsg('');
                }}
                className={`px-3.5 py-2 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors ${
                  handloomFilter === 'suits' ? 'bg-rose-900 hover:bg-black' : 'bg-amber-950 hover:bg-black'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>{handloomFilter === 'suits' ? '➕ Add New Suit' : '➕ Add New Saree'}</span>
              </button>
            </div>
          </div>

          {/* Filtered Product Listing Grid */}
          {(() => {
            const displayed = handloomFilter === 'sarees'
              ? maheshwariSarees
              : handloomFilter === 'suits'
              ? maheshwariSuits
              : maheshwariProducts;

            if (displayed.length === 0) {
              return (
                <div className="text-center py-16 bg-amber-50/40 border border-amber-200 rounded-2xl text-gray-500 text-xs font-semibold space-y-3">
                  <p>
                    No {handloomFilter === 'suits' ? 'Maheshwari Suits' : 'Maheshwari Sarees'} found in this catalog view.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('add');
                      setProductType(handloomFilter === 'suits' ? 'suit' : 'saree');
                      setFabric('Silk Cotton');
                      setFormMsg('');
                    }}
                    className="px-4 py-2 bg-amber-950 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-300" />
                    <span>Add {handloomFilter === 'suits' ? 'Suit' : 'Saree'} Now</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayed.map((p) => {
                  const imgs = JSON.parse(p.images || '[]');
                  const isSuit = isSuitProduct(p);
                  return (
                    <div
                      key={p.id}
                      className="p-3.5 border border-slate-200 rounded-2xl flex gap-3.5 bg-white shadow-xs hover:border-amber-400 transition-all relative group"
                    >
                      <div className="relative w-24 h-32 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
                        <img
                          src={imgs[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                        <WatermarkOverlay variant="card" className="scale-75" />
                        {/* Type indicator pill */}
                        <span
                          className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            isSuit ? 'bg-rose-900 text-white' : 'bg-amber-950 text-amber-100'
                          }`}
                        >
                          {isSuit ? '👗 SUIT' : '🥻 SAREE'}
                        </span>
                      </div>
                      <div className="flex-1 text-xs space-y-1.5 flex flex-col justify-between min-w-0">
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
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded inline-flex items-center gap-1">
                              📁 {getCategoryDisplayName(p.categoryId, p.category)}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 truncate mt-1">
                            {p.fabric} • Border: {p.borderType || 'Zari'} • Color: {p.color || 'Multi'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-extrabold text-rose-700 text-sm">₹{p.price.toLocaleString()}</span>
                            {p.originalPrice && p.originalPrice > p.price && (
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
                            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 text-amber-800" />
                            <span>Edit {isSuit ? 'Suit' : 'Saree'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
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
            );
          })()}
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
                    setLengthWithBlouse('Top 2.5 Meters, Dupatta 2.5 Meters (2-Piece Set)');
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
                  className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-amber-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                  <span>Original MRP (₹)</span>
                  <span className="text-[10px] text-gray-400 font-normal">Optional (if on Sale)</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 7999 (Leave blank if regular)"
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

                {/* Dynamic Color Field - Manual Input with Placeholder */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    <span>{productType === 'suit' ? 'Suit Color' : 'Saree Color'}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={`Type ${productType === 'suit' ? 'Suit' : 'Saree'} Color (e.g. Crimson Red / Mustard Yellow / Rani Pink)`}
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Dynamic Blouse / Dupatta Color Field - Manual Input with Placeholder */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    <span>{productType === 'suit' ? 'Dupatta Color' : 'Blouse Color'}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={`Type ${productType === 'suit' ? 'Dupatta' : 'Blouse'} Color (e.g. Running Match / Contrast Golden / Wine)`}
                    value={blouseColor}
                    onChange={(e) => setBlouseColor(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Dynamic Length / Dimensions Field - Manual Input with Default/Placeholder */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    <span>{productType === 'suit' ? 'Suit Dimensions / Length' : 'Length / Blouse'}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={productType === 'suit' ? 'e.g. Top 2.5 Meters, Dupatta 2.5 Meters (2-Piece Set)' : 'e.g. 6.3 Meters (With Blouse Piece)'}
                    value={lengthWithBlouse}
                    onChange={(e) => setLengthWithBlouse(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-1 flex items-center justify-between">
                    <span>Design Code (Color Group)</span>
                    <span className="text-[10px] text-amber-800 font-normal">Select or type custom</span>
                  </label>
                  <select
                    value={existingMaheshwariDesignCodes.includes(designCode) ? designCode : 'CUSTOM'}
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
                    {existingMaheshwariDesignCodes.map((dc) => (
                      <option key={dc} value={dc}>
                        {dc}
                      </option>
                    ))}
                    <option value="CUSTOM">➕ Type New Design Code...</option>
                  </select>

                  {(!existingMaheshwariDesignCodes.includes(designCode) || designCode === '') && (
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-gray-700 font-bold">
                      {productType === 'suit' ? 'Suit Category *' : 'Saree Category *'}
                    </label>
                    {(() => {
                      const activeCat = categories.find((c) => c.id === categoryId || c.slug === categoryId);
                      if (activeCat) {
                        return (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                            Selected: 📁 {activeCat.name}
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium"
                  >
                    {productType === 'suit' ? (
                      // Suits Categories Only
                      <>
                        {categories
                          .filter(
                            (c) =>
                              (c.isParent || !c.parentId) &&
                              (c.slug?.includes('suit') || c.name?.toLowerCase().includes('suit') || c.slug?.includes('unstitched'))
                          )
                          .map((parent) => {
                            const children = categories.filter((c) => c.parentId === parent.id);
                            return (
                              <optgroup key={parent.id} label={`📁 PARENT: ${parent.name}`}>
                                <option value={parent.id}>
                                  📁 {parent.name} (Parent Suit Category)
                                </option>
                                {children.map((child) => (
                                  <option key={child.id} value={child.id}>
                                    &nbsp;&nbsp;↳ {child.name} (Suit Sub-Category)
                                  </option>
                                ))}
                              </optgroup>
                            );
                          })}
                        {categories
                          .filter(
                            (c) =>
                              (c.slug?.includes('suit') || c.name?.toLowerCase().includes('suit') || c.slug?.includes('unstitched')) &&
                              !categories.some((p) => (p.isParent || !p.parentId) && (p.slug?.includes('suit') || p.name?.toLowerCase().includes('suit')))
                          )
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              📁 {c.name}
                            </option>
                          ))}
                      </>
                    ) : (
                      // Sarees Categories Only (Excludes Suits and Semi)
                      <>
                        {categories
                          .filter(
                            (c) =>
                              (c.isParent || !c.parentId) &&
                              !c.slug?.includes('suit') &&
                              !c.name?.toLowerCase().includes('suit') &&
                              !c.slug?.includes('semi-maheshwari') &&
                              !c.name?.toLowerCase().includes('semi maheshwari') &&
                              c.id !== 'semi-maheshwari-sarees-id'
                          )
                          .map((parent) => {
                            const children = categories.filter(
                              (c) =>
                                c.parentId === parent.id &&
                                !c.slug?.includes('suit') &&
                                !c.name?.toLowerCase().includes('suit') &&
                                !c.slug?.includes('semi-maheshwari') &&
                                !c.name?.toLowerCase().includes('semi maheshwari')
                            );
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
                        {categories
                          .filter(
                            (c) =>
                              !c.isParent &&
                              c.parentId &&
                              !c.slug?.includes('suit') &&
                              !c.name?.toLowerCase().includes('suit') &&
                              !c.slug?.includes('semi-maheshwari') &&
                              !c.name?.toLowerCase().includes('semi maheshwari') &&
                              !categories.some((p) => p.id === c.parentId)
                          )
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              ↳ {c.name}
                            </option>
                          ))}
                      </>
                    )}
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

            {/* Product Video Upload / URL (Draping & Craftsmanship Video) */}
            <div className="space-y-3 p-4 bg-amber-50/50 border border-amber-200/90 rounded-2xl shadow-2xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-amber-200/60 pb-2">
                <div>
                  <label className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <Video className="w-4 h-4 text-amber-800" />
                    <span>Product Video / Reel (Optional)</span>
                  </label>
                  <p className="text-[11px] text-amber-900/80 font-medium mt-0.5">
                    🎬 Upload an MP4 video or paste video URL for live saree draping demonstration.
                  </p>
                </div>
                {isVideoUploading && (
                  <span className="text-amber-800 animate-pulse text-xs font-bold shrink-0">
                    Uploading video...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Upload Video File (MP4/WebM)
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e, false)}
                    className="block w-full text-xs text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-extrabold file:bg-amber-900 file:text-white hover:file:bg-black cursor-pointer bg-white p-1 rounded-xl border border-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Or Direct Video URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://... or /uploads/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full border border-amber-300 bg-white rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              {videoUrl && (
                <div className="mt-2 p-2.5 bg-white rounded-xl border border-amber-300 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-black overflow-hidden relative shrink-0">
                      <video src={videoUrl} className="w-full h-full object-cover" muted playsInline />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-amber-950 truncate">{videoUrl}</p>
                      <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Video Ready & Attached</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVideoUrl('')}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
                    title="Remove Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

      {/* Tab: Semi Maheshwari Saree Catalog List */}
      {activeTab === 'semi_products' && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/70 border border-rose-200 p-4 rounded-xl">
            <div>
              <h3 className="font-serif font-bold text-rose-950 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-600" />
                <span>Semi Maheshwari Inventory ({semiMaheshwariProducts.length} Items)</span>
              </h3>
              <p className="text-[11px] text-rose-800/90 font-medium mt-1">
                🔒 <strong>Note:</strong> Yeh sarees Homepage par show nahi hoti hain aur sirf direct collection page (<code className="bg-rose-100 px-1 py-0.5 rounded font-mono text-[10px]">/products?category=semi-maheshwari-sarees</code>) par dikhai dengi.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('add_semi');
                setFabric('Semi Maheshwari');
                setWeaveType('Modern Weave Zari Border');
                setProductType('saree');
                const semiCat = categories.find(
                  (c) => c.slug === 'semi-maheshwari-sarees' || c.id === 'semi-maheshwari-sarees-id' || c.name?.toLowerCase().includes('semi maheshwari')
                );
                if (semiCat) setCategoryId(semiCat.id);
                setFormMsg('');
              }}
              className="px-4 py-2.5 bg-rose-900 text-white text-xs font-bold rounded-lg hover:bg-rose-950 flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-rose-300" />
              <span>Add New Semi Saree</span>
            </button>
          </div>

          {/* Sub-category Filter Tabs */}
          {(() => {
            const semiSubs = categories.filter(
              (c) =>
                c.parentId === 'semi-maheshwari-sarees-id' ||
                (isSemiCategory(c) && !c.isParent && c.id !== 'semi-maheshwari-sarees-id')
            );

            return (
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                <button
                  onClick={() => setSemiSubcategoryFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    semiSubcategoryFilter === 'ALL'
                      ? 'bg-rose-900 text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-rose-50'
                  }`}
                >
                  All Semi ({semiMaheshwariProducts.length})
                </button>
                {semiSubs.map((sub) => {
                  const count = semiMaheshwariProducts.filter(
                    (p) =>
                      p.categoryId === sub.id ||
                      p.categoryId === sub.slug ||
                      p.category?.id === sub.id ||
                      p.category?.slug === sub.slug
                  ).length;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSemiSubcategoryFilter(sub.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        semiSubcategoryFilter === sub.id
                          ? 'bg-rose-900 text-white shadow-xs'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-rose-50'
                      }`}
                    >
                      {sub.name} ({count})
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {semiMaheshwariProducts.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl text-gray-500 text-xs font-semibold space-y-3">
              <p>Abhi tak koi Semi Maheshwari Saree inventory me add nahi ki gayi hai.</p>
              <button
                onClick={() => {
                  setActiveTab('add_semi');
                  setFabric('Semi Maheshwari');
                  setWeaveType('Modern Weave Zari Border');
                  setProductType('saree');
                  const semiCat = categories.find(
                    (c) => c.slug === 'semi-maheshwari-sarees' || c.id === 'semi-maheshwari-sarees-id' || c.name?.toLowerCase().includes('semi maheshwari')
                  );
                  if (semiCat) setCategoryId(semiCat.id);
                  setFormMsg('');
                }}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-lg font-bold text-xs cursor-pointer shadow-sm"
              >
                + Pehli Semi Maheshwari Saree Add Karein
              </button>
            </div>
          ) : (
            (() => {
              const displayedSemiProducts =
                semiSubcategoryFilter === 'ALL'
                  ? semiMaheshwariProducts
                  : semiMaheshwariProducts.filter(
                      (p) =>
                        p.categoryId === semiSubcategoryFilter ||
                        p.categoryId === categories.find((c) => c.id === semiSubcategoryFilter)?.slug ||
                        p.category?.id === semiSubcategoryFilter ||
                        p.category?.slug === categories.find((c) => c.id === semiSubcategoryFilter)?.slug
                    );

              if (displayedSemiProducts.length === 0) {
                return (
                  <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl text-gray-500 text-xs font-semibold space-y-3">
                    <p>Is subcategory me koi Semi Maheshwari Saree nahi mili.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedSemiProducts.map((p) => {
                    const imgs = JSON.parse(p.images || '[]');
                    return (
                      <div key={p.id} className="p-3.5 border border-rose-200/80 rounded-xl flex gap-3.5 bg-white shadow-xs hover:border-rose-400 transition-all relative group">
                        <div className="relative w-20 h-28 shrink-0 overflow-hidden rounded-lg bg-rose-50 border border-rose-100">
                          <img
                            src={imgs[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                          <WatermarkOverlay variant="card" className="scale-75" />
                        </div>
                        <div className="flex-1 text-xs space-y-1.5 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{p.title}</h4>
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-200 px-2 py-0.5 rounded inline-flex items-center gap-1">
                                📁 {getCategoryDisplayName(p.categoryId, p.category)}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1 truncate">
                              Border: {p.borderType || 'Zari'} • Color: {p.color}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-extrabold text-rose-700 text-sm">₹{p.price.toLocaleString()}</span>
                              {p.originalPrice && p.originalPrice > p.price && (
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
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5 text-rose-800" />
                              <span>Edit Saree</span>
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(p.id, p.title)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
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
              );
            })()
          )}
        </div>
      )}

      {/* Tab: Add Semi Maheshwari Saree Form */}
      {activeTab === 'add_semi' && (
        <div className="mt-6 max-w-2xl bg-white border border-rose-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-rose-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-100 text-rose-900 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  SEMI MAHESHWARI INVENTORY
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-rose-950 mt-1">
                Add New Semi Maheshwari Saree Details
              </h3>
              <p className="text-[11px] text-gray-500">
                Quickly add lightweight Semi Maheshwari Sarees. These sarees will be kept separate from Handloom Sarees and won't appear on the Homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('semi_products')}
              className="text-xs font-bold text-rose-800 hover:text-rose-950 underline self-start sm:self-auto cursor-pointer"
            >
              ← View Semi Catalog ({semiMaheshwariProducts.length})
            </button>
          </div>

          <form onSubmit={(e) => handleAddProduct(e, true)} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Semi Maheshwari Saree Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Crimson Red Semi Maheshwari Zari Saree"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-rose-800 text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1499"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-rose-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                  <span>Original MRP (₹)</span>
                  <span className="text-[10px] text-gray-400 font-normal">Optional (if on Sale)</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2999 (Leave blank if regular)"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-rose-800 text-xs"
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
                  placeholder="e.g. 5 (Leave blank if unmanaged)"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-rose-800 text-xs"
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
                    ★ Mark as BESTSELLER Semi Saree
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
                    🔥 Mark as TRENDING
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
            <div className="p-3.5 bg-rose-50/40 border border-rose-200 rounded-xl space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Fabric Type</label>
                  <select
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-rose-800"
                  >
                    <option value="Semi Maheshwari">Semi Maheshwari</option>
                    <option value="Semi Maheshwari Silk">Semi Maheshwari Silk</option>
                    <option value="Semi Maheshwari Cotton">Semi Maheshwari Cotton</option>
                    <option value="Semi Silk">Semi Silk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                    <span>Border Type</span>
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
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-rose-800"
                  >
                    <option value="Gold Zari">Gold Zari</option>
                    <option value="Silver Zari">Silver Zari</option>
                    <option value="Resham Border With Silver Zari">Resham Border With Silver Zari</option>
                    <option value="Tissue Zari">Tissue Zari</option>
                    {existingBorderTypes.filter(bt => !['Gold Zari', 'Silver Zari', 'Resham Border With Silver Zari', 'Tissue Zari'].includes(bt)).map((bt) => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                    <option value="CUSTOM">➕ Type New Border Type...</option>
                  </select>

                  {(!existingBorderTypes.includes(borderType) || borderType === '') && (
                    <input
                      type="text"
                      placeholder="Type custom border (e.g. Zari Border)"
                      value={borderType}
                      onChange={(e) => setBorderType(e.target.value)}
                      className="w-full border border-rose-300 bg-rose-50/50 rounded p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-rose-800"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    <span>Saree Color</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Red / Rani Pink / Mustard"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-rose-800 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    <span>Blouse Color</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Running Match / Contrast Golden"
                    value={blouseColor}
                    onChange={(e) => setBlouseColor(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-rose-800 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    <span>Length / Blouse</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6.3 Meters (With Blouse Piece)"
                    value={lengthWithBlouse}
                    onChange={(e) => setLengthWithBlouse(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium focus:ring-1 focus:ring-rose-800 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-rose-950 font-bold mb-1 flex items-center justify-between">
                    <span>Design Code (Color Group)</span>
                    <span className="text-[10px] text-rose-800 font-normal">Select or type custom</span>
                  </label>
                  <select
                    value={existingSemiDesignCodes.includes(designCode) ? designCode : 'CUSTOM'}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setDesignCode('');
                      } else {
                        setDesignCode(e.target.value);
                      }
                    }}
                    className="w-full border border-rose-300 bg-rose-50/30 rounded p-2 text-xs font-semibold text-rose-950 focus:ring-1 focus:ring-rose-800"
                  >
                    <option value="">-- Select Existing Semi Design Code --</option>
                    {existingSemiDesignCodes.map((dc) => (
                      <option key={dc} value={dc}>
                        {dc}
                      </option>
                    ))}
                    <option value="CUSTOM">➕ Type New Design Code...</option>
                  </select>

                  {(!existingSemiDesignCodes.includes(designCode) || designCode === '') && (
                    <input
                      type="text"
                      placeholder="Type new Design Code (e.g. Rose Semi Maheshwari)"
                      value={designCode}
                      onChange={(e) => setDesignCode(e.target.value)}
                      className="w-full border border-rose-400 bg-rose-50/50 rounded p-2 text-xs font-semibold mt-1.5 focus:ring-1 focus:ring-rose-800 text-rose-950 placeholder:font-normal"
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-gray-700 font-bold">
                      <span>Category / Sub-Category *</span>
                    </label>
                    {(() => {
                      const activeCat = categories.find((c) => c.id === semiCategoryId || c.slug === semiCategoryId);
                      if (activeCat) {
                        return (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded-full">
                            Selected: 📁 {activeCat.name}
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  {(() => {
                    const semiParents = categories.filter(
                      (c) => (c.isParent || !c.parentId || c.id === 'semi-maheshwari-sarees-id') && isSemiCategory(c)
                    );
                    const semiParentIds = new Set(semiParents.map((p) => p.id));
                    semiParentIds.add('semi-maheshwari-sarees-id');

                    const semiChildren = categories.filter(
                      (c) => (c.parentId && semiParentIds.has(c.parentId)) || (!c.isParent && isSemiCategory(c) && !semiParentIds.has(c.id))
                    );

                    return (
                      <select
                        value={semiCategoryId || semiParents[0]?.id || 'semi-maheshwari-sarees-id'}
                        onChange={(e) => setSemiCategoryId(e.target.value)}
                        className="w-full border border-rose-300 rounded p-2 text-xs bg-white font-bold text-rose-950 focus:ring-1 focus:ring-rose-800"
                      >
                        {semiParents.map((parent) => {
                          const children = categories.filter((c) => c.parentId === parent.id);
                          return (
                            <optgroup key={parent.id} label={`✨ PARENT: ${parent.name}`}>
                              <option value={parent.id}>
                                📁 {parent.name} (Parent Category)
                              </option>
                              {children.map((child) => (
                                <option key={child.id} value={child.id}>
                                  &nbsp;&nbsp;↳ {child.name} (Sub-Category)
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}
                        {semiChildren
                          .filter((child) => !semiParents.some((p) => categories.some((c) => c.parentId === p.id && c.id === child.id)))
                          .map((child) => (
                            <option key={child.id} value={child.id}>
                              ↳ {child.name} (Sub-Category)
                            </option>
                          ))}
                      </select>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Multiple Image Upload & Primary Cover Photo Selection Box */}
            <div className="space-y-3 p-4 bg-rose-50/40 border border-rose-200 rounded-2xl shadow-2xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-rose-200/60 pb-2">
                <div>
                  <label className="font-extrabold text-xs text-rose-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <Upload className="w-4 h-4 text-rose-800" />
                    <span>Upload Semi Maheshwari Saree Photos ({imagesList.length} Photos Added)</span>
                  </label>
                  <p className="text-[11px] text-rose-900/80 font-medium mt-0.5">
                    📸 Upload 1 or multiple photos. Reoti Handloom watermark will be applied automatically!
                  </p>
                </div>
                {isUploading && (
                  <span className="text-rose-800 animate-pulse text-xs font-bold shrink-0">
                    Uploading photos...
                  </span>
                )}
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultipleImageUpload}
                className="block w-full text-xs text-gray-700 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-extrabold file:bg-rose-900 file:text-white hover:file:bg-black cursor-pointer bg-white p-1 rounded-xl border border-rose-300"
              />

              {/* Gallery Thumbnails List */}
              {imagesList.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-bold text-gray-700 block uppercase tracking-wider">
                    Product Photos Gallery:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {imagesList.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`group relative bg-white border-2 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between p-1.5 transition-all ${
                          idx === 0
                            ? 'border-rose-600 ring-2 ring-rose-400/50 bg-rose-50/30'
                            : 'border-gray-200 hover:border-rose-400'
                        }`}
                      >
                        <div className="relative aspect-4/5 w-full rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <WatermarkOverlay />

                          {idx === 0 ? (
                            <span className="absolute top-1 left-1 bg-rose-900 text-rose-50 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow flex items-center gap-1 uppercase tracking-wider z-10">
                              ⭐ Primary Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="absolute top-1 left-1 bg-black/75 hover:bg-rose-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-90 hover:opacity-100 transition-all cursor-pointer z-10"
                            >
                              ★ Set as Cover
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow transition-all cursor-pointer z-10"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500 font-bold px-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, 'left')}
                            className="px-1.5 py-0.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            ←
                          </button>
                          <span>Photo #{idx + 1}</span>
                          <button
                            type="button"
                            disabled={idx === imagesList.length - 1}
                            onClick={() => handleMoveImage(idx, 'right')}
                            className="px-1.5 py-0.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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

            {/* Product Video Upload / URL (Semi Saree Draping Video) */}
            <div className="space-y-3 p-4 bg-rose-50/50 border border-rose-200/90 rounded-2xl shadow-2xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-rose-200/60 pb-2">
                <div>
                  <label className="font-extrabold text-xs text-rose-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <Video className="w-4 h-4 text-rose-800" />
                    <span>Semi Saree Video / Reel (Optional)</span>
                  </label>
                  <p className="text-[11px] text-rose-900/80 font-medium mt-0.5">
                    🎬 Upload an MP4 video or paste video URL for live saree demonstration.
                  </p>
                </div>
                {isVideoUploading && (
                  <span className="text-rose-800 animate-pulse text-xs font-bold shrink-0">
                    Uploading video...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Upload Video File (MP4/WebM)
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e, false)}
                    className="block w-full text-xs text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-extrabold file:bg-rose-900 file:text-white hover:file:bg-black cursor-pointer bg-white p-1 rounded-xl border border-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Or Direct Video URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://... or /uploads/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full border border-rose-300 bg-white rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-rose-800"
                  />
                </div>
              </div>

              {videoUrl && (
                <div className="mt-2 p-2.5 bg-white rounded-xl border border-rose-300 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-black overflow-hidden relative shrink-0">
                      <video src={videoUrl} className="w-full h-full object-cover" muted playsInline />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-rose-950 truncate">{videoUrl}</p>
                      <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Video Ready & Attached</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVideoUrl('')}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
                    title="Remove Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-rose-950 font-bold mb-1 flex items-center justify-between">
                <span>Description & Product Details</span>
              </label>
              <textarea
                rows={4}
                placeholder="Enter Semi Maheshwari Saree description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-rose-300 bg-rose-50/20 rounded p-2.5 text-xs font-medium focus:ring-1 focus:ring-rose-800"
              />
            </div>

            {formMsg && (
              <p className={`text-xs font-bold ${formMsg.startsWith('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                {formMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-rose-900 hover:bg-rose-950 text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              SAVE SEMI MAHESHWARI SAREE TO INVENTORY
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
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
                      <span>Original MRP (₹)</span>
                      <span className="text-[10px] text-gray-400 font-normal">Optional (if on Sale)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Leave blank or equal to price if regular"
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

                    {/* Dynamic Edit Color Field - Manual Input with Placeholder */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        <span>{editProductType === 'suit' ? 'Suit Color' : 'Saree Color'}</span>
                      </label>
                      <input
                        type="text"
                        placeholder={`Type ${editProductType === 'suit' ? 'Suit' : 'Saree'} Color (e.g. Crimson Red / Mustard Yellow / Rani Pink)`}
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800 text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    {/* Dynamic Edit Blouse / Dupatta Color Field - Manual Input with Placeholder */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        <span>{editProductType === 'suit' ? 'Dupatta Color' : 'Blouse Color'}</span>
                      </label>
                      <input
                        type="text"
                        placeholder={`Type ${editProductType === 'suit' ? 'Dupatta' : 'Blouse'} Color (e.g. Running Match / Contrast Golden / Wine)`}
                        value={editBlouseColor}
                        onChange={(e) => setEditBlouseColor(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800 text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    {/* Dynamic Edit Length / Dimensions Field - Manual Input with Default/Placeholder */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        <span>{editProductType === 'suit' ? 'Suit Dimensions / Length' : 'Length / Blouse'}</span>
                      </label>
                      <input
                        type="text"
                        placeholder={editProductType === 'suit' ? 'e.g. Top 2.5 Meters, Dupatta 2.5 Meters (2-Piece Set)' : 'e.g. 6.3 Meters (With Blouse Piece)'}
                        value={editLengthWithBlouse}
                        onChange={(e) => setEditLengthWithBlouse(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium focus:ring-1 focus:ring-amber-800 text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    {(() => {
                      const currentEditCat = categories.find((c) => c.id === editCategoryId || c.slug === editCategoryId);
                      const isSemiEdit = Boolean(
                        (editingProduct && isSemiMaheshwariProduct(editingProduct)) ||
                        activeTab === 'semi_products' ||
                        activeTab === 'add_semi' ||
                        currentEditCat?.slug?.includes('semi-maheshwari') ||
                        currentEditCat?.name?.toLowerCase().includes('semi maheshwari') ||
                        currentEditCat?.parentId === 'semi-maheshwari-sarees-id' ||
                        editFabric?.toLowerCase().includes('semi') ||
                        editTitle?.toLowerCase().includes('semi maheshwari')
                      );
                      const relevantDesignCodes = isSemiEdit ? existingSemiDesignCodes : existingMaheshwariDesignCodes;

                      return (
                        <div>
                          <label className={`block font-bold mb-1 flex items-center justify-between ${isSemiEdit ? 'text-rose-950' : 'text-amber-900'}`}>
                            <span>Design Code (Color Group)</span>
                            <span className={`text-[10px] font-normal ${isSemiEdit ? 'text-rose-800' : 'text-amber-800'}`}>Select or type custom</span>
                          </label>
                          <select
                            value={relevantDesignCodes.includes(editDesignCode) ? editDesignCode : 'CUSTOM'}
                            onChange={(e) => {
                              if (e.target.value === 'CUSTOM') {
                                setEditDesignCode('');
                              } else {
                                setEditDesignCode(e.target.value);
                              }
                            }}
                            className={`w-full border rounded-lg p-2.5 text-xs font-semibold focus:ring-1 ${
                              isSemiEdit
                                ? 'border-rose-300 bg-rose-50/30 text-rose-950 focus:ring-rose-800'
                                : 'border-amber-300 bg-amber-50/30 text-amber-950 focus:ring-amber-800'
                            }`}
                          >
                            <option value="">{isSemiEdit ? '-- Select Existing Semi Design Code --' : '-- Select Existing Design Code --'}</option>
                            {relevantDesignCodes.map((dc) => (
                              <option key={dc} value={dc}>
                                {dc}
                              </option>
                            ))}
                            <option value="CUSTOM">➕ Type New Design Code...</option>
                          </select>

                          {(!relevantDesignCodes.includes(editDesignCode) || editDesignCode === '') && (
                            <input
                              type="text"
                              placeholder={isSemiEdit ? "Type new Design Code (e.g. Rose Semi Maheshwari)" : "Type new Design Code (e.g. MS-SILVER-ZARI)"}
                              value={editDesignCode}
                              onChange={(e) => setEditDesignCode(e.target.value)}
                              className={`w-full border rounded-lg p-2 text-xs font-semibold mt-1.5 focus:ring-1 ${
                                isSemiEdit
                                  ? 'border-rose-400 bg-rose-50/50 text-rose-950 focus:ring-rose-800'
                                  : 'border-amber-400 bg-amber-50/50 text-amber-950 focus:ring-amber-800'
                              }`}
                            />
                          )}
                        </div>
                      );
                    })()}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-gray-700 font-bold">Category *</label>
                        {(() => {
                          const activeCat = categories.find((c) => c.id === editCategoryId || c.slug === editCategoryId);
                          if (activeCat) {
                            return (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                                Selected: 📁 {activeCat.name}
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      <select
                        value={editCategoryId}
                        onChange={(e) => setEditCategoryId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium"
                      >
                        {(() => {
                          const currentEditCat = categories.find((c) => c.id === editCategoryId || c.slug === editCategoryId);
                          const isSemiEdit = Boolean(
                            (editingProduct && isSemiMaheshwariProduct(editingProduct)) ||
                            activeTab === 'semi_products' ||
                            activeTab === 'add_semi' ||
                            currentEditCat?.slug?.includes('semi-maheshwari') ||
                            currentEditCat?.name?.toLowerCase().includes('semi maheshwari') ||
                            currentEditCat?.parentId === 'semi-maheshwari-sarees-id' ||
                            editFabric?.toLowerCase().includes('semi') ||
                            editTitle?.toLowerCase().includes('semi maheshwari')
                          );

                          if (isSemiEdit) {
                            const semiParents = categories.filter(
                              (c) => (c.isParent || !c.parentId || c.id === 'semi-maheshwari-sarees-id') && isSemiCategory(c)
                            );
                            const semiParentIds = new Set(semiParents.map((p) => p.id));
                            semiParentIds.add('semi-maheshwari-sarees-id');

                            const semiChildren = categories.filter(
                              (c) => (c.parentId && semiParentIds.has(c.parentId)) || (!c.isParent && isSemiCategory(c) && !semiParentIds.has(c.id))
                            );

                            return (
                              <>
                                <optgroup label="✨ SEMI MAHESHWARI CATEGORIES">
                                  {semiParents.map((parent) => {
                                    const children = categories.filter((c) => c.parentId === parent.id);
                                    return (
                                      <React.Fragment key={parent.id}>
                                        <option value={parent.id}>
                                          📁 {parent.name} (Parent Category)
                                        </option>
                                        {children.map((child) => (
                                          <option key={child.id} value={child.id}>
                                            &nbsp;&nbsp;↳ {child.name} (Sub-Category)
                                          </option>
                                        ))}
                                      </React.Fragment>
                                    );
                                  })}
                                  {semiChildren
                                    .filter((child) => !semiParents.some((p) => categories.some((c) => c.parentId === p.id && c.id === child.id)))
                                    .map((child) => (
                                      <option key={child.id} value={child.id}>
                                        ↳ {child.name} (Sub-Category)
                                      </option>
                                    ))}
                                </optgroup>

                                <optgroup label="📁 OTHER STORE CATEGORIES">
                                  {categories.filter((c) => !isSemiCategory(c)).map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </optgroup>
                              </>
                            );
                          }

                          const isSuitEdit = editProductType === 'suit' || currentEditCat?.slug?.includes('suit') || currentEditCat?.name?.toLowerCase().includes('suit') || editTitle?.toLowerCase().includes('suit');

                          if (isSuitEdit) {
                            return (
                              <>
                                {categories
                                  .filter(
                                    (c) =>
                                      (c.isParent || !c.parentId) &&
                                      (c.slug?.includes('suit') || c.name?.toLowerCase().includes('suit') || c.slug?.includes('unstitched'))
                                  )
                                  .map((parent) => {
                                    const children = categories.filter((c) => c.parentId === parent.id);
                                    return (
                                      <optgroup key={parent.id} label={`📁 PARENT: ${parent.name}`}>
                                        <option value={parent.id}>
                                          📁 {parent.name} (Parent Suit Category)
                                        </option>
                                        {children.map((child) => (
                                          <option key={child.id} value={child.id}>
                                            &nbsp;&nbsp;↳ {child.name} (Suit Sub-Category)
                                          </option>
                                        ))}
                                      </optgroup>
                                    );
                                  })}
                                {categories
                                  .filter(
                                    (c) =>
                                      (c.slug?.includes('suit') || c.name?.toLowerCase().includes('suit') || c.slug?.includes('unstitched')) &&
                                      !categories.some((p) => (p.isParent || !p.parentId) && (p.slug?.includes('suit') || p.name?.toLowerCase().includes('suit')))
                                  )
                                  .map((c) => (
                                    <option key={c.id} value={c.id}>
                                      📁 {c.name}
                                    </option>
                                  ))}
                              </>
                            );
                          }

                          return (
                            <>
                              {categories
                                .filter(
                                  (c) =>
                                    (c.isParent || !c.parentId) &&
                                    !c.slug?.includes('suit') &&
                                    !c.name?.toLowerCase().includes('suit') &&
                                    !c.slug?.includes('semi-maheshwari') &&
                                    !c.name?.toLowerCase().includes('semi maheshwari') &&
                                    c.id !== 'semi-maheshwari-sarees-id'
                                )
                                .map((parent) => {
                                  const children = categories.filter(
                                    (c) =>
                                      c.parentId === parent.id &&
                                      !c.slug?.includes('suit') &&
                                      !c.name?.toLowerCase().includes('suit') &&
                                      !c.slug?.includes('semi-maheshwari') &&
                                      !c.name?.toLowerCase().includes('semi maheshwari')
                                  );
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
                              {categories
                                .filter(
                                  (c) =>
                                    !c.isParent &&
                                    c.parentId &&
                                    !c.slug?.includes('suit') &&
                                    !c.name?.toLowerCase().includes('suit') &&
                                    !c.slug?.includes('semi-maheshwari') &&
                                    !c.name?.toLowerCase().includes('semi maheshwari') &&
                                    !categories.some((p) => p.id === c.parentId)
                                )
                                .map((c) => (
                                  <option key={c.id} value={c.id}>
                                    ↳ {c.name}
                                  </option>
                                ))}
                            </>
                          );
                        })()}
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

                {/* Product Video Upload / URL (Edit Modal) */}
                <div className="space-y-3 p-4 bg-amber-50/50 border border-amber-200/90 rounded-2xl shadow-2xs font-sans">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-amber-200/60 pb-2">
                    <div>
                      <label className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                        <Video className="w-4 h-4 text-amber-800" />
                        <span>Product Video / Reel (Optional)</span>
                      </label>
                      <p className="text-[11px] text-amber-900/80 font-medium mt-0.5">
                        🎬 Attach an MP4 video or link (Instagram Reel / Draping demo video).
                      </p>
                    </div>
                    {isEditVideoUploading && (
                      <span className="text-amber-800 animate-pulse text-xs font-bold shrink-0">
                        Uploading video...
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Upload Video File (MP4/WebM)
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleVideoUpload(e, true)}
                        className="block w-full text-xs text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-extrabold file:bg-amber-900 file:text-white hover:file:bg-black cursor-pointer bg-white p-1 rounded-xl border border-amber-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Or Direct Video URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://... or /uploads/..."
                        value={editVideoUrl}
                        onChange={(e) => setEditVideoUrl(e.target.value)}
                        className="w-full border border-amber-300 bg-white rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-amber-800"
                      />
                    </div>
                  </div>

                  {editVideoUrl && (
                    <div className="mt-2 p-2.5 bg-white rounded-xl border border-amber-300 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-black overflow-hidden relative shrink-0">
                          <video src={editVideoUrl} className="w-full h-full object-cover" muted playsInline />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-amber-950 truncate">{editVideoUrl}</p>
                          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Video Attached</span>
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditVideoUrl('')}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
                        title="Remove Video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
            <h3 className="text-lg font-serif font-bold text-amber-950 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-800" />
                <span>Add New Category (Saree / Suit / Collection)</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded-full">
                Universal Manager
              </span>
            </h3>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garbha Reshami Special, Tissue Zari, Maheshwari Suit Sets"
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
                      <label className="block text-amber-950 font-bold mb-1">Select Parent Category (Parent चुनें) *</label>
                      <select
                        value={catParentId}
                        onChange={(e) => {
                          setCatParentId(e.target.value);
                          setCatIsParent(false);
                        }}
                        className="w-full border border-amber-300 rounded-lg p-2.5 text-xs bg-white font-bold focus:ring-1 focus:ring-amber-800 text-gray-900"
                      >
                        {categories
                          .filter((c) => c.isParent || !c.parentId)
                          .map((parent) => {
                            let typeHint = 'Saree Parent';
                            if (parent.slug?.includes('suit') || parent.name?.toLowerCase().includes('suit')) {
                              typeHint = 'Suit Parent';
                            } else if (parent.slug?.includes('semi') || parent.name?.toLowerCase().includes('semi')) {
                              typeHint = 'Semi Maheshwari Parent';
                            } else if (parent.slug?.includes('dupatta') || parent.slug?.includes('other')) {
                              typeHint = 'Other Collection';
                            }
                            return (
                              <option key={parent.id} value={parent.id}>
                                📁 {parent.name} ({typeHint})
                              </option>
                            );
                          })}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
              <h3 className="font-serif font-bold text-amber-950 text-lg flex items-center gap-2">
                <Folder className="w-5 h-5 text-amber-800" />
                <span>
                  {catFilter === 'sarees' && `Maheshwari Saree Categories (${categories.filter(isSareeCategory).length})`}
                  {catFilter === 'suits' && `Maheshwari Suit Categories (${categories.filter(isSuitCategory).length})`}
                  {catFilter === 'semi' && `Semi Maheshwari Categories (${categories.filter(isSemiCategory).length})`}
                  {catFilter === 'all' && `All Categories (${categories.length})`}
                </span>
              </h3>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCatFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    catFilter === 'all' ? 'bg-amber-950 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100/70'
                  }`}
                >
                  All ({categories.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCatFilter('sarees')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    catFilter === 'sarees' ? 'bg-amber-900 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100/70'
                  }`}
                >
                  <span>🥻 Saree Categories ({categories.filter(isSareeCategory).length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCatFilter('suits')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    catFilter === 'suits' ? 'bg-rose-900 text-white shadow-xs' : 'text-rose-900 hover:bg-rose-50'
                  }`}
                >
                  <span>👗 Suit Categories ({categories.filter(isSuitCategory).length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCatFilter('semi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    catFilter === 'semi' ? 'bg-amber-800 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100/70'
                  }`}
                >
                  <span>✨ Semi ({categories.filter(isSemiCategory).length})</span>
                </button>
              </div>
            </div>

            {(() => {
              const displayedCats = catFilter === 'sarees'
                ? categories.filter(isSareeCategory)
                : catFilter === 'suits'
                ? categories.filter(isSuitCategory)
                : catFilter === 'semi'
                ? categories.filter(isSemiCategory)
                : categories;

              if (displayedCats.length === 0) {
                return (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-gray-200 text-gray-500 text-xs font-semibold">
                    No categories found in this filter view.
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedCats.map((cat) => (
                    <div key={cat.id} className={`p-4 border rounded-2xl bg-white shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between space-y-3 ${cat.isHidden ? 'border-rose-300 bg-rose-50/20' : 'border-gray-200'}`}>
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
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className="font-bold text-gray-900 text-sm truncate">{cat.name}</h4>
                            {(() => {
                              let count = 0;
                              if (products && products.length > 0) {
                                const childIds = new Set<string>();
                                childIds.add(cat.id);
                                categories.forEach((c: any) => {
                                  if (c.parentId === cat.id) childIds.add(c.id);
                                });
                                count = products.filter((p: any) => {
                                  if (p.categoryId && childIds.has(p.categoryId)) return true;
                                  if (p.category?.id && childIds.has(p.category.id)) return true;
                                  if (p.category?.slug && p.category.slug === cat.slug) return true;
                                  if (p.category?.name && p.category.name.trim().toLowerCase() === cat.name.trim().toLowerCase()) return true;
                                  return false;
                                }).length;
                              } else {
                                count = cat._count?.products || 0;
                              }
                              const isSuit = isSuitCategory(cat);
                              const unitLabel = isSuit ? (count === 1 ? 'Suit' : 'Suits') : (count === 1 ? 'Saree' : 'Sarees');

                              return (
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                                  count > 0 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900'
                                }`}>
                                  {count} {unitLabel}
                                </span>
                              );
                            })()}
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

                            {isSuitCategory(cat) ? (
                              <span className="bg-rose-100 text-rose-950 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                👗 SUIT
                              </span>
                            ) : isSemiCategory(cat) ? (
                              <span className="bg-purple-100 text-purple-950 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                ✨ SEMI
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-950 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                🥻 SAREE
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
                          className="flex-1 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 text-amber-800" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleCategoryVisibility(cat)}
                          className={`py-1.5 px-2.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
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
                          className="py-1.5 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
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

      {/* Tab: Handloom Heritage Stories & Blog Manager */}
      {activeTab === 'blogs' && (
        <div className="mt-6">
          <BlogManagerTab />
        </div>
      )}

      {/* MODAL 1: Dispatch & Courier Tracking Details Modal (Amazon/Myntra/Nykaa style) */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-950 via-rose-950 to-neutral-950 p-4 sm:p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  Order Fulfillment & Logistics
                </span>
                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-amber-100">
                  Dispatch Order #{selectedOrderForDispatch.orderNumber || selectedOrderForDispatch.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForDispatch(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveDispatchAndNotify} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs font-sans">
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
                <p className="font-bold text-gray-900">
                  Customer: <span className="font-extrabold text-amber-950">{selectedOrderForDispatch.customerName}</span> (+91 {selectedOrderForDispatch.customerPhone})
                </p>
                <p className="text-gray-600 text-[11px] truncate">
                  Address: {selectedOrderForDispatch.shippingAddress}
                </p>
              </div>

              {/* Courier Partner Selection */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Select Courier Partner / Logistics Service *
                </label>
                <select
                  value={dispatchCourier}
                  onChange={(e) => setDispatchCourier(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 font-bold text-xs bg-white text-gray-900 focus:ring-2 focus:ring-amber-700 outline-none"
                >
                  <option value="Delhivery">Delhivery Surface / Express</option>
                  <option value="DTDC Express">DTDC Courier & Cargo</option>
                  <option value="Shree Anjani Courier">Shree Anjani Courier</option>
                  <option value="Shree Maruti Courier">Shree Maruti Courier</option>
                  <option value="Blue Dart">Blue Dart Express</option>
                  <option value="India Post (Speed Post)">India Post (Speed Post / Regd. Parcel)</option>
                  <option value="Shiprocket">Shiprocket Automated Logistics</option>
                  <option value="Ecom Express">Ecom Express</option>
                  <option value="Trackon Couriers">Trackon Couriers</option>
                  <option value="The Professional Couriers">The Professional Couriers (TPC)</option>
                  <option value="Self Handover / Local Maheshwar">Self Handover / Local Maheshwar Handloom Delivery</option>
                </select>
              </div>

              {/* Tracking / AWB Number */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  AWB / Tracking Consignment Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 143289012344 or DTDC982341"
                  value={dispatchTrackingNumber}
                  onChange={(e) => setDispatchTrackingNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 font-mono font-bold text-xs text-amber-950 bg-amber-50/30 focus:ring-2 focus:ring-amber-700 outline-none"
                />
              </div>

              {/* Estimated Delivery Window */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Estimated Delivery Timeline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2-4 Business Days or By Friday, 26 Sep"
                  value={dispatchEstimatedDelivery}
                  onChange={(e) => setDispatchEstimatedDelivery(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 font-semibold text-xs text-gray-900 bg-white focus:ring-2 focus:ring-amber-700 outline-none"
                />
              </div>

              {/* Optional Custom Tracking URL */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Direct Tracking URL (Auto-generated if empty)
                </label>
                <input
                  type="text"
                  placeholder="Leave empty to auto-generate tracking link based on courier..."
                  value={dispatchTrackingUrl}
                  onChange={(e) => setDispatchTrackingUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 font-medium text-xs text-gray-700 bg-white focus:ring-2 focus:ring-amber-700 outline-none"
                />
              </div>

              {/* Internal / Customer Notes */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Dispatch Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Handcrafted Maheshwari Saree packed securely in heritage gift box with weaver tag."
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 font-medium text-xs text-gray-700 bg-white focus:ring-2 focus:ring-amber-700 outline-none"
                />
              </div>

              {/* Submit & Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDispatch(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdatingOrder}
                  className="px-5 py-2.5 rounded-xl bg-amber-950 hover:bg-black text-white font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-amber-300" />
                  <span>{isUpdatingOrder ? 'Saving...' : 'Save & Mark as Dispatched'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Luxury Printable Invoice & Dispatch Packing Slip */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[95vh]">
            {/* Header with Print CTA */}
            <div className="bg-gradient-to-r from-amber-950 to-neutral-950 p-4 text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-300">
                  <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-amber-200 text-sm">Official Invoice & Packing Slip</h4>
                  <p className="text-[10px] text-gray-300">Order #{selectedOrderForInvoice.orderNumber || selectedOrderForInvoice.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>🖨️ Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Printable Area */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-xs font-sans bg-white print:p-0">
              {/* Brand Header */}
              <div className="flex items-start justify-between border-b-2 border-amber-900 pb-4">
                <div>
                  <h2 className="text-2xl font-serif font-black text-amber-950 tracking-tight">Reoti Handloom</h2>
                  <p className="text-[11px] font-serif italic text-amber-800">Something &quot;more&quot; in Maheshwari Handloom</p>
                  <p className="text-[10px] text-gray-600 mt-1">
                    Ahilya Fort Road, Maheshwar, Madhya Pradesh - 451224<br />
                    Phone: +91 96174 44445 • Email: reotihandloom@gmail.com<br />
                    Web: https://reotihandloom.com
                  </p>
                </div>

                <div className="text-right">
                  <span className="bg-amber-100 text-amber-950 text-[10px] font-black uppercase px-2.5 py-1 rounded border border-amber-300">
                    TAX INVOICE
                  </span>
                  <p className="font-mono font-bold text-sm text-gray-900 mt-2">
                    #{selectedOrderForInvoice.orderNumber || selectedOrderForInvoice.id}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-2 gap-4 bg-amber-50/40 p-4 rounded-xl border border-amber-200/80">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-950 uppercase tracking-wider block mb-1">
                    Billed & Shipped To:
                  </span>
                  <p className="font-bold text-gray-900 text-sm">{selectedOrderForInvoice.customerName}</p>
                  <p className="text-gray-700 text-xs mt-0.5 whitespace-pre-line leading-relaxed">
                    {selectedOrderForInvoice.shippingAddress}
                  </p>
                  <p className="font-mono font-bold text-gray-900 text-[11px] mt-1">
                    Mobile: +91 {selectedOrderForInvoice.customerPhone}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-950 uppercase tracking-wider block mb-1">
                    Payment & Shipping:
                  </span>
                  {(() => {
                    const isCod = (selectedOrderForInvoice.paymentMethod || '').toUpperCase().includes('COD') || (selectedOrderForInvoice.paymentMethod || '').toUpperCase().includes('CASH') || selectedOrderForInvoice.paymentStatus === 'PENDING_COD';
                    return (
                      <>
                        <p><span className="text-gray-500">Payment Mode:</span> <span className="font-bold">{isCod ? 'Cash on Delivery (COD)' : selectedOrderForInvoice.paymentMethod || 'Prepaid Online'}</span></p>
                        <p><span className="text-gray-500">Payment Status:</span> <span className={`font-bold ${selectedOrderForInvoice.paymentStatus === 'PAID' ? 'text-emerald-800' : 'text-amber-800'}`}>{selectedOrderForInvoice.paymentStatus || (isCod ? 'PENDING_COD' : 'PAID')}</span></p>
                        {isCod && selectedOrderForInvoice.paymentStatus !== 'PAID' && (
                          <div className="bg-amber-100/90 text-amber-950 p-1 rounded text-[10px] font-bold border border-amber-300">
                            💵 COLLECT ₹{Number(selectedOrderForInvoice.totalAmount).toLocaleString()} CASH UPON DELIVERY
                          </div>
                        )}
                        <p><span className="text-gray-500">Courier Partner:</span> <span className="font-bold">{selectedOrderForInvoice.courierPartner || 'Handloom Express'}</span></p>
                        {selectedOrderForInvoice.trackingNumber && (
                          <p><span className="text-gray-500">Tracking AWB:</span> <span className="font-mono font-bold text-amber-950">{selectedOrderForInvoice.trackingNumber}</span></p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-950 text-amber-100 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Handloom Product Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(() => {
                      let items: any[] = [];
                      try {
                        items = typeof selectedOrderForInvoice.items === 'string'
                          ? JSON.parse(selectedOrderForInvoice.items)
                          : selectedOrderForInvoice.items || [];
                      } catch (e) {}

                      if (items.length === 0) {
                        return (
                          <tr>
                            <td className="p-3 text-gray-400">1</td>
                            <td className="p-3 font-bold text-gray-900">Authentic Maheshwari Handloom Saree</td>
                            <td className="p-3 text-center font-bold">1</td>
                            <td className="p-3 text-right font-bold">₹{Number(selectedOrderForInvoice.totalAmount).toLocaleString()}</td>
                            <td className="p-3 text-right font-bold text-rose-800">₹{Number(selectedOrderForInvoice.totalAmount).toLocaleString()}</td>
                          </tr>
                        );
                      }

                      return items.map((it: any, idx: number) => {
                        const title = it.product?.title || it.title || 'Maheshwari Handloom Saree';
                        const qty = it.quantity || 1;
                        const price = it.price || it.product?.price || selectedOrderForInvoice.totalAmount;
                        const lineTotal = price * qty;

                        return (
                          <tr key={idx}>
                            <td className="p-3 text-gray-400">{idx + 1}</td>
                            <td className="p-3">
                              <p className="font-bold text-gray-900">{title}</p>
                              <p className="text-[10px] text-gray-500">Pure Handloom • Craft Origin: Maheshwar</p>
                            </td>
                            <td className="p-3 text-center font-bold">{qty}</td>
                            <td className="p-3 text-right font-bold">₹{Number(price).toLocaleString()}</td>
                            <td className="p-3 text-right font-bold text-rose-800">₹{Number(lineTotal).toLocaleString()}</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                  <tfoot className="bg-amber-50/80 border-t-2 border-amber-900 font-bold text-xs">
                    <tr>
                      <td colSpan={4} className="p-3 text-right text-gray-700 uppercase tracking-wider">
                        Grand Total (Inclusive of all Handloom taxes):
                      </td>
                      <td className="p-3 text-right text-rose-900 text-sm font-black">
                        ₹{Number(selectedOrderForInvoice.totalAmount).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Authenticity & Return Policy Footer */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-gray-500">
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-950">✓ 100% Genuine Maheshwar Handloom Certified</p>
                  <p>Thank you for promoting traditional Indian handloom craftsmanship.</p>
                </div>
                <div className="text-right font-serif italic text-amber-900 text-xs">
                  Authorized Signatory • Reoti Handloom
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Cancel Order & Instant WhatsApp Notification Modal */}
      {selectedOrderForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-rose-300 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-950 via-red-950 to-neutral-950 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-500/20 rounded-xl border border-rose-400/30">
                  <XCircle className="w-5 h-5 text-rose-300" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-rose-100">
                    Cancel Order #{selectedOrderForCancel.orderNumber || selectedOrderForCancel.id}
                  </h4>
                  <p className="text-[11px] text-rose-300/80">
                    Update order status and notify customer directly on WhatsApp
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderForCancel(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleConfirmCancelOrder} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs font-sans">
              {/* Order & Customer Summary */}
              <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1">
                <p className="font-bold text-gray-900">
                  Customer: <span className="font-extrabold text-rose-950">{selectedOrderForCancel.customerName}</span> (+91 {selectedOrderForCancel.customerPhone})
                </p>
                <p className="text-gray-600 text-[11px]">
                  Order Total: <span className="font-bold text-gray-900">₹{Number(selectedOrderForCancel.totalAmount || 0).toLocaleString()}</span> • Payment Mode: <span className="font-bold">{selectedOrderForCancel.paymentMethod || 'RAZORPAY_ONLINE'} ({selectedOrderForCancel.paymentStatus || 'PAID'})</span>
                </p>
              </div>

              {/* Cancellation Reason Selector */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Select Reason for Cancellation *
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 font-bold text-xs bg-white text-gray-900 focus:ring-2 focus:ring-rose-700 outline-none"
                >
                  <option value="Out of Stock / Saree Unavailable">📦 Out of Stock / Saree Unavailable</option>
                  <option value="Fabric Quality Check Issue">🔍 Fabric Quality Check Issue</option>
                  <option value="Customer Requested Cancellation">👤 Customer Requested Cancellation</option>
                  <option value="Delivery Pincode Unserviceable">📍 Delivery Pincode Unserviceable</option>
                  <option value="Payment / Address Verification Failed">💳 Payment / Address Verification Failed</option>
                  <option value="Other / Custom Reason">📝 Other / Custom Reason</option>
                </select>
              </div>

              {/* Custom Note */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Additional Note / Message (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Refund initiated. Alternatively, you may choose another saree from our latest Maheshwari collection."
                  value={cancelCustomNote}
                  onChange={(e) => setCancelCustomNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 font-medium text-xs text-gray-700 bg-white focus:ring-2 focus:ring-rose-700 outline-none"
                />
              </div>

              {/* Live WhatsApp Message Preview */}
              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-[11px] text-gray-700 space-y-1">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Message Preview:</span>
                </span>
                <p className="font-sans text-gray-600 whitespace-pre-line bg-white p-2.5 rounded-lg border border-emerald-100 text-[10px] leading-relaxed">
                  Greetings from Reoti Handloom! 🙏{'\n'}
                  Important update regarding your Reoti Handloom Order #{selectedOrderForCancel.orderNumber || selectedOrderForCancel.id}:{'\n'}
                  ❌ Status: CANCELLED{'\n'}
                  ⚠️ Reason: {cancelReason.includes('Other') ? (cancelCustomNote || 'Unforeseen circumstances') : cancelReason}{'\n'}
                  {cancelCustomNote ? `📝 Note: ${cancelCustomNote}\n` : ''}
                  💳 {(selectedOrderForCancel.paymentMethod || '').toLowerCase().includes('razorpay') || selectedOrderForCancel.paymentStatus === 'PAID'
                    ? `Refund Info: Full refund of ₹${Number(selectedOrderForCancel.totalAmount || 0).toLocaleString()} will be automatically refunded to your original source in 3-5 days.`
                    : 'Payment: No payment charged (Cash on Delivery).'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForCancel(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold transition-all cursor-pointer"
                >
                  Keep Order
                </button>

                <button
                  type="submit"
                  disabled={isUpdatingOrder}
                  className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-200" />
                  <span>{isUpdatingOrder ? 'Processing...' : 'Confirm Cancel & Send WhatsApp'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
