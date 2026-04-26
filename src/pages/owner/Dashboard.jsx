import { ownerStats, bookings } from '../../data/dummyData';
import { DollarSign, Car, CalendarClock, Bell } from 'lucide-react';

export default function OwnerDashboard() {
  const statCards = [
    { name: 'Total Earnings', value: `$${ownerStats.earnings}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Active Listings', value: ownerStats.totalListings, icon: Car, color: 'text-primary-600', bg: 'bg-primary-100' },
    { name: 'Active Bookings', value: ownerStats.activeBookings, icon: CalendarClock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Pending Requests', value: ownerStats.pendingRequests, icon: Bell, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome back, Rahul</h2>
        <p className="text-slate-500 mt-1">Here is what is happening with your vehicles today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Recent Bookings</h3>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-white text-slate-400 font-medium uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Earnings</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 3).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{b.userName}</td>
                  <td className="px-6 py-4 text-slate-600">ID: {b.vehicleId}</td>
                  <td className="px-6 py-4 text-slate-500">{b.startDate} to {b.endDate}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">${b.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      b.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      b.status === 'Confirmed' ? 'bg-primary-100 text-primary-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {b.status}
                    </span>
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
