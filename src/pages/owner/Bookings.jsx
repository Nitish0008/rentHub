import { useState, useRef, useEffect } from 'react';
import { bookings, vehicles } from '../../data/dummyData';
import {
  CalendarCheck, MapPin, Clock, CheckCircle2,
  XCircle, AlertCircle, Search, ChevronDown, ChevronUp,
  User, Phone
} from 'lucide-react';

// Enrich bookings with vehicle info
const enriched = bookings.map(b => ({
  ...b,
  vehicle: vehicles.find(v => v.id === b.vehicleId) || null,
}));

const INITIAL_BOOKINGS = [
  ...enriched,
  {
    id: 'b4', vehicleId: 'v1', userId: 'u4', userName: 'Sanjay Mehta',
    phone: '+91 98001 12233', location: 'Guwahati',
    startDate: '2024-01-10', endDate: '2024-01-13', totalPrice: 375, status: 'Confirmed',
    vehicle: vehicles.find(v => v.id === 'v1'),
  },
  {
    id: 'b5', vehicleId: 'v3', userId: 'u5', userName: 'Rina Borah',
    phone: '+91 90001 55566', location: 'Kaziranga',
    startDate: '2024-02-05', endDate: '2024-02-08', totalPrice: 270, status: 'Pending',
    vehicle: vehicles.find(v => v.id === 'v3'),
  },
  {
    id: 'b6', vehicleId: 'v9', userId: 'u6', userName: 'Deepak Roy',
    phone: '+91 91234 56789', location: 'Guwahati',
    startDate: '2024-03-01', endDate: '2024-03-04', totalPrice: 135, status: 'Completed',
    vehicle: vehicles.find(v => v.id === 'v9'),
  },
];

const ALL_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const STATUS_CONFIG = {
  Confirmed: { color: 'bg-indigo-100 text-indigo-700', icon: <CheckCircle2 size={13} />, dot: 'bg-indigo-500' },
  Completed: { color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={13} />, dot: 'bg-emerald-500' },
  Pending:   { color: 'bg-amber-100 text-amber-700',   icon: <AlertCircle size={13} />,  dot: 'bg-amber-500' },
  Cancelled: { color: 'bg-rose-100 text-rose-600',     icon: <XCircle size={13} />,      dot: 'bg-rose-500' },
};



function getDays(start, end) {
  const d1 = new Date(start), d2 = new Date(end);
  return Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
}

// ── Status Dropdown ───────────────────────────────────────────────────────────
function StatusDropdown({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all hover:opacity-90 ${cfg.color}`}
      >
        {cfg.icon}
        {status}
        <ChevronDown size={11} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-[9999] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-w-[155px]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2.5 pb-1">Change Status</p>
          {ALL_STATUSES.map(s => {
            const sc = STATUS_CONFIG[s];
            const isCurrent = s === status;
            return (
              <button
                key={s}
                disabled={isCurrent}
                onClick={() => { onChange(s); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors ${
                  isCurrent ? 'bg-slate-50 text-slate-400 cursor-default' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${sc.dot}`} />
                {s}
                {isCurrent && <span className="ml-auto text-[10px] text-slate-400">current</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Booking Card ──────────────────────────────────────────────────────────────
function BookingCard({ b, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const days = getDays(b.startDate, b.endDate);
  const img = b.vehicle?.images?.[0] || b.vehicle?.image;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Main row */}
      <div className="flex flex-col sm:flex-row">
        {/* Vehicle image */}
        {img && (
          <div className="sm:w-36 h-32 sm:h-auto shrink-0 overflow-hidden">
            <img src={img} alt={b.vehicle?.name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Details */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                {b.vehicle?.category}
              </span>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {b.vehicle?.brand} {b.vehicle?.name}
              </h3>
            </div>
            {/* Clickable status badge with dropdown */}
            <StatusDropdown status={b.status} onChange={(s) => onStatusChange(b.id, s)} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <User size={12} className="text-indigo-400" />
              <span className="font-medium text-slate-700">{b.userName}</span>
            </div>
            {b.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-indigo-400" />
                <span>{b.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-indigo-400" />
              <span>{days} day{days > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CalendarCheck size={13} className="text-indigo-400" />
              <span>{b.startDate}</span>
              <span className="text-slate-300">→</span>
              <span>{b.endDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-extrabold text-slate-900">₹{b.totalPrice}</span>
              <button
                onClick={() => setExpanded(e => !e)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                {expanded ? <><ChevronUp size={13} /> Less</> : <><ChevronDown size={13} /> Details</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-4">

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider mb-1">Booking ID</p>
              <p className="font-bold text-slate-700">#{b.id.toUpperCase()}</p>
            </div>
            {b.phone && (
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider mb-1">Phone</p>
                <p className="font-bold text-slate-700 flex items-center gap-1"><Phone size={11} /> {b.phone}</p>
              </div>
            )}
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider mb-1">Per Day Rate</p>
              <p className="font-bold text-slate-700">₹{b.vehicle?.pricePerDay}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider mb-1">Duration</p>
              <p className="font-bold text-slate-700">{days} day{days > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Bookings() {
  const [list, setList] = useState(INITIAL_BOOKINGS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleStatusChange = (id, newStatus) => {
    setList(l => l.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const filtered = list.filter(b => {
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchSearch = b.userName.toLowerCase().includes(search.toLowerCase()) ||
                        (b.vehicle?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    All:       list.length,
    Confirmed: list.filter(b => b.status === 'Confirmed').length,
    Pending:   list.filter(b => b.status === 'Pending').length,
    Completed: list.filter(b => b.status === 'Completed').length,
    Cancelled: list.filter(b => b.status === 'Cancelled').length,
  };

  const totalEarnings = list
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">My Bookings</h2>
          <p className="text-slate-500 text-sm mt-0.5">Track and manage all your vehicle rental bookings</p>
        </div>
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-5 py-3 rounded-2xl">
          <p className="text-xs font-semibold text-indigo-200 mb-0.5">Total Earnings</p>
          <p className="text-2xl font-extrabold">₹{totalEarnings.toLocaleString()}</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',     val: list.length,       color: 'text-indigo-600',  bg: 'bg-indigo-50' },
          { label: 'Confirmed', val: counts.Confirmed,   color: 'text-indigo-600',  bg: 'bg-indigo-50' },
          { label: 'Pending',   val: counts.Pending,     color: 'text-amber-600',   bg: 'bg-amber-50' },
          { label: 'Completed', val: counts.Completed,   color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white`}>
            <p className="text-xs font-semibold text-slate-500 mb-1">{s.label}</p>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex-1">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer or vehicle…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none text-slate-700 placeholder-slate-300"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {s !== 'All' && cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                {s} <span className="opacity-70">({counts[s] ?? filtered.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-slate-500 font-medium">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <BookingCard key={b.id} b={b} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
