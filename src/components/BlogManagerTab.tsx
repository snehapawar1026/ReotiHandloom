'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  PlusCircle,
  Pencil,
  Trash2,
  Upload,
  Image as ImageIcon,
  Play,
  Sparkles,
  Calendar,
  Clock,
  Tag,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Video,
  FileText,
  User,
  Copy,
  Check,
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  videoUrl?: string | null;
  readingTime: string;
  isFeatured?: boolean;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

const CATEGORIES = [
  'Weaving Heritage',
  'Buyer Guide',
  'Care & Maintenance',
  'Styling Tips',
  'Behind the Looms',
  'Handloom Stories',
  'Artisan Spotlight',
];

export function BlogManagerTab() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // New Blog Modal / Drawer state
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Weaving Heritage');
  const [customCategory, setCustomCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Reoti Handloom Studio');
  const [readingTime, setReadingTime] = useState('4 min read');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formMsg, setFormMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Blog Modal state
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editReadingTime, setEditReadingTime] = useState('');
  const [editMediaType, setEditMediaType] = useState<'image' | 'video'>('image');
  const [editMediaUrl, setEditMediaUrl] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [isEditUploading, setIsEditUploading] = useState(false);
  const [editMsg, setEditMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [editUploadProgress, setEditUploadProgress] = useState(0);

  // Copy notification state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs?t=' + Date.now());
      const data = await res.json();
      if (data.success && Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isEdit) {
      setIsEditUploading(true);
      setEditUploadProgress(1);
    } else {
      setIsUploading(true);
      setUploadProgress(1);
    }

    try {
      const CHUNK_SIZE = 1.5 * 1024 * 1024; // 1.5MB chunks bypass all server & proxy limits
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const uploadId = `up_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      let finalUrl = '';

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunkBlob = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunkBlob, file.name);
        formData.append('uploadId', uploadId);
        formData.append('fileName', file.name);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const text = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          throw new Error(`Server returned status ${res.status}: ${text.slice(0, 100) || 'Connection reset'}`);
        }

        if (!data.success) {
          throw new Error(data.error || `Chunk ${chunkIndex + 1} upload failed`);
        }

        const percent = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        if (isEdit) setEditUploadProgress(percent);
        else setUploadProgress(percent);

        if (chunkIndex === totalChunks - 1 && data.url) {
          finalUrl = data.url;
        }
      }

      if (finalUrl) {
        const fileNameLower = (file.name || '').toLowerCase();
        const fileTypeLower = (file.type || '').toLowerCase();
        const isVid =
          fileTypeLower.startsWith('video/') ||
          fileNameLower.endsWith('.mp4') ||
          fileNameLower.endsWith('.webm') ||
          fileNameLower.endsWith('.mov') ||
          fileNameLower.endsWith('.mkv') ||
          fileNameLower.endsWith('.avi');

        if (isEdit) {
          setEditMediaUrl(finalUrl);
          if (isVid) setEditMediaType('video');
        } else {
          setMediaUrl(finalUrl);
          if (isVid) setMediaType('video');
        }
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      if (isEdit) {
        setIsEditUploading(false);
        setEditUploadProgress(0);
      } else {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormMsg('Please enter both title and story content.');
      return;
    }

    setIsSubmitting(true);
    setFormMsg('');

    try {
      const finalCategory = category === 'Custom' ? (customCategory.trim() || 'Handloom Stories') : category;
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          category: finalCategory,
          excerpt,
          content,
          author,
          readingTime,
          mediaType,
          mediaUrl,
          isFeatured,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormMsg('✓ Story published successfully!');
        // Reset form
        setTitle('');
        setSlug('');
        setExcerpt('');
        setContent('');
        setMediaUrl('');
        setIsCreating(false);
        fetchBlogs();
      } else {
        setFormMsg('Error: ' + data.error);
      }
    } catch (err: any) {
      setFormMsg('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setEditTitle(blog.title);
    setEditSlug(blog.slug);
    setEditCategory(blog.category);
    setEditExcerpt(blog.excerpt);
    setEditContent(blog.content);
    setEditAuthor(blog.author);
    setEditReadingTime(blog.readingTime);
    setEditMediaType(blog.mediaType || 'image');
    setEditMediaUrl(blog.mediaUrl);
    setEditIsFeatured(Boolean(blog.isFeatured));
    setEditMsg('');
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    setIsUpdating(true);
    setEditMsg('');

    try {
      const res = await fetch(`/api/blogs/${editingBlog.slug || editingBlog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          slug: editSlug,
          category: editCategory,
          excerpt: editExcerpt,
          content: editContent,
          author: editAuthor,
          readingTime: editReadingTime,
          mediaType: editMediaType,
          mediaUrl: editMediaUrl,
          isFeatured: editIsFeatured,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditMsg('✓ Article updated successfully!');
        setEditingBlog(null);
        fetchBlogs();
      } else {
        setEditMsg('Error: ' + data.error);
      }
    } catch (err: any) {
      setEditMsg('Error: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (blog: BlogPost) => {
    if (!confirm(`Are you sure you want to permanently delete "${blog.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/blogs/${blog.slug || blog.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
      } else {
        alert('Failed to delete blog: ' + data.error);
      }
    } catch (err: any) {
      alert('Delete error: ' + err.message);
    }
  };

  const handleCopyLink = (bSlug: string, id: string) => {
    const url = `https://reotihandloom.com/blogs/${bSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filtered = blogs.filter((b) => {
    const matchCat = categoryFilter === 'ALL' || (b.category || '').toLowerCase() === categoryFilter.toLowerCase();
    const matchSearch =
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.author || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-amber-950 via-[#5c131e] to-amber-950 rounded-3xl p-6 sm:p-8 text-amber-50 shadow-xl border border-amber-400/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" /> Handloom Content Studio
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-amber-100">
              Blog & Handloom Stories Manager
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-xl">
              Publish weaving heritage chronicles, saree care guides, styling blogs, and artisan videos to educate customers and boost Google SEO.
            </p>
          </div>

          <button
            onClick={() => {
              setIsCreating(!isCreating);
              setFormMsg('');
            }}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {isCreating ? (
              <>
                <X className="w-4 h-4" /> Close Editor
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Write New Story / Blog
              </>
            )}
          </button>
        </div>
      </div>

      {/* Create New Story Form Drawer / Modal */}
      {isCreating && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <h3 className="font-serif font-bold text-xl text-amber-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-700" /> Write & Publish Handloom Story
            </h3>
            <span className="text-xs font-semibold text-gray-500">Supports Images, Videos & Markdown</span>
          </div>

          {formMsg && (
            <div className={`p-4 rounded-xl text-xs font-bold mb-6 flex items-center gap-2 ${formMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {formMsg.startsWith('✓') ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              <span>{formMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Title & Slug */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Article Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., The Royal Legacy of Ahilyabai Holkar & Maheshwari Looms"
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-amber-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    URL Slug (Auto-generated)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="the-royal-legacy-of-ahilyabai-holkar"
                    className="w-full px-4 py-2.5 bg-slate-100 border border-gray-300 rounded-xl text-xs font-mono text-gray-700 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Custom">+ Custom Category</option>
                    </select>
                  </div>

                  {category === 'Custom' ? (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Custom Category Name
                      </label>
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter category name"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Reoti Handloom Studio"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Estimated Read Time
                    </label>
                    <input
                      type="text"
                      value={readingTime}
                      onChange={(e) => setReadingTime(e.target.value)}
                      placeholder="e.g., 4 min read"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-800 focus:ring-rose-800"
                      />
                      <span className="text-xs font-bold text-gray-800">⭐ Featured on Home</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Short Excerpt / Preview Summary
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence hook for cards and WhatsApp preview..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 outline-none"
                  />
                </div>
              </div>

              {/* Media Upload (Photo OR Video) */}
              <div className="space-y-4 bg-amber-50/40 p-5 rounded-2xl border border-amber-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Featured Media (Photo or Video)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaType('image')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${mediaType === 'image' ? 'bg-amber-950 text-white shadow-xs' : 'bg-white text-gray-700 border'}`}
                    >
                      📷 Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${mediaType === 'video' ? 'bg-rose-800 text-white shadow-xs' : 'bg-white text-gray-700 border'}`}
                    >
                      🎬 Video
                    </button>
                  </div>
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Upload {mediaType === 'video' ? 'Video File (MP4, WebM, MOV)' : 'Photo / Poster (JPG, PNG)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept={mediaType === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/*'}
                      onChange={(e) => handleFileUpload(e, false)}
                      disabled={isUploading}
                      className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-950 file:text-white hover:file:bg-rose-800 cursor-pointer"
                    />
                  </div>
                  {isUploading && (
                    <div className="space-y-1 py-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-amber-950">
                        <span>Uploading {mediaType === 'video' ? 'Video' : 'Photo'}...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-amber-200/80 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-600 to-rose-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(uploadProgress, 5)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Media URL Input */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Or Enter Media URL / Reel Link
                  </label>
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => {
                      setMediaUrl(e.target.value);
                      if (e.target.value.endsWith('.mp4') || e.target.value.endsWith('.webm')) {
                        setMediaType('video');
                      }
                    }}
                    placeholder={mediaType === 'video' ? 'https://.../video.mp4' : 'https://.../photo.jpg'}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono"
                  />
                </div>

                {/* Live Preview Frame */}
                {mediaUrl && (
                  <div className="mt-3 aspect-video bg-black rounded-xl overflow-hidden border border-amber-300 shadow-md relative">
                    {mediaType === 'video' || mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') ? (
                      <video src={mediaUrl} controls className="w-full h-full object-contain" />
                    ) : (
                      <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Full Story Content (Markdown Textarea) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Article Story Content (Markdown & Headings Supported) <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Write the full story here...
## The Historic Origins
The Maheshwari weave dates back to Queen Ahilyabai Holkar in the 18th century...

### Key Techniques:
- Bugdi border
- Natural silk-cotton blend`}
                className="w-full p-4 bg-slate-50 border border-gray-300 rounded-2xl text-sm font-mono text-gray-900 leading-relaxed outline-none focus:ring-2 focus:ring-amber-900"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-6 py-3 bg-gradient-to-r from-amber-950 to-rose-900 hover:from-black hover:to-rose-950 text-amber-100 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing Story...' : '🚀 Publish Handloom Story'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs Filter & Search Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories, titles, authors..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-900"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          {['ALL', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-amber-950 text-amber-100 shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stories List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-rose-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-500 mt-2">Loading stories...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-8">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-700">No blog posts found</p>
          <p className="text-xs text-gray-400 mt-0.5">Click "Write New Story" above to publish your first article.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((blog) => {
            const isVid = blog.mediaType === 'video' || (blog.mediaUrl && (blog.mediaUrl.endsWith('.mp4') || blog.mediaUrl.endsWith('.webm')));
            return (
              <div
                key={blog.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-amber-100 overflow-hidden">
                    {isVid ? (
                      <video
                        src={blog.mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={blog.mediaUrl || '/uploads/saree_1789923479221_mexzs.jpeg'}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {blog.category}
                    </div>

                    {isVid && (
                      <div className="absolute top-2 right-2 bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Video</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-semibold">
                      <span>{blog.author}</span>
                      <span>•</span>
                      <span>{blog.readingTime}</span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
                      {blog.title}
                    </h4>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`/blogs/${blog.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="View Article on Live Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleCopyLink(blog.slug, blog.id)}
                      className="p-1.5 text-gray-600 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Copy Public Link"
                    >
                      {copiedId === blog.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(blog)}
                      className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Blog Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-lg text-amber-950 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-rose-700" /> Edit Handloom Story
              </h3>
              <button
                onClick={() => setEditingBlog(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {editMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl mb-4 border border-emerald-200">
                {editMsg}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Excerpt</label>
                <textarea
                  rows={2}
                  value={editExcerpt}
                  onChange={(e) => setEditExcerpt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              {/* Media Section */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">Update Photo / Video</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditMediaType('image')}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${editMediaType === 'image' ? 'bg-amber-950 text-white' : 'bg-white border'}`}
                    >
                      Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMediaType('video')}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${editMediaType === 'video' ? 'bg-rose-800 text-white' : 'bg-white border'}`}
                    >
                      Video
                    </button>
                  </div>
                </div>

                <input
                  type="file"
                  accept={editMediaType === 'video' ? 'video/*' : 'image/*'}
                  onChange={(e) => handleFileUpload(e, true)}
                  disabled={isEditUploading}
                  className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-amber-950 file:text-white cursor-pointer"
                />

                {isEditUploading && (
                  <div className="space-y-1 py-1">
                    <div className="flex justify-between text-[11px] font-bold text-amber-950">
                      <span>Uploading {editMediaType === 'video' ? 'Video' : 'Photo'}...</span>
                      <span>{editUploadProgress}%</span>
                    </div>
                    <div className="w-full bg-amber-200/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-600 to-rose-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(editUploadProgress, 5)}%` }}
                      />
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  value={editMediaUrl}
                  onChange={(e) => {
                    setEditMediaUrl(e.target.value);
                    if (e.target.value.endsWith('.mp4') || e.target.value.endsWith('.webm')) {
                      setEditMediaType('video');
                    }
                  }}
                  placeholder="Or enter media URL"
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono"
                />

                {/* Edit Modal Live Preview */}
                {editMediaUrl && (
                  <div className="mt-2 aspect-video bg-black rounded-xl overflow-hidden border border-amber-300 shadow-sm relative">
                    {editMediaType === 'video' || editMediaUrl.endsWith('.mp4') || editMediaUrl.endsWith('.webm') ? (
                      <video src={editMediaUrl} controls className="w-full h-full object-contain" />
                    ) : (
                      <img src={editMediaUrl} alt="Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Content</label>
                <textarea
                  rows={8}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-amber-950 text-white rounded-xl text-xs font-bold hover:bg-rose-900"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogManagerTab;
