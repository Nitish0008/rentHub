import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Car className="text-primary-500" size={24} />
                <span className="text-xl font-bold text-white">RentHub</span>
              </div>
              <p className="text-sm text-slate-400">
                Premium vehicle rental service offering cars, bikes, and scooters for your journey.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-primary-400 transition-colors">Home</a></li>
                <li><a href="/vehicles" className="hover:text-primary-400 transition-colors">Vehicles</a></li>
                <li><a href="/owner" className="hover:text-primary-400 transition-colors">List your Vehicle</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Phone size={16} className="text-slate-500" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={16} className="text-slate-500" />
                  <span>support@renthub.com</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-slate-500" />
                  <span>Guwahati, Assam</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Newsletter</h3>
              <p className="text-sm text-slate-400 mb-2">Subscribe for updates and offers.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-slate-800 text-white px-3 py-2 rounded-l-lg w-full focus:outline-none focus:border-primary-500 border border-slate-700"
                />
                <button className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-lg transition-colors text-white">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-center text-slate-500">
            &copy; {new Date().getFullYear()} RentHub. All rights reserved. Designed with precision.
          </div>
        </div>
      </footer>
    </div>
  );
}
