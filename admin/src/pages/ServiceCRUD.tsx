import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import MediaManager from '../components/MediaManager';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
}

interface Service {
  id: number;
  category_id: number;
  category?: Category;
  title: string;
  featured_image: string | null;
  short_description: string | null;
  full_description: string | null;
  price: number;
  duration: string | null;
  display_order: number;
  featured: boolean;
  status: 'active' | 'inactive';
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
}

const ServiceCRUD: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [selectedFeaturedFilter, setSelectedFeaturedFilter] = useState('');

  const [sortBy, setSortBy] = useState('display_order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Media Manager Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'featured_image' | null>(null);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    featured_image: '',
    short_description: '',
    full_description: '',
    price: 0,
    duration: '',
    display_order: 0,
    featured: false,
    status: 'active' as 'active' | 'inactive',
    seo_title: '',
    seo_description: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Fetch Categories for dropdown filter
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/active');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Services
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/services', {
        params: {
          page,
          search,
          category_id: selectedCatFilter,
          status: selectedStatusFilter,
          featured: selectedFeaturedFilter,
          sort_by: sortBy,
          sort_order: sortOrder,
        }
      });
      if (response.data.success) {
        setServices(response.data.data.data);
        setTotalPages(response.data.data.last_page);
        setTotalItems(response.data.data.total);
      }
    } catch (error) {
      toast.error('Failed to load services.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchServices();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, selectedCatFilter, selectedStatusFilter, selectedFeaturedFilter, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    setPage(1);
  };

  // Row selection helpers
  const handleSelectRow = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(services.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Bulk actions triggers
  const handleBulkDelete = async () => {
    setIsDeleteLoading(true);
    try {
      const response = await api.post('/services/bulk-delete', { ids: selectedIds });
      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedIds([]);
        setIsBulkDeleteOpen(false);
        fetchServices();
      }
    } catch (error) {
      toast.error('Bulk deletion failed.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleBulkStatusUpdate = async (status: 'active' | 'inactive') => {
    if (selectedIds.length === 0) return;
    try {
      const response = await api.post('/services/bulk-status', { ids: selectedIds, status });
      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedIds([]);
        fetchServices();
      }
    } catch (error) {
      toast.error('Bulk status update failed.');
    }
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({
      category_id: categories[0]?.id.toString() || '',
      title: '',
      featured_image: '',
      short_description: '',
      full_description: '',
      price: 0,
      duration: '',
      display_order: services.length + 1,
      featured: false,
      status: 'active',
      seo_title: '',
      seo_description: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditId(service.id);
    setFormData({
      category_id: service.category_id.toString(),
      title: service.title,
      featured_image: service.featured_image || '',
      short_description: service.short_description || '',
      full_description: service.full_description || '',
      price: service.price,
      duration: service.duration || '',
      display_order: service.display_order,
      featured: service.featured,
      status: service.status,
      seo_title: service.seo_title || '',
      seo_description: service.seo_description || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.category_id) errors.category_id = 'Category selection is required.';
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (formData.price < 0) errors.price = 'Price must be 0 or positive.';
    if (formData.display_order < 0) errors.display_order = 'Display order must be 0 or positive.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitLoading(true);
    try {
      // In Laravel, if we upload files we can pass it, but since we use media manager urls:
      // The featured_image contains either the direct url or public path. Let's send the url as string.
      // Wait! If the backend service store expects file or url, in our ServiceService, we check:
      // if (isset($data['featured_image']) && $data['featured_image'] instanceof UploadedFile) { ... }
      // Else it will just save the string path. If we pass the image url/path, it will be saved correctly!
      // This matches perfectly!

      const payload = { ...formData };

      if (editId) {
        const response = await api.post(`/services/${editId}`, payload); // use POST with method override or standard POST route since we defined POST for updates in api.php
        if (response.data.success) {
          toast.success('Service updated successfully.');
          setIsModalOpen(false);
          fetchServices();
        }
      } else {
        const response = await api.post('/services', payload);
        if (response.data.success) {
          toast.success('Service created successfully.');
          setIsModalOpen(false);
          fetchServices();
        }
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const serverErrors: Record<string, string> = {};
        Object.keys(err.response.data.errors).forEach(key => {
          serverErrors[key] = err.response.data.errors[key][0];
        });
        setFormErrors(serverErrors);
      } else {
        toast.error('An error occurred during submission.');
      }
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      const response = await api.delete(`/services/${deleteId}`);
      if (response.data.success) {
        toast.success('Service deleted successfully.');
        setDeleteId(null);
        fetchServices();
      }
    } catch (error) {
      toast.error('Failed to delete service.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Callback from Media Manager selection
  const handleSelectMedia = (url: string) => {
    if (mediaTarget === 'featured_image') {
      setFormData({ ...formData, featured_image: url });
    }
    setIsMediaModalOpen(false);
    setMediaTarget(null);
  };

  // Define table columns
  const columns = [
    {
      header: 'Order',
      accessor: 'display_order',
      sortable: true,
      sortKey: 'display_order',
      className: 'w-16 text-center',
    },
    {
      header: 'Image',
      accessor: (row: Service) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-dark flex items-center justify-center shrink-0">
          {row.featured_image ? (
            <img
              src={row.featured_image.startsWith('http') ? row.featured_image : `http://localhost:8000/storage/${row.featured_image}`}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-4 h-4 text-muted/50" />
          )}
        </div>
      ),
      className: 'w-16',
    },
    {
      header: 'Service Title',
      accessor: 'title',
      sortable: true,
      sortKey: 'title',
      className: 'font-semibold',
    },
    {
      header: 'Category',
      accessor: (row: Service) => row.category?.name || '-',
      className: 'text-primary/95 text-xs font-bold uppercase tracking-wider',
    },
    {
      header: 'Price',
      accessor: (row: Service) => `₹${Number(row.price).toLocaleString()}`,
      sortable: true,
      sortKey: 'price',
      className: 'font-mono text-xs',
    },
    {
      header: 'Duration',
      accessor: 'duration',
      className: 'text-muted text-xs',
    },
    {
      header: 'Featured',
      accessor: (row: Service) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${row.featured
          ? 'text-primary bg-primary/10 border border-primary/20'
          : 'text-muted bg-white/5 border border-white/5'
          }`}>
          {row.featured ? 'Yes' : 'No'}
        </span>
      ),
      sortable: true,
      sortKey: 'featured',
      className: 'w-20 text-center',
    },
    {
      header: 'Status',
      accessor: (row: Service) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.status === 'active'
          ? 'text-green-400 bg-green-500/10 border border-green-500/10'
          : 'text-muted bg-white/5 border border-white/5'
          }`}>
          {row.status}
        </span>
      ),
      sortable: true,
      sortKey: 'status',
      className: 'w-20',
    },
    {
      header: 'Actions',
      accessor: (row: Service) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-primary/20 text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted hover:text-red-400 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: 'w-24',
    }
  ];

  return (
    <div className="space-y-6">

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Services Catalog</h2>
          <p className="text-xs text-muted font-sans font-light mt-1">Manage salon treatments, descriptions, and pricing</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Service</span>
        </button>
      </div>

      {/* Filter and Bulk Operations Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between gap-4 font-sans items-center">

        {/* Left Side: Filter inputs */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-60">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted select-none pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search services..."
              className="w-full pl-9 pr-4 py-2 bg-[#050505] border border-white/10 hover:border-white/20 focus:border-primary text-white outline-none rounded-xl text-xs transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCatFilter}
            onChange={(e) => { setSelectedCatFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-[#050505] border border-white/10 text-white rounded-xl text-xs cursor-pointer focus:border-primary outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Featured Dropdown */}
          <select
            value={selectedFeaturedFilter}
            onChange={(e) => { setSelectedFeaturedFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-[#050505] border border-white/10 text-white rounded-xl text-xs cursor-pointer focus:border-primary outline-none"
          >
            <option value="">Featured: All</option>
            <option value="1">Featured only</option>
            <option value="0">Non-featured</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => { setSelectedStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-[#050505] border border-white/10 text-white rounded-xl text-xs cursor-pointer focus:border-primary outline-none"
          >
            <option value="">Status: All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Right Side: Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl text-xs shrink-0 w-full md:w-auto justify-between">
            <span className="font-bold text-primary">{selectedIds.length} Selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusUpdate('active')}
                className="px-2.5 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/35 border border-green-500/10 rounded-lg font-bold uppercase text-[9px] tracking-wider transition-colors cursor-pointer"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('inactive')}
                className="px-2.5 py-1 bg-white/5 text-muted hover:bg-white/10 border border-white/5 rounded-lg font-bold uppercase text-[9px] tracking-wider transition-colors cursor-pointer"
              >
                Deactivate
              </button>
              <button
                onClick={() => setIsBulkDeleteOpen(true)}
                className="px-2.5 py-1 bg-red-950/40 text-red-400 hover:bg-red-900/35 border border-red-500/10 rounded-lg font-bold uppercase text-[9px] tracking-wider transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-[#0e0e0e]/50 border border-white/5 rounded-3xl p-4 sm:p-6">
        <Table
          columns={columns}
          data={services}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder as any}
          onSort={handleSort}
          selectedIds={selectedIds}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          rowIdAccessor={(row) => row.id}
          currentPage={page}
          lastPage={totalPages}
          total={totalItems}
          onPageChange={setPage}
          emptyMessage="No matching services found."
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? 'Edit Service' : 'Add New Service'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left side: basic details */}
            <div className="space-y-5">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Designer Hair Styling"
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                />
                {formErrors.title && <span className="text-red-500 text-xs mt-1 font-semibold">{formErrors.title}</span>}
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Service Category *</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {formErrors.category_id && <span className="text-red-500 text-xs mt-1 font-semibold">{formErrors.category_id}</span>}
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Base Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                  {formErrors.price && <span className="text-red-500 text-xs mt-1 font-semibold">{formErrors.price}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Duration (e.g. 60 Mins)</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 45 Mins"
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Status, Display order, Featured */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 justify-center items-center h-full pt-4">
                  <div className="flex items-center gap-2 select-none cursor-pointer">
                    <input
                      id="featured_check"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4.5 h-4.5 accent-primary border-white/20 bg-dark rounded focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="featured_check" className="text-xs font-sans text-muted cursor-pointer font-bold uppercase tracking-wider">
                      Featured
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Featured Image URL / Path</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    placeholder="Click choose image button..."
                    className="flex-grow px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTarget('featured_image');
                      setIsMediaModalOpen(true);
                    }}
                    className="px-4 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-4.5 h-4.5" />
                    <span>Choose</span>
                  </button>
                </div>
                {/* Thumbnail Preview */}
                {formData.featured_image && (
                  <div className="mt-2 w-32 aspect-video rounded-lg overflow-hidden border border-white/10 bg-dark relative group">
                    <img
                      src={formData.featured_image.startsWith('http') ? formData.featured_image : `http://localhost:8000/storage/${formData.featured_image}`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured_image: '' })}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 text-xs font-sans font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Right side: Descriptions & SEO */}
            <div className="space-y-5">
              {/* Short Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Short Description</label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Summarize the treatment in 1-2 lines..."
                  rows={2}
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm resize-none"
                />
              </div>

              {/* Full Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Full Detailed Description</label>
                <textarea
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="Provide full details, brand of products used, benefits, precautions, etc..."
                  rows={4}
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm resize-none"
                />
              </div>

              {/* SEO Title */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">SEO Title</label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="Title for google search results"
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                />
              </div>

              {/* SEO Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">SEO Description</label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="Snippet description shown in search results..."
                  rows={2}
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm resize-none"
                />
              </div>

            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-grow py-3 px-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/5 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitLoading}
              className="flex-grow py-3 px-4 bg-primary hover:bg-peacock disabled:bg-primary/50 text-black hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitLoading ? 'Saving...' : 'Save Service'}
            </button>
          </div>

        </form>
      </Modal>

      {/* Media Manager Selector Modal */}
      <Modal
        isOpen={isMediaModalOpen}
        onClose={() => { setIsMediaModalOpen(false); setMediaTarget(null); }}
        title="Select Media Asset"
        size="2xl"
      >
        <MediaManager onSelect={handleSelectMedia} isModalMode={true} />
      </Modal>

      {/* Delete Single Service Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action is permanent."
        isLoading={isDeleteLoading}
      />

      {/* Delete Bulk Services Confirmation */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Bulk Delete Services"
        message={`Are you sure you want to delete the ${selectedIds.length} selected services permanently?`}
        isLoading={isDeleteLoading}
      />

    </div>
  );
};

export default ServiceCRUD;
