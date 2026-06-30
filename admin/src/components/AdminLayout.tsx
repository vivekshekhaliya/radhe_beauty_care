import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from "../assets/IMG_4497.PNG";
import {
  LayoutDashboard,
  Sparkles,
  Tags,
  Heart,
  GraduationCap,
  FolderHeart,
  Image as ImageIcon,
  CalendarDays,
  Settings as SettingsIcon,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Sidebar navigation menu items
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Service Categories', path: '/categories', icon: Tags },
    { name: 'Services', path: '/services', icon: Sparkles },
    { name: 'Bridal Packages', path: '/bridal-packages', icon: Heart },
    { name: 'Beauty Academy', path: '/academy', icon: GraduationCap },
    { name: 'Gallery Categories', path: '/gallery-categories', icon: FolderHeart },
    { name: 'Gallery Portfolio', path: '/gallery', icon: ImageIcon },
    { name: 'Booked Sessions', path: '/bookings', icon: CalendarDays },
    { name: 'Website Settings', path: '/settings', icon: SettingsIcon },
    { name: 'Profile Settings', path: '/profile', icon: UserIcon },
  ];

  // Helper to generate Breadcrumb label from pathname
  const getBreadcrumbs = () => {
    const path = location.pathname.substring(1);
    if (!path) return ['Dashboard'];

    // Capitalize and format path segments
    return path.split('/').map(segment => {
      // replace dashes with spaces
      const formatted = segment.replace(/-/g, ' ');
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-dark text-white font-sans flex relative">

      {/* 1. Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden cursor-pointer"
        />
      )}

      {/* 2. Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-secondary border-r border-white/5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:sticky lg:h-screen shrink-0`}>

        {/* Sidebar Header & Brand Logo */}
        <div>
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2.5 group min-w-0">
              <img src={logoImg} className="w-9 h-9 rounded-full object-cover border border-primary/30 shrink-0" alt="Logo" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-primary uppercase font-extrabold tracking-wider font-sans group-hover:text-accent transition-colors truncate">
                  Radhe Beauty Care
                </span>
                <span className="text-xs font-serif font-bold text-slate-700 tracking-wide mt-0.5">
                  Admin Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded-full bg-white/5 text-muted hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items List */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-170px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all select-none border ${isActive
                    ? 'bg-primary text-black border-primary shadow-md font-extrabold'
                    : 'bg-transparent text-muted hover:text-primary hover:bg-primary/5 border-transparent hover:border-primary/20'
                    }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (User Profile Summary & Logout) */}
        <div className="p-4 border-t border-white/5 bg-[#0e0e0e]/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-red-950/20 hover:bg-red-900/30 border border-red-500/10 hover:border-red-500/20 text-red-400 hover:text-red-300 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 3. Main Dashboard Workspace */}
      <div className="flex-grow flex flex-col min-h-screen min-w-0 relative overflow-hidden">
        {/* Ambient backlighting glow blobs */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-secondary/85 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8">

          {/* Left Area: Hamburger & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted hover:text-white cursor-pointer"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>

            {/* Breadcrumb Pager */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-sans font-semibold text-muted">
              <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>
                Admin
              </span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3.5 h-3.5 text-white/20 shrink-0" />
                  <span className={idx === breadcrumbs.length - 1 ? 'text-primary font-bold' : ''}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Area: Search, Notifications, Profile */}
          <div className="flex items-center gap-4">

            {/* Notification Bell Icon */}
            <button className="relative p-2 rounded-xl bg-white/5 hover:bg-primary/10 text-muted hover:text-primary transition-colors cursor-pointer">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1 px-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer select-none border border-transparent hover:border-white/5"
              >
                {/* User avatar thumb */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 border border-primary/25 flex items-center justify-center text-primary font-bold shrink-0 text-sm">
                  {user?.profile_photo ? (
                    <img
                      src={user.profile_photo.startsWith('http') ? user.profile_photo : `http://localhost:8000/storage/${user.profile_photo}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'A'
                  )}
                </div>
                <span className="hidden md:inline text-xs font-sans font-bold text-white/90">
                  {user?.name || 'Administrator'}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div
                    onClick={() => setIsProfileOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <div className="absolute right-0 mt-2.5 w-52 glass-card p-2 rounded-2xl shadow-xl border border-white/5 z-50 flex flex-col text-sm font-sans">
                    <div className="px-3.5 py-3.5 border-b border-white/5 flex flex-col gap-0.5">
                      <p className="text-xs text-white font-bold">{user?.name}</p>
                      <p className="text-[10px] text-muted truncate mt-0.5 font-light">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-3 hover:bg-primary/10 hover:text-primary rounded-xl text-xs text-white/80 font-bold uppercase tracking-wider transition-colors mt-1.5"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-3 hover:bg-primary/10 hover:text-primary rounded-xl text-xs text-white/80 font-bold uppercase tracking-wider transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-3.5 py-3 hover:bg-red-950/20 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors mb-1 mt-1 border-t border-white/5 pt-3"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/* 4. Page Contents Area */}
        <main className="flex-grow p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
