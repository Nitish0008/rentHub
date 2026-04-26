import { Link } from 'react-router-dom';
import { LogIn, Car, UserPlus } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 text-white rounded-lg group-hover:bg-indigo-700 transition-colors">
              <Car size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700">
              RentHub
            </span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
            <Link to="/vehicles" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Vehicles</Link>
            <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">How it Works</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/owner-auth"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-all"
            >
              <UserPlus size={16} />
              Register as an Owner
            </Link>
            <Link to="/admin" className="btn btn-primary px-4 py-2 text-sm">
              <LogIn size={16} className="mr-2" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
