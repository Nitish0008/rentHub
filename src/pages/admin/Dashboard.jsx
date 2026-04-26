import { adminStats, vehicles, bookings } from '../../data/dummyData';
import { 
  Users, Car, HeartHandshake, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Activity, 
  ShieldCheck, Clock, MapPin, ChevronRight,
  PieChart, BarChart3, Wallet
} from 'lucide-react';

export default function AdminDashboard() {
  const statCards = [
    { name: 'Total Users', value: '1,284', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%', up: true },
    { name: 'Active Owners', value: '42', icon: HeartHandshake, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+4.2%', up: true },
    { name: 'Fleet Size', value: vehicles.length, icon: Car, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+8.1%', up: true },
    { name: 'Total Revenue', value: `₹${bookings.reduce((acc, b) => acc + b.totalPrice, 0).toLocaleString()}`, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+22.4%', up: true },
  ];

  const categories = [
    { name: 'Cars', count: vehicles.filter(v => v.type === 'Car').length, color: 'bg-indigo-500', width: '65%' },
    { name: 'Bikes', count: vehicles.filter(v => v.type === 'Bike').length, color: 'bg-blue-400', width: '25%' },
    { name: 'Scooters', count: vehicles.filter(v => v.type === 'Scooter').length, color: 'bg-emerald-400', width: '10%' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-100 text-sm font-semibold mb-2">
            <ShieldCheck size={16} />
            Platform Verified
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Welcome Back, Admin!</h2>
          <p className="text-indigo-100 max-w-md opacity-90">
            Everything is running smoothly. You have 3 new vehicle approval requests and 5 pending owner registrations.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all">
              View Approvals
            </button>
            <button className="bg-indigo-500/30 backdrop-blur-sm text-white border border-white/20 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-500/40 transition-all">
              System Settings
            </button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-900/20 rounded-full blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider text-[10px]">{stat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <PieChart size={20} className="text-indigo-500" />
              Fleet Distribution
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time</span>
          </div>
          
          <div className="space-y-6 flex-1">
            {categories.map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>{cat.name}</span>
                  <span className="text-slate-400">{cat.count} Units</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${cat.color} rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: cat.width }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Platform Health</div>
                <div className="text-sm font-bold text-emerald-600">99.9% Uptime</div>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Performance / Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Activity size={20} className="text-indigo-500" />
              Live Platform Activity
            </h3>
            <button className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline">
              View All Logs <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="space-y-1">
            {adminStats.recentActivity.map((activity, i) => (
              <div key={activity.id} className="group relative pl-8 pb-6 last:pb-0">
                {/* Timeline line */}
                {i !== adminStats.recentActivity.length - 1 && (
                  <div className="absolute left-3.5 top-8 bottom-0 w-px bg-slate-100" />
                )}
                {/* Dot */}
                <div className="absolute left-2 top-2 w-3 h-3 rounded-full border-2 border-white bg-indigo-500 shadow-sm z-10" />
                
                <div className="bg-slate-50 group-hover:bg-indigo-50/50 p-4 rounded-2xl transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-slate-800 text-sm font-bold leading-tight">{activity.text}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">
                      <Clock size={12} />
                      {activity.time}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500 uppercase">
                      Audit Log
                    </span>
                    <span className="text-[10px] text-indigo-500 font-bold hover:underline cursor-pointer">
                      Details
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-900 rounded-3xl p-6 text-white flex items-center justify-between shadow-lg shadow-indigo-200">
          <div>
            <h4 className="font-bold text-lg mb-1">Owner Payouts</h4>
            <p className="text-indigo-300 text-xs mb-4">Payout window closes in 2 days</p>
            <div className="text-2xl font-extrabold">₹48,250.00</div>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <Wallet size={32} className="text-indigo-300" />
          </div>
        </div>
        <div className="bg-emerald-600 rounded-3xl p-6 text-white flex items-center justify-between shadow-lg shadow-emerald-100">
          <div>
            <h4 className="font-bold text-lg mb-1">Platform Rating</h4>
            <p className="text-emerald-200 text-xs mb-4">Based on 1,200+ customer reviews</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold">4.9</span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <StarIcon key={i} size={14} className="fill-white text-white" />)}
              </div>
            </div>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
            ⭐
          </div>
        </div>
      </div>
    </div>
  );
}

const StarIcon = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
