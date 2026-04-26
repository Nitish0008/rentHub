import { useState } from 'react';
import { bookings, vehicles } from '../../data/dummyData';
import { 
  Search, Calendar, Download, TrendingUp, 
  Clock, CheckCircle, XCircle, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Filter
} from 'lucide-react';

export default function AdminBookings() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Enrich bookings with vehicle and owner info
  const enrichedBookings = bookings.map(b => {
    const vehicle = vehicles.find(v => v.id === b.vehicleId);
    return {
      ...b,
      vehicleName: vehicle ? `${vehicle.brand} ${vehicle.name}` : 'Unknown Vehicle',
      ownerName: vehicle ? vehicle.owner.name : 'Unknown Owner',
      vehicleType: vehicle ? vehicle.type : 'N/A'
    };
  });

  const filteredBookings = enrichedBookings.filter(b => {
    const matchesSearch = b.userName.toLowerCase().includes(search.toLowerCase()) || 
                          b.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
                          b.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%', up: true },
    { label: 'Total Revenue', value: `₹${bookings.reduce((acc, b) => acc + b.totalPrice, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+18%', up: true },
    { label: 'Ongoing', value: bookings.filter(b => b.status === 'Confirmed').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-2%', up: false },
    { label: 'Completed', value: bookings.filter(b => b.status === 'Completed').length, icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+5%', up: true },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Platform Bookings</h2>
          <p className="text-slate-500">Monitor all transactions and rental activities</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-100 text-sm font-semibold">
          <Download size={16} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`${s.bg} ${s.color} p-2 rounded-lg`}>
                <s.icon size={20} />
              </div>
              <div className={`flex items-center text-xs font-medium ${s.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {s.trend}
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm w-full md:w-80">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customer, vehicle or owner..." 
              className="bg-transparent outline-none text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
            <Filter size={16} className="text-slate-500" />
            <span className="text-sm text-slate-600 font-medium">Filter</span>
          </div>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                statusFilter === s ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{b.userName}</div>
                    <div className="text-xs text-slate-400">ID: #{b.userId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-800">{b.vehicleName}</div>
                    <div className="text-xs text-slate-400">{b.vehicleType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{b.ownerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{b.startDate} to {b.endDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">₹{b.totalPrice}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
