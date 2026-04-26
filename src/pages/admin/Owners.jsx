import { useState } from 'react';
import { vehicles, bookings } from '../../data/dummyData';
import {
  Search, MapPin, Phone, Mail, Car, CalendarCheck,
  CheckCircle2, XCircle, AlertCircle, ToggleLeft, ToggleRight,
  ArrowLeft, User, Star, Fuel, Settings2, Users, ChevronRight,
  BadgeCheck, Building2
} from 'lucide-react';

// ── Build owner list from vehicles data ───────────────────────────────────────
const buildOwners = () => {
  const map = {};
  vehicles.forEach(v => {
    const o = v.owner;
    if (!map[o.id]) {
      map[o.id] = {
        id: o.id,
        name: o.name,
        rating: o.rating,
        email: `${o.name.toLowerCase().replace(' ', '.')}@renthub.com`,
        phone: `+91 9${o.id === 'o1' ? '876543210' : '123456789'}`,
        address: o.id === 'o1' ? 'Guwahati, Assam' : 'Shillong, Meghalaya',
        company: o.id === 'o1' ? 'Sharma Rentals' : 'Das Motors',
        joinedDate: '2023-01-15',
        active: true,
        vehicles: [],
      };
    }
    map[o.id].vehicles.push(v);
  });
  return Object.values(map);
};

const STATUS_CFG = {
  Confirmed: { color: 'bg-indigo-100 text-indigo-700', icon: <CheckCircle2 size={12} />, dot: 'bg-indigo-500' },
  Completed: { color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={12} />, dot: 'bg-emerald-500' },
  Pending:   { color: 'bg-amber-100 text-amber-700',   icon: <AlertCircle size={12} />,  dot: 'bg-amber-500' },
  Cancelled: { color: 'bg-rose-100 text-rose-600',     icon: <XCircle size={12} />,      dot: 'bg-rose-500' },
};

const V_STATUS = {
  Available: 'bg-emerald-100 text-emerald-700',
  Booked:    'bg-amber-100 text-amber-700',
};

function getDays(s, e) {
  return Math.max(1, Math.round((new Date(e) - new Date(s)) / 86400000));
}

// ── Back button ───────────────────────────────────────────────────────────────
function BackBtn({ onClick, label = 'Back to Owners' }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
    >
      <ArrowLeft size={15} /> {label}
    </button>
  );
}

