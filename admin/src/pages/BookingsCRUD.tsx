import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, Eye, Trash2, Clock } from 'lucide-react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { toast } from 'sonner';

interface Booking {
  id: number;
  name: string;
  mobile: string;
  email: string | null;
  city: string | null;
  service: string;
  preferred_date: string;
  preferred_time: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

const BookingsCRUD: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering & Pager
  const [search, setSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Bulk options
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/bookings', {
        params: {
          page,
          search,
          status: selectedStatusFilter,
          date_from: dateFrom,
          date_to: dateTo,
          sort_by: sortBy,
          sort_order: sortOrder,
        }
      });
      if (response.data.success) {
        setBookings(response.data.data.data);
        setTotalPages(response.data.data.last_page);
        setTotalItems(response.data.data.total);
      }
    } catch (error) {
      toast.error('Failed to load bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBookings();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [page, search, selectedStatusFilter, dateFrom, dateTo, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(bookings.map(b => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await api.put(`/bookings/${id}/status`, { status: newStatus });
      if (response.data.success) {
        toast.success('Booking status updated.');
        
        // Update local state if details modal is open
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus as any });
        }
        
        fetchBookings();
      }
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    try {
      const response = await api.post('/bookings/bulk-status', { ids: selectedIds, status });
      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedIds([]);
        fetchBookings();
      }
    } catch (error) {
      toast.error('Bulk status update failed.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      const response = await api.delete(`/bookings/${deleteId}`);
      if (response.data.success) {
        toast.success('Inquiry deleted.');
        setDeleteId(null);
        fetchBookings();
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
      const response = await api.post('/bookings/bulk-delete', { ids: selectedIds });
      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedIds([]);
        setIsBulkDeleteOpen(false);
        fetchBookings();
      }
    } catch (error) {
      toast.error('Bulk deletion failed.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // CSV Export Handler using Blobs
  const handleExportCsv = async () => {
    try {
      toast.loading('Preparing CSV export...', { id: 'csv-export' });
      const response = await api.get('/bookings/export', {
        params: {
          search,
          status: selectedStatusFilter,
          date_from: dateFrom,
          date_to: dateTo,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
        responseType: 'blob', // Tell Axios to treat output as file stream
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `radhe_bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.dismiss('csv-export');
      toast.success('CSV Export downloaded successfully.');
    } catch (error) {
      toast.dismiss('csv-export');
      toast.error('Failed to export CSV report.');
    }
  };

  const statusColors = {
    new: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    contacted: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    confirmed: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    completed: 'text-green-400 bg-green-500/10 border-green-500/20',
    cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const columns = [
    {
      header: 'Full Name',
      accessor: 'name',
      sortable: true,
      sortKey: 'name',
      className: 'font-semibold',
    },
    {
      header: 'Contact Info',
      accessor: (row: Booking) => (
        <div className="flex flex-col gap-0.5 text-xs">
          <span>{row.mobile}</span>
          <span className="text-[11px] text-muted">{row.email || '-'}</span>
        </div>
      ),
    },
    {
      header: 'City',
      accessor: 'city',
      className: 'text-xs text-muted/95',
    },
    {
      header: 'Service Required',
      accessor: (row: Booking) => (
        <span className="font-medium text-white/90 capitalize">{row.service.replace(/-/g, ' ')}</span>
      ),
    },
    {
      header: 'Preferred Schedule',
      accessor: (row: Booking) => (
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="font-semibold text-white/90">{row.preferred_date}</span>
          <span className="text-[10px] text-muted flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" />
            <span>{row.preferred_time || 'Not specified'}</span>
          </span>
        </div>
      ),
      sortable: true,
      sortKey: 'preferred_date',
    },
    {
      header: 'Status',
      accessor: (row: Booking) => (
        <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-widest ${
          statusColors[row.status]
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
      accessor: (row: Booking) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedBooking(row)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-primary/20 text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
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
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Booked Sessions</h2>
          <p className="text-xs text-muted font-sans font-light mt-1">Review and manage salon appointments and academy admission requests</p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
        >
          <FileSpreadsheet className="w-4.5 h-4.5" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter and Bulk Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between gap-4 font-sans items-center">
        
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-56">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search bookings..."
              className="w-full pl-9 pr-4 py-2 bg-[#050505] border border-white/10 hover:border-white/20 focus:border-primary text-white outline-none rounded-xl text-xs"
            />
          </div>

          {/* Status */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => { setSelectedStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-[#050505] border border-white/10 text-white rounded-xl text-xs cursor-pointer focus:border-primary outline-none"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date Range */}
          <div className="flex items-center gap-1 text-xs">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="px-3 py-1.5 bg-[#050505] border border-white/10 text-white rounded-xl text-xs"
            />
            <span className="text-muted">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="px-3 py-1.5 bg-[#050505] border border-white/10 text-white rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Bulk Selection Operations */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl text-xs w-full md:w-auto justify-between">
            <span className="font-bold text-primary">{selectedIds.length} Selected</span>
            <div className="flex items-center gap-1.5">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusUpdate(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-2 py-1 bg-dark border border-white/10 text-white rounded-lg text-[10px] font-bold cursor-pointer"
              >
                <option value="">Update Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

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

      {/* Bookings Table */}
      <div className="bg-[#0e0e0e]/50 border border-white/5 rounded-3xl p-6 sm:p-8">
        <Table
          columns={columns}
          data={bookings}
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
          emptyMessage="No booking requests matching these filters."
        />
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={selectedBooking !== null}
        onClose={() => setSelectedBooking(null)}
        title="Booking Request Details"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-6 font-sans text-sm">
            <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Full Name</p>
                <p className="font-bold text-white mt-1">{selectedBooking.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">City / Area</p>
                <p className="font-bold text-white mt-1">{selectedBooking.city || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Mobile Number</p>
                <a href={`tel:${selectedBooking.mobile}`} className="font-bold text-primary hover:underline mt-1 block">
                  {selectedBooking.mobile}
                </a>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Email Address</p>
                {selectedBooking.email ? (
                  <a href={`mailto:${selectedBooking.email}`} className="font-bold text-primary hover:underline mt-1 block">
                    {selectedBooking.email}
                  </a>
                ) : (
                  <p className="text-muted mt-1">-</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Selected Service / Course</p>
                <p className="font-bold text-white capitalize mt-1">{selectedBooking.service.replace(/-/g, ' ')}</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Submission Date</p>
                <p className="font-bold text-white mt-1">{new Date(selectedBooking.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Preferred Date</p>
                <p className="font-bold text-white mt-1">{selectedBooking.preferred_date}</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Preferred Time</p>
                <p className="font-bold text-white mt-1">{selectedBooking.preferred_time || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary mb-1">Message / Notes</p>
              <div className="bg-[#050505] p-4 rounded-xl border border-white/5 text-muted leading-relaxed font-light">
                {selectedBooking.message || 'No special requirements detailed.'}
              </div>
            </div>

            {/* Status switcher action */}
            <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Switch Inquiry Status</label>
              <div className="flex flex-wrap gap-2">
                {['new', 'contacted', 'confirmed', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedBooking.id, st)}
                    className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                      selectedBooking.status === st
                        ? statusColors[st as keyof typeof statusColors] + ' scale-105 border-primary/60'
                        : 'bg-transparent text-muted hover:text-white border-white/5 hover:bg-white/5'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer close button */}
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/5 cursor-pointer text-center"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Single confirm */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Inquiry Request"
        message="Are you sure you want to remove this booking request from the archive?"
        isLoading={isDeleteLoading}
      />

      {/* Delete Bulk Confirm */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Inquiries"
        message={`Are you sure you want to delete the ${selectedIds.length} selected booking requests permanently?`}
        isLoading={isDeleteLoading}
      />

    </div>
  );
};

export default BookingsCRUD;
