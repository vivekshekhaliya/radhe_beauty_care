import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get original redirect path or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/login', { email, password });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        login(token, user);
        
        toast.success('Logged in successfully!');
        
        // Wait a split second to smooth transition
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 300);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Luxury Gradient blobs background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-peacock/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10 glass-card p-8 sm:p-10 rounded-[32px] shadow-2xl overflow-hidden border border-white/5 gold-glow">
        
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary via-accent to-primary" />

        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <span className="text-[11px] text-primary uppercase font-extrabold tracking-[0.4em] mb-1">
            Radhe Beauty Care
          </span>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Admin Console
          </h2>
          <p className="text-xs text-muted font-sans font-light mt-2">
            Secure sign in to manage salon content
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/20 border border-red-500/15 text-red-400 text-xs font-sans font-semibold leading-relaxed">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email input */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-primary">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted select-none pointer-events-none">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@radhebeauty.com"
                className="w-full pl-11 pr-4 py-3 bg-[#050505] border border-white/10 hover:border-white/20 focus:border-primary text-white outline-none rounded-xl text-sm font-sans transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-primary">
                Password
              </label>
              <button
                type="button"
                className="text-[10px] font-sans font-bold uppercase tracking-wider text-muted hover:text-primary transition-colors cursor-pointer"
                onClick={() => toast.info('Please contact owner Kajal Shekhaliya to reset credentials.')}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted select-none pointer-events-none">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-[#050505] border border-white/10 hover:border-white/20 focus:border-primary text-white outline-none rounded-xl text-sm font-sans transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center">
            <input
              id="remember_me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4.5 h-4.5 accent-primary border-white/20 bg-dark rounded focus:ring-primary cursor-pointer"
            />
            <label htmlFor="remember_me" className="ml-2.5 text-xs text-muted font-sans font-medium select-none cursor-pointer">
              Remember my session
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-4 bg-primary hover:bg-peacock disabled:bg-primary/60 text-black hover:text-white font-sans font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>Securing Access...</span>
              </>
            ) : (
              <span>Sign In To Portal</span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;
