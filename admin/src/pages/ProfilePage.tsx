import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'sonner';
import { Save, Lock, User as UserIcon, Camera, Eye, EyeOff } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  // Profile Details Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Password Change Form State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Profile Photo Change Handler
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Image file must be under 50MB.');
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.name.trim() || !profileData.email.trim()) {
      toast.error('Name and Email are required.');
      return;
    }

    setIsProfileLoading(true);
    setProfileErrors({});

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    if (profilePhoto) {
      formData.append('profile_photo', profilePhoto);
    }

    try {
      const response = await api.post('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        toast.success('Profile details updated successfully.');
        updateUser(response.data.data);
        setProfilePhoto(null);
        setPhotoPreview(null);
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const serverErrors: Record<string, string> = {};
        Object.keys(err.response.data.errors).forEach(key => {
          serverErrors[key] = err.response.data.errors[key][0];
        });
        setProfileErrors(serverErrors);
      } else {
        toast.error('An error occurred during update.');
      }
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});

    if (!passwordData.current_password) {
      setPasswordErrors({ current_password: 'Current password is required.' });
      return;
    }
    if (passwordData.new_password.length < 8) {
      setPasswordErrors({ new_password: 'New password must be at least 8 characters long.' });
      return;
    }
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setPasswordErrors({ new_password_confirmation: 'Passwords do not match.' });
      return;
    }

    setIsPasswordLoading(true);
    try {
      const response = await api.post('/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      });

      if (response.data.success) {
        toast.success('Password changed successfully.');
        setPasswordData({
          current_password: '',
          new_password: '',
          new_password_confirmation: '',
        });
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const serverErrors: Record<string, string> = {};
        Object.keys(err.response.data.errors).forEach(key => {
          serverErrors[key] = err.response.data.errors[key][0];
        });
        setPasswordErrors(serverErrors);
      } else {
        const msg = err.response?.data?.message || 'Incorrect current password.';
        toast.error(msg);
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Account Settings</h2>
        <p className="text-xs text-muted font-sans font-light mt-1">Manage profile information, photo, and login security credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Info Form */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-sm font-serif font-bold text-primary border-b border-white/5 pb-2.5 flex items-center gap-2">
            <UserIcon className="w-4.5 h-4.5" />
            <span>Profile Information</span>
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            {/* Avatar Selector wrapper */}
            <div className="flex items-center gap-5">
              <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-dark flex items-center justify-center shrink-0">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : user?.profile_photo ? (
                  <img 
                    src={user.profile_photo.startsWith('http') ? user.profile_photo : `http://localhost:8000/storage/${user.profile_photo}`} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-serif font-bold text-primary">{user?.name?.charAt(0).toUpperCase()}</span>
                )}
                
                {/* Overlay upload hover */}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white/80 cursor-pointer select-none text-[9px] font-bold uppercase tracking-wider">
                  <Camera className="w-4 h-4 text-primary mb-1" />
                  <span>Update</span>
                  <input
                    type="file"
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <p className="text-xs font-bold text-white/95">Avatar Settings</p>
                <p className="text-[10px] text-muted mt-1 leading-normal font-light">Max size 50MB. Supports PNG, JPG, JPEG, WEBP formats.</p>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Full Name *</label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
              />
              {profileErrors.name && <span className="text-red-500 text-xs mt-1 font-semibold">{profileErrors.name}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Email Address *</label>
              <input
                type="email"
                required
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
              />
              {profileErrors.email && <span className="text-red-500 text-xs mt-1 font-semibold">{profileErrors.email}</span>}
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProfileLoading}
                className="flex items-center gap-1.5 px-6 py-3 bg-primary hover:bg-peacock disabled:bg-primary/50 text-black hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isProfileLoading ? (
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Update Details</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-sm font-serif font-bold text-primary border-b border-white/5 pb-2.5 flex items-center gap-2">
            <Lock className="w-4.5 h-4.5" />
            <span>Update Password</span>
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            {/* Current password */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Current Password *</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-white cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.current_password && (
                <span className="text-red-500 text-xs mt-1 font-semibold">{passwordErrors.current_password}</span>
              )}
            </div>

            {/* New password */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">New Password *</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-white cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.new_password && (
                <span className="text-red-500 text-xs mt-1 font-semibold">{passwordErrors.new_password}</span>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Confirm New Password *</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={passwordData.new_password_confirmation}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                  placeholder="Re-type new password"
                  className="w-full px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-white cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.new_password_confirmation && (
                <span className="text-red-500 text-xs mt-1 font-semibold">{passwordErrors.new_password_confirmation}</span>
              )}
            </div>

            {/* Change Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPasswordLoading}
                className="flex items-center gap-1.5 px-6 py-3 bg-primary hover:bg-peacock disabled:bg-primary/50 text-black hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isPasswordLoading ? (
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>Change Password</span>
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
