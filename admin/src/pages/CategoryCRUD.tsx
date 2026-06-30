import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: 'active' | 'inactive';
  display_order: number;
  created_at: string;
}

const CategoryCRUD: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  
  // Table state
  const [sortBy, setSortBy] = useState('display_order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    display_order: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/categories', {
        params: {
          page,
          sort_by: sortBy,
          sort_order: sortOrder,
        }
      });
      if (response.data.success) {
        setCategories(response.data.data.data);
        setTotalPages(response.data.data.last_page);
        setTotalItems(response.data.data.total);
      }
    } catch (error) {
      toast.error('Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      status: 'active',
      display_order: categories.length + 1,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      status: cat.status,
      display_order: cat.display_order,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required.';
    if (formData.display_order < 0) errors.display_order = 'Display order must be 0 or greater.';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitLoading(true);
    try {
      if (editId) {
        // Update
        const response = await api.put(`/categories/${editId}`, formData);
        if (response.data.success) {
          toast.success('Category updated successfully.');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        // Create
        const response = await api.post('/categories', formData);
        if (response.data.success) {
          toast.success('Category created successfully.');
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
      const response = await api.delete(`/categories/${deleteId}`);
      if (response.data.success) {
        toast.success('Category deleted successfully.');
        setDeleteId(null);
        fetchCategories();
      }
    } catch (error) {
      toast.error('Failed to delete category. Ensure it is not linked to any active services.');
    } finally {
      setIsDeleteLoading(false);
    }
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
      header: 'Category Name',
      accessor: 'name',
      sortable: true,
      sortKey: 'name',
      className: 'font-semibold',
    },
    {
      header: 'Slug',
      accessor: 'slug',
      className: 'text-muted select-all',
    },
    {
      header: 'Description',
      accessor: (row: Category) => (
        <span className="line-clamp-1 max-w-xs">{row.description || '-'}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (row: Category) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.status === 'active' 
            ? 'text-green-400 bg-green-500/10 border border-green-500/10' 
            : 'text-muted bg-white/5 border border-white/5'
        }`}>
          {row.status}
        </span>
      ),
      sortable: true,
      sortKey: 'status',
      className: 'w-24',
    },
    {
      header: 'Actions',
      accessor: (row: Category) => (
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
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Service Categories</h2>
          <p className="text-xs text-muted font-sans font-light mt-1">Manage categories for salon treatment catalog</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Category</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-[#0e0e0e]/50 border border-white/5 rounded-3xl p-6 sm:p-8">
        <Table
          columns={columns}
          data={categories}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder as any}
          onSort={handleSort}
          currentPage={page}
          lastPage={totalPages}
          total={totalItems}
          onPageChange={setPage}
          emptyMessage="No service categories configured yet."
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? 'Edit Category' : 'Create Category'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Skin Care"
              className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
            />
            {formErrors.name && <span className="text-red-500 text-xs mt-1 font-semibold">{formErrors.name}</span>}
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Slug (URL identifier)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. skin-care (Generated if empty)"
              className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
            />
            {formErrors.slug && <span className="text-red-500 text-xs mt-1 font-semibold">{formErrors.slug}</span>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what services belong to this category..."
              rows={3}
              className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Display order */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
              />
              {formErrors.display_order && <span className="text-red-500 text-xs mt-1 font-semibold">{formErrors.display_order}</span>}
            </div>

            {/* Status */}
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

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/5 cursor-pointer"
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category? All nested services will also be affected."
        isLoading={isDeleteLoading}
      />

    </div>
  );
};

export default CategoryCRUD;
