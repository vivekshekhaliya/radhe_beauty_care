import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Heart, 
  GraduationCap, 
  Image as ImageIcon, 
  Tags, 
  CalendarDays,
  Plus,
  ArrowRight,
  TrendingUp,
  History
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

interface Metrics {
  total_services: number;
  total_packages: number;
  total_courses: number;
  total_gallery_images: number;
  total_categories: number;
  total_bookings: number;
  status_counts: Record<string, number>;
}

interface Booking {
  id: number;
  name: string;
  mobile: string;
  service: string;
  preferred_date: string;
  status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

interface Activity {
  id: number;
  action: string;
  description: string;
  created_at: string;
  user?: { name: string };
}

interface ChartItem {
  month: string;
  bookings: number;
}

interface DashboardData {
  metrics: Metrics;
  recent: {
    bookings: Booking[];
    gallery: any[];
    services: any[];
    activity: Activity[];
  };
  charts: {
    bookings_trend: ChartItem[];
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/dashboard');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-xs uppercase tracking-widest font-sans font-bold">Assembling Analytics...</p>
        </div>
      </div>
    );
  }

  const { metrics, recent, charts } = data;

  // Status colors helper
  const statusColors = {
    new: 'text-blue-400 bg-blue-500/10 border-blue-500/10',
    contacted: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/10',
    confirmed: 'text-purple-400 bg-purple-500/10 border-purple-500/10',
    completed: 'text-green-400 bg-green-500/10 border-green-500/10',
    cancelled: 'text-red-400 bg-red-500/10 border-red-500/10',
  };

  // SVG Chart Dimensions & Computations
  const maxBookingVal = Math.max(...charts.bookings_trend.map(item => item.bookings), 5);
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 30;
  const points = charts.bookings_trend.map((item, idx) => {
    const x = padding + (idx * (chartWidth - padding * 2)) / (charts.bookings_trend.length - 1);
    const y = chartHeight - padding - (item.bookings * (chartHeight - padding * 2)) / maxBookingVal;
    return { x, y, month: item.month, val: item.bookings };
  });

  // Generate SVG path for line
  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  // Generate SVG path for filled area under the line
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative glass-card p-6 sm:p-8 rounded-3xl overflow-hidden border border-white/5 gold-glow flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-[4px] h-full bg-primary" />
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">Welcome Back, Kajal</h2>
          <p className="text-xs text-muted font-sans font-light">Here is a general summary of your beauty care salon and training academy activity.</p>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button 
            onClick={() => navigate('/services')} 
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
          <button 
            onClick={() => navigate('/gallery')}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all border border-white/5 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Services Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-muted">Services</span>
            <Sparkles className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-white">{metrics.total_services}</h3>
            <p className="text-[10px] text-muted font-sans font-light mt-0.5">Salon Catalog</p>
          </div>
        </div>

