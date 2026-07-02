import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { toast } from 'sonner';

interface GalleryCategory {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  status: 'active' | 'inactive';
  created_at: string;
}

const GalleryCategoryCRUD: React.FC = () => {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Table state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    display_order: 0,
    status: 'active' as 'active' | 'inactive',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/gallery-categories', {
        params: { page }
      });
      if (response.data.success) {
        setCategories(response.data.data.data);
        setTotalPages(response.data.data.last_page);
        setTotalItems(response.data.data.total);
      }
    } catch (error) {
      toast.error('Failed to load gallery categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({
      name: '',
      slug: '',
      display_order: categories.length + 1,
      status: 'active',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: GalleryCategory) => {
    setEditId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      display_order: cat.display_order,
      status: cat.status,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required.';
    if (formData.display_order < 0) errors.display_order = 'Display order must be 0 or positive.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitLoading(true);
    try {
      if (editId) {
        const response = await api.put(`/gallery-categories/${editId}`, formData);
        if (response.data.success) {
          toast.success('Gallery category updated successfully.');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const response = await api.post('/gallery-categories', formData);
        if (response.data.success) {
          toast.success('Gallery category created successfully.');
          setIsModalOpen(false);
          fetchCategories();
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
      const response = await api.delete(`/gallery-categories/${deleteId}`);
      if (response.data.success) {
        toast.success('Category deleted successfully.');
        setDeleteId(null);
        fetchCategories();
      }
    } catch (error) {
      toast.error('Failed to delete category. Ensure it is not linked to any active gallery items.');
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
      header: 'Category Name',
      accessor: 'name',
      className: 'font-semibold',
    },
    {
      header: 'Slug',
      accessor: 'slug',
      className: 'text-muted select-all',
    },
    {
      header: 'Status',
      accessor: (row: GalleryCategory) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.status === 'active'
            ? 'text-green-400 bg-green-500/10 border border-green-500/10'
            : 'text-muted bg-white/5 border border-white/5'
          }`}>
          {row.status}
        </span>
      ),
      className: 'w-24',
    },
    {
      header: 'Actions',
      accessor: (row: GalleryCategory) => (
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Gallery Categories</h2>
          <p className="text-xs text-muted font-sans font-light mt-1">Manage categories for image portfolio showcase</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Category</span>
        </button>
      </div>

      <div className="bg-[#0e0e0e]/50 border border-white/5 rounded-3xl p-4 sm:p-6">
        <Table
          columns={columns}
          data={categories}
          isLoading={isLoading}
          currentPage={page}
          lastPage={totalPages}
          total={totalItems}
          onPageChange={setPage}
          emptyMessage="No gallery categories configured yet."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? 'Edit Category' : 'Create Gallery Category'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5 font-sans">

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Category Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Bridal Makeover"
              className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
            />
            {formErrors.name && <span className="text-red-500 text-xs mt-1 font-semibold">{formErrors.name}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Slug (URL identifier)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. bridal-makeover (Generated if empty)"
              className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
            />
            {formErrors.slug && <span className="text-red-500 text-xs mt-1 font-semibold">{formErrors.slug}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Display Order</label>
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
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/5 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitLoading}
              className="flex-1 py-3 px-4 bg-primary hover:bg-peacock disabled:bg-primary/50 text-black hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitLoading ? 'Saving...' : 'Save Category'}
            </button>
          </div>

        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Gallery Category"
        message="Are you sure you want to delete this gallery category? Linked images will also be removed."
        isLoading={isDeleteLoading}
      />

    </div>
  );
};

export default GalleryCategoryCRUD;
