import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

interface MediaFile {
  name: string;
  path: string;
  url: string;
  size: number;
  mime_type: string;
  last_modified: string;
}

interface MediaManagerProps {
  onSelect?: (url: string) => void;
  onClose?: () => void;
  isModalMode?: boolean;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  onSelect,
  isModalMode = false,
}) => {
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all media items
  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/media');
      if (response.data.success) {
        setMediaList(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load media gallery.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Format bytes
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Upload handler
  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image uploads are supported.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Max file size is 50MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response = await api.post('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        toast.success('Image uploaded successfully.');
        fetchMedia();
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to upload image.';
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Delete image
  const handleDelete = async (e: React.MouseEvent, path: string) => {
    e.stopPropagation(); // Prevent select trigger
    if (!window.confirm('Are you sure you want to delete this media file permanently?')) {
      return;
    }

    try {
      const response = await api.post('/media/delete', { path });
      if (response.data.success) {
        toast.success('File deleted.');
        setMediaList((prev) => prev.filter((item) => item.path !== path));
      }
    } catch (error) {
      toast.error('Failed to delete media file.');
    }
  };

  return (
    <div className={`flex flex-col bg-secondary border border-white/5 rounded-3xl ${isModalMode ? 'p-1' : 'p-6 sm:p-8'} h-full max-h-[85vh]`}>
      
      {/* Upload Drag Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          dragActive 
            ? 'border-primary bg-primary/10 text-primary' 
            : 'border-white/10 hover:border-primary/45 hover:bg-white/[0.01] text-muted'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-xs font-sans text-primary uppercase font-bold tracking-wider">Uploading file...</p>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-primary mb-3" />
            <p className="text-sm font-sans font-semibold text-white/90">Drag & drop your image here, or click to browse</p>
            <p className="text-xs text-muted font-sans font-light mt-1.5">Supports PNG, JPG, JPEG, WEBP up to 5MB</p>
          </>
        )}
      </div>

      {/* Media Gallery Grid */}
      <div className="flex-grow overflow-y-auto mt-8 pr-1 min-h-[250px]">
        <h4 className="text-xs font-sans font-extrabold uppercase tracking-widest text-primary mb-4 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4" />
          <span>Media Library</span>
        </h4>

        {isLoading ? (
          // Grid loading skeleton
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : mediaList.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center text-center py-16 text-muted border border-white/5 rounded-2xl bg-dark/20">
            <AlertCircle className="w-8 h-8 text-white/10 mb-2" />
            <p className="text-sm font-sans font-light">No media uploads found in library.</p>
          </div>
        ) : (
          // Image Grid
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaList.map((media) => (
              <div
                key={media.path}
                onClick={() => onSelect && onSelect(media.url)}
                className={`group relative aspect-square bg-[#050505] border border-white/5 rounded-xl overflow-hidden shadow-md cursor-pointer transition-all ${
                  onSelect ? 'hover:scale-[1.03] hover:border-primary gold-glow-hover' : ''
                }`}
              >
                {/* Thumbnail */}
                <img
                  src={media.url}
                  alt={media.name}
                  className="w-full h-full object-cover select-none"
                  loading="lazy"
                />

                {/* Hover overlay with details */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                  <p className="text-[10px] text-white truncate font-sans font-semibold">{media.name}</p>
                  <p className="text-[9px] text-primary font-sans mt-0.5">{formatBytes(media.size)}</p>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, media.path)}
                  className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 hover:text-white text-muted opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManager;
