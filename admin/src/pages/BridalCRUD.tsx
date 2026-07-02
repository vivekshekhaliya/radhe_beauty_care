import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, PlusCircle } from 'lucide-react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { toast } from 'sonner';

interface Package {
  id: number;
  title: string;
  price: number;
  description: string | null;
  benefits: string[] | null;
  featured: boolean;
  display_order: number;
  status: 'active' | 'inactive';
  created_at: string;
}

const BridalCRUD: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
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

  // Dynamic Repeater list of benefits
  const [benefitsList, setBenefitsList] = useState<string[]>(['']);

  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    description: '',
    featured: false,
    display_order: 0,
    status: 'active' as 'active' | 'inactive',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/bridal-packages', {
        params: {
          page,
          sort_by: sortBy,
          sort_order: sortOrder,
        }
      });
      if (response.data.success) {
        setPackages(response.data.data.data);
        setTotalPages(response.data.data.last_page);
        setTotalItems(response.data.data.total);
      }
    } catch (error) {
      toast.error('Failed to load bridal packages.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
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

  // Repeater handlers
  const handleAddBenefit = () => {
    setBenefitsList([...benefitsList, '']);
  };

  const handleRemoveBenefit = (index: number) => {
    const updated = benefitsList.filter((_, idx) => idx !== index);
    setBenefitsList(updated.length > 0 ? updated : ['']);
  };

  const handleBenefitChange = (index: number, val: string) => {
    const updated = [...benefitsList];
    updated[index] = val;
    setBenefitsList(updated);
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({
      title: '',
      price: 0,
      description: '',
      featured: false,
      display_order: packages.length + 1,
      status: 'active',
    });
    setBenefitsList(['']);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg: Package) => {
    setEditId(pkg.id);
    setFormData({
      title: pkg.title,
      price: pkg.price,
      description: pkg.description || '',
      featured: pkg.featured,
      display_order: pkg.display_order,
      status: pkg.status,
    });
    setBenefitsList(pkg.benefits && pkg.benefits.length > 0 ? [...pkg.benefits] : ['']);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (formData.price < 0) errors.price = 'Price must be 0 or positive.';
    if (formData.display_order < 0) errors.display_order = 'Order must be 0 or positive.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Filter out blank inputs
    const filteredBenefits = benefitsList.filter(item => item.trim() !== '');

    setIsSubmitLoading(true);
    const payload = {
      ...formData,
      benefits: JSON.stringify(filteredBenefits) // send as JSON string
    };

    try {
      if (editId) {
        const response = await api.put(`/bridal-packages/${editId}`, payload);
        if (response.data.success) {
          toast.success('Bridal package updated.');
          setIsModalOpen(false);
          fetchPackages();
        }
      } else {
        const response = await api.post('/bridal-packages', payload);
        if (response.data.success) {
          toast.success('Bridal package created.');
          setIsModalOpen(false);
          fetchPackages();
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
        toast.error('An error occurred.');
      }
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      const response = await api.delete(`/bridal-packages/${deleteId}`);
      if (response.data.success) {
        toast.success('Package deleted successfully.');
        setDeleteId(null);
        fetchPackages();
      }
    } catch (error) {
      toast.error('Failed to delete package.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const columns = [
    {
      header: 'Order',
      accessor: 'display_order',
      sortable: true,
      sortKey: 'display_order',
      className: 'w-16 text-center',
    },
    {
      header: 'Package Title',
      accessor: 'title',
      sortable: true,
      sortKey: 'title',
      className: 'font-semibold',
    },
    {
      header: 'Price',
      accessor: (row: Package) => `₹${Number(row.price).toLocaleString()}`,
      sortable: true,
      sortKey: 'price',
      className: 'font-mono text-xs text-primary',
    },
    {
      header: 'Benefits (Count)',
      accessor: (row: Package) => `${row.benefits?.length || 0} benefits`,
      className: 'text-muted text-xs',
    },
    {
      header: 'Featured',
      accessor: (row: Package) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${row.featured
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
      accessor: (row: Package) => (
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
      accessor: (row: Package) => (
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
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Bridal Packages</h2>
          <p className="text-xs text-muted font-sans font-light mt-1">Configure pricing, details, and features for wedding makeover plans</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Package</span>
        </button>
      </div>

      <div className="bg-[#0e0e0e]/50 border border-white/5 rounded-3xl p-4 sm:p-6">
        <Table
          columns={columns}
          data={packages}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder as any}
          onSort={handleSort}
          currentPage={page}
          lastPage={totalPages}
          total={totalItems}
          onPageChange={setPage}
          emptyMessage="No bridal packages defined yet."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? 'Edit Package' : 'Create Bridal Package'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5 font-sans">

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Package Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Signature Classic Bridal"
              className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
            />
            {formErrors.title && <span className="text-red-500 text-xs mt-1 font-semibold">{formErrors.title}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Price (INR) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
              />
              {formErrors.price && <span className="text-red-500 text-xs mt-1 font-semibold">{formErrors.price}</span>}
            </div>

            {/* Display Order */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Short Summary Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this package's look and feel..."
              rows={2}
              className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm resize-none"
            />
          </div>

          {/* Status & Featured */}
          <div className="grid grid-cols-2 gap-4">
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

            <div className="flex items-center gap-2 select-none pt-5 pl-4 cursor-pointer">
              <input
                id="feat_pkg"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4.5 h-4.5 accent-primary border-white/20 bg-dark rounded focus:ring-primary cursor-pointer"
              />
              <label htmlFor="feat_pkg" className="text-xs font-sans text-muted cursor-pointer font-bold uppercase tracking-wider">
                Featured Package
              </label>
            </div>
          </div>

          {/* Benefits Repeater */}
          <div className="flex flex-col gap-3.5 border-t border-white/5 pt-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Included Benefits (Dynamic Inclusions)</label>
              <button
                type="button"
                onClick={handleAddBenefit}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-accent transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Point</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {benefitsList.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder={`Inclusion Point #${index + 1} (e.g. Premium HD base products)`}
                    className="flex-grow px-4 py-2.5 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(index)}
                    className="p-2.5 bg-red-950/20 hover:bg-red-900/35 border border-red-500/10 text-red-400 rounded-xl transition-all cursor-pointer hover:text-white"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-5 border-t border-white/5">
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
              {isSubmitLoading ? 'Saving...' : 'Save Package'}
            </button>
          </div>

        </form>
      </Modal>

      {/* Delete Single package confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Bridal Package"
        message="Are you sure you want to delete this bridal package? This action is permanent."
        isLoading={isDeleteLoading}
      />

    </div>
  );
};

export default BridalCRUD;
