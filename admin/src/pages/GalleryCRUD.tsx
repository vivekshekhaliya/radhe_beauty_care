import React, { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Upload, X } from 'lucide-react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { toast } from 'sonner';
import ImageCropper from '../components/ImageCropper';

interface Category {
  id: number;
  name: string;
}

interface GalleryImage {
  id: number;
  category_id: number;
  category?: Category;
  image_path: string;
  title: string | null;
  alt_text: string | null;
  featured: boolean;
  display_order: number;
  status: 'active' | 'inactive';
  created_at: string;
}

const GalleryCRUD: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Filters & Pagination
  const [selectedCatFilter, setSelectedCatFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Multi-selection (bulk actions)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Create / Upload Form State
  const [uploadFormData, setUploadFormData] = useState({
    category_id: '',
    title: '',
    alt_text: '',
    featured: false,
    display_order: 0,
    status: 'active' as 'active' | 'inactive',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image Cropping States & Queue
  const [croppingQueue, setCroppingQueue] = useState<File[]>([]);
  const [currentCropFile, setCurrentCropFile] = useState<File | null>(null);
  const [croppingImageSrc, setCroppingImageSrc] = useState<string | null>(null);

  // Edit Form State
  const [editId, setEditId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    category_id: '',
    title: '',
    alt_text: '',
    featured: false,
    display_order: 0,
    status: 'active' as 'active' | 'inactive',
  });

  // Deletions state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/gallery-categories/active');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/gallery-images', {
        params: {
          page,
          category_id: selectedCatFilter,
          status: selectedStatusFilter,
        }
      });
      if (response.data.success) {
        setImages(response.data.data.data);
        setTotalPages(response.data.data.last_page);
        setTotalItems(response.data.data.total);
      }
    } catch (error) {
      toast.error('Failed to load gallery images.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [page, selectedCatFilter, selectedStatusFilter]);

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(images.map(img => img.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleOpenUploadModal = () => {
    setUploadFormData({
      category_id: categories[0]?.id.toString() || '',
      title: '',
      alt_text: '',
      featured: false,
      display_order: images.length + 1,
      status: 'active',
    });
    setSelectedFiles([]);
    setIsUploadModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length > 0) {
        setCroppingQueue(prev => [...prev, ...filesArray]);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (croppingQueue.length > 0 && !currentCropFile) {
      const nextFile = croppingQueue[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCroppingImageSrc(reader.result as string);
        setCurrentCropFile(nextFile);
      };
      reader.readAsDataURL(nextFile);
    }
  }, [croppingQueue, currentCropFile]);

  const handleCropComplete = (croppedFile: File) => {
    setSelectedFiles(prev => [...prev, croppedFile]);
    setCroppingQueue(prev => prev.slice(1));
    setCurrentCropFile(null);
    setCroppingImageSrc(null);
  };

  const handleCropCancel = () => {
    setCroppingQueue(prev => prev.slice(1));
    setCurrentCropFile(null);
    setCroppingImageSrc(null);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleOpenEditModal = (img: GalleryImage) => {
    setEditId(img.id);
    setEditFormData({
      category_id: img.category_id.toString(),
      title: img.title || '',
      alt_text: img.alt_text || '',
      featured: img.featured,
      display_order: img.display_order,
      status: img.status,
    });
    setIsEditModalOpen(true);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFormData.category_id) {
      toast.error('Please select a category.');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image file.');
      return;
    }

    setIsSubmitLoading(true);
    const formData = new FormData();
    formData.append('category_id', uploadFormData.category_id);
    formData.append('title', uploadFormData.title);
    formData.append('alt_text', uploadFormData.alt_text);
    formData.append('featured', uploadFormData.featured ? 'true' : 'false');
    formData.append('display_order', uploadFormData.display_order.toString());
    formData.append('status', uploadFormData.status);

    selectedFiles.forEach((file) => {
      formData.append('images[]', file); // Array of files
    });

    try {
      const response = await api.post('/gallery-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        toast.success('Images uploaded successfully.');
        setIsUploadModalOpen(false);
        fetchImages();
      }
    } catch (err: any) {
      toast.error('Upload failed. Ensure images are correct format and sizes.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;

    setIsSubmitLoading(true);
    try {
      const response = await api.post(`/gallery-images/${editId}`, editFormData); // POST to allow file overwrite updates if needed, else normal fields
      if (response.data.success) {
        toast.success('Gallery image updated successfully.');
        setIsEditModalOpen(false);
        fetchImages();
      }
    } catch (err: any) {
      toast.error('Update failed.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      const response = await api.delete(`/gallery-images/${deleteId}`);
      if (response.data.success) {
        toast.success('Image deleted.');
        setDeleteId(null);
        fetchImages();
      }
    } catch (error) {
      toast.error('Deletion failed.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleteLoading(true);
    try {
      const response = await api.post('/gallery-images/bulk-delete', { ids: selectedIds });
      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedIds([]);
        setIsBulkDeleteOpen(false);
        fetchImages();
      }
    } catch (error) {
      toast.error('Bulk deletion failed.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const columns = [
    {
      header: 'Order',
      accessor: 'display_order',
      className: 'w-16 text-center',
    },
    {
      header: 'Image Thumbnail',
      accessor: (row: GalleryImage) => (
        <div className="w-14 aspect-square rounded-lg overflow-hidden border border-white/10 bg-dark relative">
          <img 
            src={row.image_path.startsWith('http') ? row.image_path : `http://localhost:8000/storage/${row.image_path}`} 
            alt={row.alt_text || row.title || 'Gallery'} 
            className="w-full h-full object-cover"
          />
        </div>
      ),
      className: 'w-24',
    },
    {
      header: 'Title',
      accessor: (row: GalleryImage) => row.title || <span className="text-muted italic">Untitled</span>,
      className: 'font-semibold',
    },
    {
      header: 'Category',
      accessor: (row: GalleryImage) => row.category?.name || '-',
      className: 'text-primary/95 text-xs font-bold uppercase tracking-wider',
    },
    {
      header: 'Featured',
      accessor: (row: GalleryImage) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
          row.featured 
            ? 'text-primary bg-primary/10 border border-primary/20' 
            : 'text-muted bg-white/5 border border-white/5'
        }`}>
          {row.featured ? 'Yes' : 'No'}
        </span>
      ),
      className: 'w-20 text-center',
    },
    {
      header: 'Status',
      accessor: (row: GalleryImage) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.status === 'active' 
            ? 'text-green-400 bg-green-500/10 border border-green-500/10' 
            : 'text-muted bg-white/5 border border-white/5'
        }`}>
          {row.status}
        </span>
      ),
      className: 'w-20',
    },
    {
      header: 'Actions',
      accessor: (row: GalleryImage) => (
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
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Image Gallery Portfolio</h2>
          <p className="text-xs text-muted font-sans font-light mt-1">Upload and catalog makeovers, nails, hair treatments for public portfolio</p>
        </div>

        <button
          onClick={handleOpenUploadModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
        >
          <Upload className="w-4.5 h-4.5" />
          <span>Upload Portfolio</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between gap-4 font-sans items-center">
        <div className="flex items-center gap-3 w-full sm:w-auto">
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

        {/* Bulk Delete button */}
        {selectedIds.length > 0 && (
          <button
            onClick={() => setIsBulkDeleteOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-red-950/40 text-red-400 hover:bg-red-900/35 border border-red-500/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected ({selectedIds.length})</span>
          </button>
        )}
      </div>

      {/* Table grid */}
      <div className="bg-[#0e0e0e]/50 border border-white/5 rounded-3xl p-6 sm:p-8">
        <Table
          columns={columns}
          data={images}
          isLoading={isLoading}
          selectedIds={selectedIds}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          rowIdAccessor={(row) => row.id}
          currentPage={page}
          lastPage={totalPages}
          total={totalItems}
          onPageChange={setPage}
          emptyMessage="No portfolio images uploaded."
        />
      </div>

      {/* Multiple Image Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Portfolio Photos (Bulk)"
        size="lg"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-5 font-sans">
          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Portfolio Category *</label>
            <select
              required
              value={uploadFormData.category_id}
              onChange={(e) => setUploadFormData({ ...uploadFormData, category_id: e.target.value })}
              className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm cursor-pointer"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">General Title (optional)</label>
              <input
                type="text"
                value={uploadFormData.title}
                onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                placeholder="e.g. Royal Gujarati Bride"
                className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
              />
            </div>
            
            {/* Alt text */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">SEO Alt Text</label>
              <input
                type="text"
                value={uploadFormData.alt_text}
                onChange={(e) => setUploadFormData({ ...uploadFormData, alt_text: e.target.value })}
                placeholder="Description for accessibility"
                className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Display Order</label>
              <input
                type="number"
                value={uploadFormData.display_order}
                onChange={(e) => setUploadFormData({ ...uploadFormData, display_order: parseInt(e.target.value) || 0 })}
                className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Status</label>
              <select
                value={uploadFormData.status}
                onChange={(e) => setUploadFormData({ ...uploadFormData, status: e.target.value as any })}
                className="px-3 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-xs cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-2 select-none justify-center pt-5 cursor-pointer">
              <input
                id="feat_gal"
                type="checkbox"
                checked={uploadFormData.featured}
                onChange={(e) => setUploadFormData({ ...uploadFormData, featured: e.target.checked })}
                className="w-4.5 h-4.5 accent-primary border-white/20 bg-dark rounded focus:ring-primary cursor-pointer"
              />
              <label htmlFor="feat_gal" className="text-xs font-sans text-muted cursor-pointer font-bold uppercase tracking-wider">
                Featured
              </label>
            </div>
          </div>

          {/* Files Upload drag-drop Selector */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Choose Image Files *</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-white/10 hover:border-primary/40 hover:bg-white/[0.01] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Upload className="w-8 h-8 text-primary mb-2" />
              <span className="text-xs text-white/90 font-semibold">Select files or drop here</span>
              <span className="text-[10px] text-muted font-light mt-0.5">Supports PNG, JPG, JPEG up to 4MB each</span>
            </div>

            {/* Selected files preview */}
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-4 gap-3 max-h-36 overflow-y-auto mt-2 bg-dark/45 p-3 rounded-xl border border-white/5">
                {selectedFiles.map((file, index) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-white/5 bg-secondary group">
                      <img src={url} alt="Pre-upload" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-red-600 rounded-lg text-white/90 cursor-pointer shadow-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/5 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitLoading}
              className="flex-1 py-3 px-4 bg-primary hover:bg-peacock disabled:bg-primary/50 text-black hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitLoading ? 'Uploading...' : `Upload ${selectedFiles.length} Images`}
            </button>
          </div>

        </form>
      </Modal>

      {/* Edit Form Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Portfolio Image Details"
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-5 font-sans">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Portfolio Category *</label>
            <select
              required
              value={editFormData.category_id}
              onChange={(e) => setEditFormData({ ...editFormData, category_id: e.target.value })}
              className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Image Title</label>
            <input
              type="text"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Alt Text</label>
            <input
              type="text"
              value={editFormData.alt_text}
              onChange={(e) => setEditFormData({ ...editFormData, alt_text: e.target.value })}
              className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Display Order</label>
              <input
                type="number"
                value={editFormData.display_order}
                onChange={(e) => setEditFormData({ ...editFormData, display_order: parseInt(e.target.value) || 0 })}
                className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Status</label>
              <select
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                className="px-3 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-xs cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-2 select-none justify-center pt-5 cursor-pointer">
              <input
                id="edit_feat"
                type="checkbox"
                checked={editFormData.featured}
                onChange={(e) => setEditFormData({ ...editFormData, featured: e.target.checked })}
                className="w-4.5 h-4.5 accent-primary border-white/20 bg-dark rounded focus:ring-primary cursor-pointer"
              />
              <label htmlFor="edit_feat" className="text-xs font-sans text-muted cursor-pointer font-bold uppercase tracking-wider">
                Featured
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-grow py-3 px-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/5 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitLoading}
              className="flex-grow py-3 px-4 bg-primary hover:bg-peacock disabled:bg-primary/50 text-black hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Single confirm */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Image"
        message="Are you sure you want to delete this portfolio image?"
        isLoading={isDeleteLoading}
      />

      {/* Delete Bulk Confirm */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Images"
        message={`Are you sure you want to delete the ${selectedIds.length} selected images?`}
        isLoading={isDeleteLoading}
      />

      {currentCropFile && croppingImageSrc && (
        <ImageCropper
          imageSrc={croppingImageSrc}
          aspectRatio={3 / 4}
          fileName={currentCropFile.name}
          onCrop={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

    </div>
  );
};

export default GalleryCRUD;
