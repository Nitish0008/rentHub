import { useState } from 'react';
import { 
  Activity, Shield, User, Car, 
  CreditCard, AlertCircle, RefreshCw, Filter, 
  Search, Clock, Trash2
} from 'lucide-react';

const DUMMY_LOGS = [
  { id: 1, type: 'auth', action: 'New owner registration', user: 'Amit Das', details: 'Registered as a vehicle owner', timestamp: '2024-04-26 14:30:22', status: 'success' },
  { id: 2, type: 'vehicle', action: 'Vehicle Approved', user: 'Admin', details: 'Approved Tesla Model 3 (o1)', timestamp: '2024-04-26 13:15:10', status: 'success' },
  { id: 3, type: 'booking', action: 'Payment Received', user: 'Sanjay Mehta', details: 'Amount: ₹375 for v1', timestamp: '2024-04-26 12:45:05', status: 'success' },
  { id: 4, type: 'system', action: 'Backup Completed', user: 'System', details: 'Automated database backup', timestamp: '2024-04-26 00:00:01', status: 'success' },
  { id: 5, type: 'auth', action: 'Failed login attempt', user: 'Unknown', details: 'IP: 192.168.1.105', timestamp: '2024-04-25 22:10:45', status: 'error' },
  { id: 6, type: 'vehicle', action: 'New vehicle listed', user: 'Rahul Sharma', details: 'Listed Mahindra Thar for approval', timestamp: '2024-04-25 18:20:30', status: 'warning' },
  { id: 7, type: 'booking', action: 'Booking Cancelled', user: 'Rina Borah', details: 'Refund initiated for b5', timestamp: '2024-04-25 16:40:15', status: 'warning' },
  { id: 8, type: 'auth', action: 'Password Change', user: 'Deepak Roy', details: 'Security update completed', timestamp: '2024-04-25 11:30:00', status: 'success' },
  { id: 9, type: 'system', action: 'API Limit Warning', user: 'System', details: 'Maps API reaching 80% quota', timestamp: '2024-04-25 09:15:22', status: 'error' },
  { id: 10, type: 'vehicle', action: 'Price Updated', user: 'Amit Das', details: 'Updated RE Classic 350 to ₹25', timestamp: '2024-04-24 15:10:40', status: 'success' },
];

export default function AdminLogs() {
  const [logs, setLogs] = useState(DUMMY_LOGS);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || 
                          log.user.toLowerCase().includes(search.toLowerCase()) ||
                          log.details.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || log.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getLogIcon = (type) => {
    switch (type) {
      case 'auth': return <Shield size={16} className="text-blue-500" />;
      case 'vehicle': return <Car size={16} className="text-purple-500" />;
      case 'booking': return <CreditCard size={16} className="text-emerald-500" />;
      case 'system': return <Settings2 size={16} className="text-slate-500" />;
      default: return <Activity size={16} className="text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-50 text-emerald-600';
      case 'error': return 'bg-rose-50 text-rose-600';
      case 'warning': return 'bg-amber-50 text-amber-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Logs</h2>
          <p className="text-slate-500">Track and audit all platform activities</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl transition-all shadow-sm text-sm font-semibold">
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-xl transition-all border border-rose-100 text-sm font-semibold">
            <Trash2 size={16} /> Clear Logs
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 w-full md:w-80">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="bg-transparent outline-none text-sm w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['All', 'auth', 'vehicle', 'booking', 'system'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap ${
                  filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white transition-colors">
                        {getLogIcon(log.type)}
                      </div>
                      <div className="text-sm font-semibold text-slate-800">{log.action}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-500 max-w-xs">{log.details}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {log.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            No logs matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}

// Added Settings2 import to handle icon case
const Settings2 = ({size, className}) => <Activity size={size} className={className} />;
