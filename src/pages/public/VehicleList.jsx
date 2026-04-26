import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vehicles as dummyVehicles } from '../../data/dummyData';
import { Search, MapPin, Filter, Star } from 'lucide-react';

export default function VehicleList() {
  const [vehicles, setVehicles] = useState(dummyVehicles);
  const [filterType, setFilterType] = useState('All');

  const handleFilter = (type) => {
    setFilterType(type);
    if (type === 'All') {
      setVehicles(dummyVehicles);
    } else {
      setVehicles(dummyVehicles.filter(v => v.type === type));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl font-bold text-slate-900">Explore Vehicles</h1>
          <p className="text-slate-500 mt-2">Find the perfect ride from our selection of {vehicles.length} vehicles</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">Vehicle Type</h3>
            <div className="space-y-3">
              {['All', 'Car', 'Bike', 'Scooter'].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="type" 
                    checked={filterType === type}
                    onChange={() => handleFilter(type)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300 cursor-pointer"
                  />
                  <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
                </label>
              ))}
            </div>

            <h3 className="font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100 mt-8">Price Range</h3>
            <div className="space-y-4">
              <input type="range" className="w-full accent-primary-600" />
              <div className="flex justify-between text-sm text-slate-500">
                <span>$10</span>
                <span>$200+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Vehicle Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((v) => (
              <Link to={`/vehicles/${v.id}`} key={v.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800 z-10">
                    {v.category}
                  </div>
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{v.name}</h3>
                    <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
                      <Star size={12} className="mr-1 fill-current" /> {v.rating}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-slate-500 gap-2 mb-4">
                    <MapPin size={14} /> {v.location}
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-slate-900">${v.pricePerDay}</span>
                      <span className="text-xs text-slate-500">/day</span>
                    </div>
                    <span className="text-primary-600 font-medium text-sm group-hover:underline">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {vehicles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No vehicles found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