        {/* Bridal Packages Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-muted">Packages</span>
            <Heart className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-white">{metrics.total_packages}</h3>
            <p className="text-[10px] text-muted font-sans font-light mt-0.5">Bridal Specials</p>
          </div>
        </div>

        {/* Academy Courses Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-muted">Courses</span>
            <GraduationCap className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-white">{metrics.total_courses}</h3>
            <p className="text-[10px] text-muted font-sans font-light mt-0.5">Academy Classes</p>
          </div>
        </div>

        {/* Gallery Images Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-muted">Portfolio</span>
            <ImageIcon className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-white">{metrics.total_gallery_images}</h3>
            <p className="text-[10px] text-muted font-sans font-light mt-0.5">Gallery Uploads</p>
          </div>
        </div>

        {/* Total Categories Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-muted">Categories</span>
            <Tags className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-white">{metrics.total_categories}</h3>
            <p className="text-[10px] text-muted font-sans font-light mt-0.5">Grouping Files</p>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-muted">Inquiries</span>
            <CalendarDays className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-white">{metrics.total_bookings}</h3>
            <p className="text-[10px] text-muted font-sans font-light mt-0.5">Appointment Requests</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Chart & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SVG Trend Chart */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-sans font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5" />
              <span>Booking Inquiries Trend</span>
            </h4>
            <span className="text-[10px] text-muted font-sans font-medium">Last 6 Months</span>
          </div>

          <div className="w-full">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto select-none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C89B3C" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#C89B3C" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {Array.from({ length: 4 }).map((_, idx) => {
                const y = padding + (idx * (chartHeight - padding * 2)) / 3;
                return (
                  <line 
                    key={idx} 
                    x1={padding} 
                    y1={y} 
                    x2={chartWidth - padding} 
                    y2={y} 
                    stroke="rgba(255,255,255,0.03)" 
                    strokeWidth="1" 
                  />
                );
              })}

              {/* Area path */}
              <path d={areaPath} fill="url(#chartGrad)" />

              {/* Line path */}
              <path d={linePath} fill="none" stroke="#C89B3C" strokeWidth="2.5" />

              {/* Circles & Value Labels */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#050505" stroke="#E2C36B" strokeWidth="2" />
                  <text 
                    x={p.x} 
                    y={p.y - 10} 
                    fill="#FFF" 
                    fontSize="9" 
                    fontFamily="sans-serif" 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    {p.val}
                  </text>
                  <text 
                    x={p.x} 
                    y={chartHeight - 10} 
                    fill="#BEBEBE" 
                    fontSize="9" 
                    fontFamily="sans-serif" 
                    textAnchor="middle"
                  >
                    {p.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Booking Requests Status Breakdown Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-sans font-extrabold uppercase tracking-widest text-primary mb-6 flex items-center gap-1.5">
              <CalendarDays className="w-4.5 h-4.5" />
              <span>Inquiries Breakdown</span>
            </h4>
            
            <div className="space-y-4">
              {[
                { label: 'New Inquiries', count: metrics.status_counts.new || 0, color: 'bg-blue-500' },
                { label: 'Contacted', count: metrics.status_counts.contacted || 0, color: 'bg-yellow-500' },
                { label: 'Confirmed Sessions', count: metrics.status_counts.confirmed || 0, color: 'bg-purple-500' },
                { label: 'Completed Services', count: metrics.status_counts.completed || 0, color: 'bg-green-500' },
                { label: 'Cancelled Requests', count: metrics.status_counts.cancelled || 0, color: 'bg-red-500' }
              ].map((item, idx) => {
                const percentage = metrics.total_bookings > 0 
                  ? Math.round((item.count / metrics.total_bookings) * 100) 
                  : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-sans">
                      <span className="font-semibold text-white/95">{item.label}</span>
                      <span className="text-muted font-bold">{item.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-dark rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.color}`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Row: Recent Inquiries & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Inquiries List */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-sans font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <CalendarDays className="w-4.5 h-4.5" />
              <span>Recent Inquiries</span>
            </h4>
            <button 
              onClick={() => navigate('/bookings')}
              className="text-[10px] font-sans font-extrabold uppercase tracking-wider text-muted hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {recent.bookings.length === 0 ? (
              <p className="text-sm text-muted font-sans font-light py-4">No recent bookings found.</p>
            ) : (
              recent.bookings.map((booking) => (
                <div key={booking.id} className="py-3.5 flex items-center justify-between gap-4 font-sans text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{booking.name}</p>
                    <p className="text-[10px] text-muted truncate mt-0.5">
                      Service: <span className="text-white/80">{booking.service.replace(/-/g, ' ')}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div className="hidden sm:block">
                      <p className="font-semibold text-white/90">{booking.preferred_date}</p>
                      <p className="text-[9px] text-muted mt-0.5">{booking.mobile}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                      statusColors[booking.status] || ''
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Activity Logs */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-sans font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <History className="w-4.5 h-4.5" />
              <span>Activity Logs</span>
            </h4>
            <span className="text-[9px] text-muted font-sans font-semibold">Audit Trail</span>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {recent.activity.length === 0 ? (
              <p className="text-sm text-muted font-sans font-light py-4">No actions logged yet.</p>
            ) : (
              recent.activity.map((log) => (
                <div key={log.id} className="flex gap-3 text-xs font-sans">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white/95 leading-relaxed font-light">{log.description}</p>
                    <p className="text-[9px] text-muted mt-1 font-semibold flex items-center gap-2">
                      <span>By {log.user?.name || 'System'}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
