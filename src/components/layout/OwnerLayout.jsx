import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, CalendarCheck, Settings, LogOut } from 'lucide-react';

export default function OwnerLayout() {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/owner', icon: LayoutDashboard },
    { name: 'My Listings', path: '/owner/listings', icon: Car },
    { name: 'Bookings', path: '/owner/bookings', icon: CalendarCheck },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all">
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
          <Car className="text-primary-500 mr-2" size={24} />
          <span className="text-lg font-bold text-white tracking-wide">Owner Portal</span>
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
                    ? 'bg-primary-600 text-white' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
            <Settings size={18} className="mr-3" /> Settings
          </Link>
          <Link to="/" className="flex items-center px-3 py-2 mt-1 text-sm text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-slate-800">
            <LogOut size={18} className="mr-3" /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">
            {navLinks.find(l => l.path === location.pathname)?.name || 'Portal'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
              O
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