// ── Owner gradient header card ────────────────────────────────────────────────
function OwnerBanner({ owner, stats, tab, onTabChange }) {
  const ownerBookings = bookings.filter(b => owner.vehicles.map(v => v.id).includes(b.vehicleId));
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-6 text-white">
      <div className="flex flex-wrap items-center gap-5 mb-5">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-extrabold shrink-0">
          {owner.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-extrabold text-xl">{owner.name}</p>
            {owner.active && <BadgeCheck size={18} className="text-emerald-300" />}
          </div>
          <p className="text-indigo-200 text-sm flex items-center gap-1.5">
            <Building2 size={13} /> {owner.company}
          </p>
          <p className="text-indigo-300 text-xs mt-1 flex items-center gap-1.5">
            <MapPin size={12} /> {owner.address}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Vehicles', val: owner.vehicles.length },
            { label: 'Bookings', val: ownerBookings.length },
            { label: 'Rating',   val: `${owner.rating}★` },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold">{s.val}</p>
              <p className="text-indigo-300 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Sub-tabs */}
      {onTabChange && (
        <div className="flex gap-2 border-t border-white/20 pt-4">
          {['Profile', 'Bookings'].map(t => (
            <button
              key={t}
              onClick={() => onTabChange(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white text-indigo-700' : 'bg-white/15 hover:bg-white/25 text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Owner Profile View ────────────────────────────────────────────────────────
function OwnerProfile({ owner, onBack }) {
  const [tab, setTab] = useState('Profile');
  const ownerVehicleIds = owner.vehicles.map(v => v.id);
  const ownerBookings = bookings.filter(b => ownerVehicleIds.includes(b.vehicleId));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackBtn onClick={onBack} />
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">{owner.name}</h2>
          <p className="text-slate-500 text-sm">{owner.company}</p>
        </div>
      </div>

      <OwnerBanner owner={owner} tab={tab} onTabChange={setTab} />

      {tab === 'Profile' && (
        <div className="space-y-5">
          {/* Contact info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: <Mail size={14} />,     label: 'Email',   val: owner.email },
                { icon: <Phone size={14} />,    label: 'Phone',   val: owner.phone },
                { icon: <MapPin size={14} />,   label: 'Address', val: owner.address },
                { icon: <Building2 size={14} />,label: 'Company', val: owner.company },
                { icon: <Star size={14} />,     label: 'Rating',  val: `${owner.rating} ★` },
                { icon: <CalendarCheck size={14} />, label: 'Joined', val: owner.joinedDate },
              ].map(f => (
                <div key={f.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">{f.icon} {f.label}</p>
                  <p className="text-sm font-bold text-slate-800">{f.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle list — no images */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Car size={16} className="text-indigo-500" /> Vehicle List
              </h3>
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
                {owner.vehicles.length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">#</th>
                    <th className="px-5 py-3">Vehicle</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Fuel</th>
                    <th className="px-5 py-3">Transmission</th>
                    <th className="px-5 py-3">Seats</th>
                    <th className="px-5 py-3">Price/Day</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Rating</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {owner.vehicles.map((v, i) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{v.brand} {v.name}</p>
                        <p className="text-xs text-indigo-500">{v.category}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{v.type}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600 flex items-center gap-1 mt-3">
                        <Fuel size={11} className="text-indigo-400" /> {v.fuelType}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        <span className="flex items-center gap-1"><Settings2 size={11} className="text-indigo-400" /> {v.transmission}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        <span className="flex items-center gap-1"><Users size={11} className="text-indigo-400" /> {v.seats}</span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">₹{v.pricePerDay}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MapPin size={11} className="text-indigo-400" /> {v.location}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-bold text-amber-600">{v.rating} ★</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${V_STATUS[v.status] || 'bg-slate-100 text-slate-500'}`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Bookings' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">All Bookings</h3>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
              {ownerBookings.length} total
            </span>
          </div>
          {ownerBookings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-slate-500 text-sm">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Vehicle</th>
                    <th className="px-5 py-3">Dates</th>
                    <th className="px-5 py-3">Duration</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ownerBookings.map(b => {
                    const veh = owner.vehicles.find(v => v.id === b.vehicleId);
                    const days = getDays(b.startDate, b.endDate);
                    const cfg = STATUS_CFG[b.status] || STATUS_CFG.Pending;
                    return (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-slate-900">{b.userName}</td>
                        <td className="px-5 py-3.5 text-slate-600">{veh?.brand} {veh?.name}</td>
                        <td className="px-5 py-3.5 text-slate-500 text-xs">{b.startDate} → {b.endDate}</td>
                        <td className="px-5 py-3.5 text-slate-600">{days}d</td>
                        <td className="px-5 py-3.5 font-bold text-slate-900">₹{b.totalPrice}</td>
                        <td className="px-5 py-3.5">
                          <span className={`flex items-center gap-1 w-fit text-xs font-bold px-2.5 py-1 rounded-lg ${cfg.color}`}>
                            {cfg.icon} {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Admin Owners Page ─────────────────────────────────────────────────────────
export default function AdminOwners() {
  const [owners, setOwners] = useState(buildOwners);
  const [search, setSearch] = useState('');
  const [view, setView] = useState(null); // null | { owner, mode: 'profile' }

  const toggleActive = (id) =>
    setOwners(list => list.map(o => o.id === id ? { ...o, active: !o.active } : o));

  const filtered = owners.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.company.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  if (view) {
    return <OwnerProfile owner={view.owner} onBack={() => setView(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Registered Owners</h2>
          <p className="text-slate-500 text-sm mt-0.5">{owners.length} owners on the platform</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-center">
            <p className="text-xl font-extrabold text-emerald-700">{owners.filter(o => o.active).length}</p>
            <p className="text-xs text-emerald-500">Active</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl text-center">
            <p className="text-xl font-extrabold text-rose-600">{owners.filter(o => !o.active).length}</p>
            <p className="text-xs text-rose-400">Deactivated</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 max-w-md">
        <Search size={15} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by name, company or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm focus:outline-none text-slate-700 placeholder-slate-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Owner</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Address</th>
                <th className="px-5 py-3.5">Vehicles</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(owner => (
                <tr
                  key={owner.id}
                  className={`transition-colors ${!owner.active ? 'opacity-50' : 'hover:bg-slate-50'}`}
                >
                  {/* Owner info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                        {owner.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{owner.name}</p>
                        <p className="text-xs text-indigo-500 font-medium">{owner.company}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail size={11} className="text-indigo-400" /> {owner.email}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone size={11} className="text-indigo-400" /> {owner.phone}
                      </p>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="px-5 py-4">
                    <p className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin size={11} className="text-indigo-400" /> {owner.address}
                    </p>
                  </td>

                  {/* Vehicles */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Car size={13} className="text-indigo-400" />
                      <span className="font-bold text-slate-800">{owner.vehicles.length}</span>
                      <span className="text-xs text-slate-400">vehicles</span>
                    </div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {owner.vehicles.slice(0, 2).map(v => (
                        <span key={v.id} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{v.name}</span>
                      ))}
                      {owner.vehicles.length > 2 && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-medium">+{owner.vehicles.length - 2} more</span>
                      )}
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-5 py-4">
                    <span className="font-bold text-amber-600">{owner.rating} ★</span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${owner.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                      {owner.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1.5">
                      {/* View Profile */}
                      <button
                        onClick={() => setView({ owner })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 transition-colors w-full"
                      >
                        <User size={12} /> View Profile <ChevronRight size={11} className="ml-auto" />
                      </button>

                      {/* Toggle active */}
                      <button
                        onClick={() => toggleActive(owner.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors w-full ${
                          owner.active
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {owner.active
                          ? <><ToggleRight size={12} /> Deactivate</>
                          : <><ToggleLeft size={12} /> Activate</>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    <p className="text-3xl mb-2">👤</p>
                    <p className="text-sm">No owners found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
