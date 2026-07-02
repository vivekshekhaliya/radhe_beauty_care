import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, PlusCircle, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import MediaManager from '../components/MediaManager';
import { toast } from 'sonner';

interface Course {
  id: number;
  title: string;
  subtitle: string | null;
  course_image: string | null;
  description: string | null;
  price: number;
  duration: string | null;
  what_you_will_learn: string[] | null;
  certificate_available: boolean;
  featured: boolean;
  status: 'active' | 'inactive';
  created_at: string;
}

const AcademyCRUD: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Table state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Media Modal state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'course_image' | null>(null);

  // Dynamic Repeater list of syllabus points
  const [learningPoints, setLearningPoints] = useState<string[]>(['']);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    course_image: '',
    description: '',
    price: 0,
    duration: '',
    certificate_available: true,
    featured: false,
    status: 'active' as 'active' | 'inactive',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/academy-courses', {
        params: { page }
      });
      if (response.data.success) {
        setCourses(response.data.data.data);
        setTotalPages(response.data.data.last_page);
        setTotalItems(response.data.data.total);
      }
    } catch (error) {
      toast.error('Failed to load academy courses.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page]);

  // Repeater handlers
  const handleAddPoint = () => {
    setLearningPoints([...learningPoints, '']);
  };

  const handleRemovePoint = (index: number) => {
    const updated = learningPoints.filter((_, idx) => idx !== index);
    setLearningPoints(updated.length > 0 ? updated : ['']);
  };

  const handlePointChange = (index: number, val: string) => {
    const updated = [...learningPoints];
    updated[index] = val;
    setLearningPoints(updated);
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({
      title: '',
      subtitle: '',
      course_image: '',
      description: '',
      price: 0,
      duration: '',
      certificate_available: true,
      featured: false,
      status: 'active',
    });
    setLearningPoints(['']);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditId(course.id);
    setFormData({
      title: course.title,
      subtitle: course.subtitle || '',
      course_image: course.course_image || '',
      description: course.description || '',
      price: course.price,
      duration: course.duration || '',
      certificate_available: course.certificate_available,
      featured: course.featured,
      status: course.status,
    });
    setLearningPoints(course.what_you_will_learn && course.what_you_will_learn.length > 0 ? [...course.what_you_will_learn] : ['']);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (formData.price < 0) errors.price = 'Price must be 0 or positive.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Filter out blank inputs
    const filteredPoints = learningPoints.filter(item => item.trim() !== '');

    setIsSubmitLoading(true);
    const payload = {
      ...formData,
      what_you_will_learn: JSON.stringify(filteredPoints)
    };

    try {
      if (editId) {
        const response = await api.post(`/academy-courses/${editId}`, payload);
        if (response.data.success) {
          toast.success('Course details updated.');
          setIsModalOpen(false);
          fetchCourses();
        }
      } else {
        const response = await api.post('/academy-courses', payload);
        if (response.data.success) {
          toast.success('Academy course created.');
          setIsModalOpen(false);
          fetchCourses();
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
      const response = await api.delete(`/academy-courses/${deleteId}`);
      if (response.data.success) {
        toast.success('Course deleted successfully.');
        setDeleteId(null);
        fetchCourses();
      }
    } catch (error) {
      toast.error('Failed to delete course.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleSelectMedia = (url: string) => {
    if (mediaTarget === 'course_image') {
      setFormData({ ...formData, course_image: url });
    }
    setIsMediaModalOpen(false);
    setMediaTarget(null);
  };

  const columns = [
    {
      header: 'Image',
      accessor: (row: Course) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-dark flex items-center justify-center shrink-0">
          {row.course_image ? (
            <img
              src={row.course_image.startsWith('http') ? row.course_image : `http://localhost:8000/storage/${row.course_image}`}
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
      header: 'Course Title',
      accessor: 'title',
      className: 'font-semibold',
    },
    {
      header: 'Price',
      accessor: (row: Course) => `₹${Number(row.price).toLocaleString()}`,
      className: 'font-mono text-xs text-primary',
    },
    {
      header: 'Duration',
      accessor: 'duration',
      className: 'text-muted text-xs',
    },
    {
      header: 'Certificate',
      accessor: (row: Course) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${row.certificate_available
            ? 'text-green-400 bg-green-500/10 border border-green-500/10'
            : 'text-muted bg-white/5 border border-white/5'
          }`}>
          {row.certificate_available ? 'Available' : 'No'}
        </span>
      ),
      className: 'w-24 text-center',
    },
    {
      header: 'Featured',
      accessor: (row: Course) => (
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
      accessor: (row: Course) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.status === 'active'
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
      accessor: (row: Course) => (
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
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Academy Courses</h2>
          <p className="text-xs text-muted font-sans font-light mt-1">Manage vocational beauty school courses, curriculums, and certifications</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Course</span>
        </button>
      </div>

      <div className="bg-[#0e0e0e]/50 border border-white/5 rounded-3xl p-4 sm:p-6">
        <Table
          columns={columns}
          data={courses}
          isLoading={isLoading}
          currentPage={page}
          lastPage={totalPages}
          total={totalItems}
          onPageChange={setPage}
          emptyMessage="No academy courses created yet."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? 'Edit Course' : 'Add Academy Course'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5 font-sans">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">

              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Course Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Master Professional Makeup Course"
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                />
                {formErrors.title && <span className="text-red-500 text-xs mt-1 font-semibold">{formErrors.title}</span>}
              </div>

              {/* Subtitle */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Sub Title / Tagline</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Go from beginner to certified beauty specialist"
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                />
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Tuition Fee (INR) *</label>
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
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Duration (e.g. 6 Weeks)</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 6 Weeks (Daily 3 Hours)"
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Status & Featured & Certificate Switches */}
              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="px-3 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-xs cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 select-none pt-5 justify-center cursor-pointer">
                  <input
                    id="feat_course"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4.5 h-4.5 accent-primary border-white/20 bg-dark rounded focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="feat_course" className="text-[10px] font-sans text-muted cursor-pointer font-bold uppercase tracking-wider">
                    Featured
                  </label>
                </div>

                <div className="flex items-center gap-1.5 select-none pt-5 justify-center cursor-pointer">
                  <input
                    id="cert_avail"
                    type="checkbox"
                    checked={formData.certificate_available}
                    onChange={(e) => setFormData({ ...formData, certificate_available: e.target.checked })}
                    className="w-4.5 h-4.5 accent-primary border-white/20 bg-dark rounded focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="cert_avail" className="text-[10px] font-sans text-muted cursor-pointer font-bold uppercase tracking-wider">
                    Certificate
                  </label>
                </div>
              </div>

              {/* Course Thumbnail Image */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Course Banner / Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.course_image}
                    onChange={(e) => setFormData({ ...formData, course_image: e.target.value })}
                    placeholder="Course image path or URL..."
                    className="flex-grow px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTarget('course_image');
                      setIsMediaModalOpen(true);
                    }}
                    className="px-4 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-4.5 h-4.5" />
                    <span>Choose</span>
                  </button>
                </div>
                {formData.course_image && (
                  <div className="mt-2 w-36 aspect-[4/3] rounded-lg overflow-hidden border border-white/10 bg-dark relative group">
                    <img
                      src={formData.course_image.startsWith('http') ? formData.course_image : `http://localhost:8000/storage/${formData.course_image}`}
                      alt="Course Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, course_image: '' })}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 text-xs font-sans font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Description & Syllabus */}
            <div className="space-y-5">

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Course Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline the course curriculum summary..."
                  rows={4}
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm resize-none"
                />
              </div>

              {/* Syllabus points */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Syllabus Chapters / Syllabus Points</label>
                  <button
                    type="button"
                    onClick={handleAddPoint}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-accent transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add point</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {learningPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handlePointChange(index, e.target.value)}
                        placeholder={`Topic #${index + 1} (e.g. Skin preparation & color theory)`}
                        className="flex-grow px-4 py-2.5 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(index)}
                        className="p-2.5 bg-red-950/20 hover:bg-red-900/35 border border-red-500/10 text-red-400 rounded-xl transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Form Actions */}
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
              {isSubmitLoading ? 'Saving...' : 'Save Course'}
            </button>
          </div>

        </form>
      </Modal>

      {/* Media Modal */}
      <Modal
        isOpen={isMediaModalOpen}
        onClose={() => { setIsMediaModalOpen(false); setMediaTarget(null); }}
        title="Select Media Asset"
        size="2xl"
      >
        <MediaManager onSelect={handleSelectMedia} isModalMode={true} />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Course"
        message="Are you sure you want to delete this course from the academy catalog permanently?"
        isLoading={isDeleteLoading}
      />

    </div>
  );
};

export default AcademyCRUD;
