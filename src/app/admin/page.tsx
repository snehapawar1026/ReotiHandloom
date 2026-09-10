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
} from 'lucide-react';

export default function AdminPage() {
  const { user, setUser, logout } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'add' | 'products'>('orders');

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Auth Form state
  const [adminEmail, setAdminEmail] = useState('admin@reotihandloom.com');
  const [adminPassword, setAdminPassword] = useState('Hariom@2618');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // New Saree Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [fabric, setFabric] = useState('Silk Cotton');
  const [weaveType, setWeaveType] = useState('Chatai Weave Border');
  const [borderType, setBorderType] = useState('Gold Zari');
  const [color, setColor] = useState('Crimson Red');
  const [lengthWithBlouse, setLengthWithBlouse] = useState('6.3 Meters (With Blouse Piece)');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [formMsg, setFormMsg] = useState('');

  // Edit Saree Modal state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editFabric, setEditFabric] = useState('Silk Cotton');
  const [editWeaveType, setEditWeaveType] = useState('Chatai Border');
  const [editBorderType, setEditBorderType] = useState('Gold Zari');
  const [editColor, setEditColor] = useState('Crimson Red');
  const [editLengthWithBlouse, setEditLengthWithBlouse] = useState('6.3 Meters (With Blouse Piece)');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editStock, setEditStock] = useState('15');
  const [editIsFeatured, setEditIsFeatured] = useState(true);
  const [editIsBestSeller, setEditIsBestSeller] = useState(false);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resOrders, resProducts, resCategories] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
      ]);

      if (resOrders.success) setOrders(resOrders.orders);
      if (resProducts.success) setProducts(resProducts.products);
      if (resCategories.success) {
        setCategories(resCategories.categories);
        if (resCategories.categories.length > 0) {
          setCategoryId(resCategories.categories[0].id);
          setEditCategoryId(resCategories.categories[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  // File Upload Handler (New Product)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
        setUploadedPreview(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // File Upload Handler (Edit Product Modal)
  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsEditUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setEditImageUrl(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsEditUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !originalPrice || !categoryId) {
      setFormMsg('Please fill in required product fields.');
      return;
    }

    const finalImage = imageUrl || uploadedPreview || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';

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
          lengthWithBlouse,
          categoryId,
          images: JSON.stringify([finalImage]),
          isFeatured,
          isBestSeller,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormMsg('✓ Saree Product added successfully to inventory!');
        setTitle('');
        setPrice('');
        setOriginalPrice('');
        setDescription('');
        setImageUrl('');
        setUploadedPreview('');
        setIsBestSeller(false);
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
    setEditTitle(p.title || '');
    setEditDescription(p.description || '');
    setEditPrice(p.price?.toString() || '');
    setEditOriginalPrice(p.originalPrice?.toString() || '');
    setEditFabric(p.fabric || 'Silk Cotton');
    setEditWeaveType(p.weaveType || 'Chatai Border');
    setEditBorderType(p.borderType || 'Gold Zari');
    setEditColor(p.color || 'Crimson Red');
    setEditLengthWithBlouse(p.lengthWithBlouse || '6.3 Meters (With Blouse Piece)');
    setEditCategoryId(p.categoryId || categories[0]?.id || '');
    setEditStock(p.stock?.toString() || '15');
    setEditIsFeatured(p.isFeatured || false);
    setEditIsBestSeller(p.isBestSeller || false);
    const imgs = JSON.parse(p.images || '[]');
    setEditImageUrl(imgs[0] || '');
    setEditMsg('');
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setEditMsg('Saving changes...');

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
          lengthWithBlouse: editLengthWithBlouse,
          categoryId: editCategoryId,
          stock: parseInt(editStock),
          images: JSON.stringify([editImageUrl]),
          isFeatured: editIsFeatured,
          isBestSeller: editIsBestSeller,
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

            <div className="bg-amber-50 p-3 rounded border border-amber-200 text-amber-950 text-[11px] font-semibold space-y-0.5">
              <p className="font-bold">🔑 Admin Credentials:</p>
              <p>Email: <span className="font-mono font-bold">admin@reotihandloom.com</span></p>
              <p>Password: <span className="font-mono font-bold">Hariom@2618</span></p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

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
      </div>

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
                  <img
                    src={imgs[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                    alt={p.title}
                    className="w-20 h-28 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 text-xs space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{p.title}</h4>
                        {p.isBestSeller && (
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                            BESTSELLER
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-amber-800 font-medium">{p.fabric} • {p.weaveType}</p>
                      <p className="text-[10px] text-gray-500">Border: {p.borderType} • Color: {p.color}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-extrabold text-rose-700 text-sm">₹{p.price.toLocaleString()}</span>
                        {p.originalPrice && (
                          <span className="line-through text-gray-400 text-[11px]">₹{p.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded w-fit mt-1">
                        Stock: {p.stock || 15} available
                      </p>
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

      {/* Tab 3: Add Saree Form */}
      {activeTab === 'add' && (
        <div className="mt-6 max-w-2xl bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-serif font-bold text-amber-950 mb-4 pb-2 border-b border-gray-100">
            Add New Maheshwari Saree Details
          </h3>

          <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Saree Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Crimson Gold Zari Maheshwari Silk Saree"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-amber-800 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                    ★ Mark as BESTSELLER Saree
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
              </div>
            </div>

            {/* Product Specifications Section */}
            <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-3">
              <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5 uppercase tracking-wider border-b border-amber-200/60 pb-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-800" />
                <span>Product Specifications</span>
              </h4>

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
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Weave Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Chatai Border"
                    value={weaveType}
                    onChange={(e) => setWeaveType(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Border Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Silver Zari / Gold Zari"
                    value={borderType}
                    onChange={(e) => setBorderType(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Color Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Crimson Red / Turquoise Blue"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Length / Blouse</label>
                  <input
                    type="text"
                    placeholder="e.g. 6.3 Meters (With Blouse Piece)"
                    value={lengthWithBlouse}
                    onChange={(e) => setLengthWithBlouse(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Direct Image File Upload Box */}
            <div className="space-y-2 p-3 bg-amber-50/50 border border-amber-200 rounded-lg">
              <label className="block font-bold text-amber-950 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-amber-800" />
                  <span>Upload Saree Photo from Device (PC / Mobile)</span>
                </span>
                {isUploading && <span className="text-amber-700 animate-pulse text-[11px]">Uploading photo...</span>}
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-amber-900 file:text-white hover:file:bg-amber-950 cursor-pointer"
              />

              {/* Uploaded Image Preview */}
              {(uploadedPreview || imageUrl) && (
                <div className="pt-2 flex items-center gap-3">
                  <div className="w-20 h-24 rounded border border-gray-300 overflow-hidden relative shadow-xs bg-white">
                    <img src={uploadedPreview || imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setUploadedPreview(''); setImageUrl(''); }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-[11px] text-emerald-800 font-semibold space-y-0.5">
                    <p className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Photo selected successfully!</span>
                    </p>
                    <p className="text-gray-500 font-mono text-[10px] truncate max-w-xs">{uploadedPreview || imageUrl}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Description & Craft Story</label>
              <textarea
                rows={3}
                placeholder="Craft details, weave story, color contrast..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-xs"
              />
            </div>

            {formMsg && (
              <p className={`text-xs font-bold ${formMsg.startsWith('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                {formMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-950 hover:bg-black text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-md transition-all"
            >
              SAVE SAREE TO INVENTORY
            </button>
          </form>
        </div>
      )}

      {/* Edit Saree Modal Overlay */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-amber-200 relative space-y-4 text-xs my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-800" />
                <h3 className="text-lg font-serif font-bold text-amber-950">
                  Edit Saree Details & Badges
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Saree Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Original MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium"
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
                      ★ Mark as BESTSELLER Saree
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
                </div>
              </div>

              {/* Edit Product Specifications Section */}
              <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-3">
                <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5 uppercase tracking-wider border-b border-amber-200/60 pb-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-800" />
                  <span>Edit Product Specifications</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Fabric</label>
                    <select
                      value={editFabric}
                      onChange={(e) => setEditFabric(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium"
                    >
                      <option value="Silk Cotton">Silk Cotton</option>
                      <option value="Pure Silk">Pure Silk</option>
                      <option value="Tissue Silk">Tissue Silk</option>
                      <option value="Cotton">Cotton</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Weave Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Chatai Border"
                      value={editWeaveType}
                      onChange={(e) => setEditWeaveType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Border Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Silver Zari / Gold Zari"
                      value={editBorderType}
                      onChange={(e) => setEditBorderType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Color Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Crimson Red / Turquoise Blue"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Length / Blouse</label>
                    <input
                      type="text"
                      placeholder="e.g. 6.3 Meters (With Blouse Piece)"
                      value={editLengthWithBlouse}
                      onChange={(e) => setEditLengthWithBlouse(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Category *</label>
                    <select
                      value={editCategoryId}
                      onChange={(e) => setEditCategoryId(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Photo Upload in Edit Modal */}
              <div className="space-y-2 p-3 bg-amber-50/50 border border-amber-200 rounded-lg">
                <label className="block font-bold text-amber-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-amber-800" />
                    <span>Change Saree Photo from Device</span>
                  </span>
                  {isEditUploading && <span className="text-amber-700 animate-pulse text-[11px]">Uploading...</span>}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-amber-900 file:text-white cursor-pointer"
                />

                {editImageUrl && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="w-16 h-20 rounded border border-gray-300 overflow-hidden relative shadow-xs bg-white">
                      <img src={editImageUrl} alt="Edit Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[11px] text-emerald-800 font-semibold truncate max-w-xs font-mono">
                      {editImageUrl}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Description & Craft Story</label>
                <textarea
                  rows={3}
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

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-950 hover:bg-black text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-md transition-all"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
