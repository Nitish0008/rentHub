import { useState } from 'react';
import { vehicles } from '../../data/dummyData';
import { 
  Search, Filter, CheckCircle, XCircle, Trash2, 
  Eye, Car, User, MoreVertical, Plus, X, 
  ShieldCheck, MapPin, ImageIcon, Settings
} from 'lucide-react';

export default function AdminVehicles() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [data, setData] = useState(vehicles);
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', brand: '', type: 'Car', category: '',
    pricePerDay: '', location: '', fuelType: 'Petrol',
    transmission: 'Manual', seats: '', status: 'Available',
    image: '', description: ''
  });

  const filteredVehicles = data.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                          v.brand.toLowerCase().includes(search.toLowerCase()) ||
                          v.owner.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || v.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (id, newStatus) => {
    setData(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this vehicle?')) {
      setData(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const newVehicle = {
      ...formData,
      id: `v${data.length + 1}`,
      owner: { id: 'admin', name: 'RentHub Verified', rating: 5.0 },
      rating: 5.0,
      reviews: 0,
    };
    setData([newVehicle, ...data]);
    setShowAddDrawer(false);
    setFormData({
      name: '', brand: '', type: 'Car', category: '',
      pricePerDay: '', location: '', fuelType: 'Petrol',
      transmission: 'Manual', seats: '', status: 'Available',
      image: '', description: ''
    });
  };

  return (
    <div className="relative min-h-screen pb-20 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vehicle Fleet</h2>
          <p className="text-slate-500">Manage, verify and monitor all vehicles on the platform</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search fleet..." 
              className="bg-transparent outline-none text-sm w-full lg:w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddDrawer(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-100 text-sm font-semibold whitespace-nowrap"
          >
            <Plus size={18} /> Add New Vehicle
          </button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit overflow-x-auto">
        {['All', 'Car', 'Bike', 'Scooter'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === t ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t}s
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ownership</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Specifications</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pricing</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                        <img src={v.image || 'https://via.placeholder.com/150'} alt={v.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 leading-tight">{v.brand} {v.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{v.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {v.owner.id === 'admin' ? (
                      <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 w-fit">
                        <ShieldCheck size={14} className="fill-indigo-100" />
                        <span className="text-xs font-bold whitespace-nowrap">RentHub Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                          {v.owner.name.charAt(0)}
                        </div>
                        <div className="text-sm font-medium text-slate-700">{v.owner.name}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Car size={12} className="text-slate-400" /> {v.type}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400" /> {v.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-base font-extrabold text-slate-900">₹{v.pricePerDay}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase">Daily Rate</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex flex-col gap-1`}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase w-fit ${
                        v.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        v.status === 'Booked' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          v.status === 'Available' ? 'bg-emerald-500' : 
                          v.status === 'Booked' ? 'bg-blue-500' : 'bg-amber-500'
                        }`} />
                        {v.status}
                      </span>
                      {v.status === 'Booked' && (
                        <div className="text-[10px] text-blue-500 font-semibold italic flex items-center gap-1">
                          <CheckCircle size={10} /> Active Rental
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleStatusChange(v.id, v.status === 'Available' ? 'Pending' : 'Available')}
                        className={`p-2 rounded-lg transition-colors ${v.status === 'Available' ? 'hover:bg-amber-50 text-amber-500' : 'hover:bg-emerald-50 text-emerald-500'}`}
                      >
                        {v.status === 'Available' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(v.id)}
                        className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Drawer */}
      <div className={`fixed inset-0 z-[1000] transition-all duration-300 ${showAddDrawer ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddDrawer(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 ease-out transform ${showAddDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-indigo-600 text-white">
              <div>
                <h3 className="text-xl font-bold">Add New Fleet Vehicle</h3>
                <p className="text-indigo-100 text-xs mt-1 uppercase font-semibold tracking-wider">Owner: RentHub Verified</p>
              </div>
              <button onClick={() => setShowAddDrawer(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
                  <ShieldCheck className="text-indigo-600" size={24} />
                  <div>
                    <div className="text-sm font-bold text-indigo-900">RentHub Internal Listing</div>
                    <div className="text-[10px] text-indigo-500 font-medium">This vehicle will be marked as "Verified" on the platform</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Brand</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="e.g. Tesla" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Model Name</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="e.g. Model S" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option>Car</option>
                      <option>Bike</option>
                      <option>Scooter</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="e.g. Luxury Sedan" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm" placeholder="Paste image link here" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Price / Day (₹)</label>
                    <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="e.g. 500" value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="e.g. Mumbai" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase text-[10px]">Fuel</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs" value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})}>
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Electric</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase text-[10px]">Transmission</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs" value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})}>
                      <option>Manual</option>
                      <option>Automatic</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase text-[10px]">Seats</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs" value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                  <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none" placeholder="Details about vehicle condition..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3">
                <button type="button" onClick={() => setShowAddDrawer(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  Confirm & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
