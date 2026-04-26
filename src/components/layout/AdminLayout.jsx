import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookMarked, Car, Settings, LogOut, Activity, UserCheck } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard',   path: '/admin',          icon: LayoutDashboard },
    { name: 'Owners',      path: '/admin/owners',   icon: UserCheck },
    { name: 'Vehicles',    path: '/admin/vehicles', icon: Car },
    { name: 'Bookings',    path: '/admin/bookings', icon: BookMarked },
    { name: 'System Logs', path: '/admin/logs',     icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-950 text-indigo-100 flex flex-col transition-all">
        <div className="h-16 flex items-center px-6 bg-indigo-900 border-b border-indigo-800/50">
          <Settings className="text-primary-400 mr-2" size={24} />
          <span className="text-lg font-bold text-white tracking-wide">Admin Control</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'hover:bg-indigo-900/50 hover:text-white'
                }`}
              >
                <Icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-indigo-400 group-hover:text-white'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-indigo-900/50">
          <Link to="/" className="flex items-center px-3 py-2 text-sm text-indigo-300 hover:text-white transition-colors rounded-lg hover:bg-indigo-900/50">
            <LogOut size={18} className="mr-3" /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden text-slate-800">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">
            {navLinks.find(l => l.path === location.pathname)?.name || 'Admin Panel'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
              System Online
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold border border-slate-300">
              A
            </div>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
