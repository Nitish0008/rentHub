import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vehicles } from '../../data/dummyData';
import {
  Plus, Pencil, Trash2, Eye, Search,
  X, MapPin, Star, Check, Users, Settings,
  Droplets, Activity, ToggleLeft, ToggleRight,
  ChevronRight, Car, Bike, ImageIcon
} from 'lucide-react';

// Owner's vehicles for demo (owner o1 = Rahul Sharma)
const INITIAL = vehicles
  .filter(v => v.owner.id === 'o1')
  .map(v => ({ ...v, active: true }));

const STATUS_COLORS = {
  Available: 'bg-emerald-100 text-emerald-700',
  Booked:    'bg-amber-100 text-amber-700',
  Inactive:  'bg-slate-100 text-slate-500',
};

const EMPTY_FORM = {
  name: '', brand: '', type: 'Car', category: '',
  pricePerDay: '', location: '', fuelType: 'Petrol',
  transmission: 'Manual', seats: '', status: 'Available',
  description: '', image: '',
};

// ── Drawer Shell ─────────────────────────────────────────────────────────────
function Drawer({ open, onClose, title, subtitle, children, width = 'max-w-xl' }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full ${width} w-full bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-violet-700 shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-white">{title}</h2>
            {subtitle && <p className="text-indigo-200 text-xs mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}

// ── Field helper ──────────────────────────────────────────────────────────────
function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}
const inputCls = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white';

// ── View Drawer ───────────────────────────────────────────────────────────────
function ViewDrawer({ vehicle, open, onClose, onEdit }) {
  if (!vehicle) return null;
  const img = vehicle.images?.[0] || vehicle.image;
  return (
    <Drawer open={open} onClose={onClose} title={`${vehicle.brand} ${vehicle.name}`} subtitle={vehicle.category}>
      {/* Image */}
      <div className="h-52 overflow-hidden">
        <img src={img} alt={vehicle.name} className="w-full h-full object-cover" />
      </div>

      <div className="p-6 space-y-6">
        {/* Status + Price */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold px-3 py-1 rounded-lg ${STATUS_COLORS[vehicle.active ? vehicle.status : 'Inactive']}`}>
            {vehicle.active ? vehicle.status : 'Inactive'}
          </span>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-indigo-700">₹{vehicle.pricePerDay}</span>
            <span className="text-slate-400 text-sm">/day</span>
          </div>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Users size={16} />,    label: 'Seats',        val: vehicle.seats },
            { icon: <Settings size={16} />, label: 'Transmission', val: vehicle.transmission },
            { icon: <Droplets size={16} />, label: 'Fuel',         val: vehicle.fuelType },
            { icon: <MapPin size={16} />,   label: 'Location',     val: vehicle.location },
            { icon: <Activity size={16} />, label: 'Rating',       val: `${vehicle.rating} ★` },
            { icon: <Car size={16} />,      label: 'Type',         val: vehicle.type },
          ].map((s, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
              <span className="text-indigo-400 shrink-0">{s.icon}</span>
              <div>
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="text-sm font-bold text-slate-800">{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</p>
          <p className="text-sm text-slate-600 leading-relaxed">{vehicle.description}</p>
        </div>

        {/* Features */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Features</p>
          <div className="flex flex-wrap gap-2">
            {vehicle.features.map((f, i) => (
              <span key={i} className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                <Check size={11} /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onEdit}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Pencil size={15} /> Edit Vehicle
          </button>
          <Link
            to={`/vehicles/${vehicle.id}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
          >
            <Eye size={15} /> Public View <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </Drawer>
  );
}

// ── Add / Edit Drawer ─────────────────────────────────────────────────────────
function FormDrawer({ open, onClose, vehicle, onSave }) {
  const isEdit = Boolean(vehicle);
  const [form, setForm] = useState(vehicle ? {
    name: vehicle.name, brand: vehicle.brand, type: vehicle.type,
    category: vehicle.category, pricePerDay: vehicle.pricePerDay,
    location: vehicle.location, fuelType: vehicle.fuelType,
    transmission: vehicle.transmission, seats: vehicle.seats,
    status: vehicle.status, description: vehicle.description,
    image: vehicle.images?.[0] || vehicle.image || '',
  } : EMPTY_FORM);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ ...form, id: vehicle?.id || `v${Date.now()}` });
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
      subtitle={isEdit ? `Editing: ${vehicle.brand} ${vehicle.name}` : 'Fill in the details below'}
    >
      <form onSubmit={handleSave} className="p-6 space-y-5">

        {/* Image preview */}
        {form.image && (
          <div className="h-36 rounded-xl overflow-hidden border border-slate-200">
            <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        <FormField label="Image URL">
          <div className="flex gap-2">
            <input
              className={inputCls}
              placeholder="https://…"
              value={form.image}
              onChange={e => set('image', e.target.value)}
            />
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
              <ImageIcon size={16} />
            </div>
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Brand *">
            <input required className={inputCls} placeholder="e.g. Honda" value={form.brand} onChange={e => set('brand', e.target.value)} />
          </FormField>
          <FormField label="Model Name *">
            <input required className={inputCls} placeholder="e.g. Activa 6G" value={form.name} onChange={e => set('name', e.target.value)} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Type *">
            <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
              {['Car', 'Bike', 'Scooter'].map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Category *">
            <input required className={inputCls} placeholder="e.g. SUV, Cruiser" value={form.category} onChange={e => set('category', e.target.value)} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Price / Day (₹) *">
            <input required type="number" min="1" className={inputCls} placeholder="e.g. 80" value={form.pricePerDay} onChange={e => set('pricePerDay', e.target.value)} />
          </FormField>
          <FormField label="Seats *">
            <input required type="number" min="1" max="12" className={inputCls} placeholder="e.g. 5" value={form.seats} onChange={e => set('seats', e.target.value)} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Fuel Type">
            <select className={inputCls} value={form.fuelType} onChange={e => set('fuelType', e.target.value)}>
              {['Petrol', 'Diesel', 'Electric', 'CNG'].map(f => <option key={f}>{f}</option>)}
            </select>
          </FormField>
          <FormField label="Transmission">
            <select className={inputCls} value={form.transmission} onChange={e => set('transmission', e.target.value)}>
              {['Manual', 'Automatic'].map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>
        </div>

        <FormField label="Location *">
          <input required className={inputCls} placeholder="City / Area" value={form.location} onChange={e => set('location', e.target.value)} />
        </FormField>

        <FormField label="Status">
          <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
            {['Available', 'Booked'].map(s => <option key={s}>{s}</option>)}
          </select>
        </FormField>

        <FormField label="Description">
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="Brief description of the vehicle…"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </FormField>

        {/* Footer buttons */}
        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-200">
            {isEdit ? '✓ Save Changes' : '+ Add Vehicle'}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

// ── Main Listings Page ────────────────────────────────────────────────────────
export default function Listings() {
  const [list, setList] = useState(INITIAL);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Drawer state
  const [viewVehicle, setViewVehicle]   = useState(null);
  const [editVehicle, setEditVehicle]   = useState(null);
  const [showAddForm, setShowAddForm]   = useState(false);
  const [viewOpen, setViewOpen]         = useState(false);
  const [editOpen, setEditOpen]         = useState(false);

  const openView = (v) => { setViewVehicle(v); setViewOpen(true); };
  const openEdit = (v) => { setEditVehicle(v); setEditOpen(true); setViewOpen(false); };
  const openAdd  = ()  => { setShowAddForm(true); };

  const handleSave = (form) => {
    if (editVehicle) {
      setList(l => l.map(v => v.id === form.id ? { ...v, ...form } : v));
    } else {
      setList(l => [...l, {
        ...form,
        id: form.id,
        active: true,
        rating: 0,
        reviews: 0,
        owner: { id: 'o1', name: 'Rahul Sharma', rating: 4.9 },
        features: [],
        images: [form.image],
        image: form.image,
      }]);
    }
  };

  const toggleActive = (id) => setList(l => l.map(v => v.id === id ? { ...v, active: !v.active } : v));
  const deleteVehicle = (id) => setList(l => l.filter(v => v.id !== id));

  const filtered = list.filter(v => {
    const matchType   = filterType === 'All' || v.type === filterType;
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                        v.brand.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">My Listings</h2>
          <p className="text-slate-500 text-sm mt-0.5">{list.length} vehicles listed on RentHub</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus size={16} /> Add New Vehicle
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex-1">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none text-slate-700 placeholder-slate-300"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Car', 'Bike', 'Scooter'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                filterType === t
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <p className="text-5xl mb-3">🚗</p>
          <p className="text-slate-500 font-medium">No listings found</p>
          <button onClick={openAdd} className="mt-4 btn btn-primary px-6 py-2.5 text-sm">
            <Plus size={15} className="mr-1" /> Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(v => {
            const img = v.images?.[0] || v.image;
            return (
              <div
                key={v.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${!v.active ? 'opacity-60 border-slate-100' : 'border-slate-200'}`}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img src={img} alt={v.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${STATUS_COLORS[v.active ? v.status : 'Inactive']}`}>
                      {v.active ? v.status : 'Inactive'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-lg">
                    ₹{v.pricePerDay}/day
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold text-slate-800">
                    <Star size={11} className="text-amber-500 fill-amber-500" /> {v.rating || '—'}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{v.category}</p>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">{v.brand} {v.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={11} /> {v.location} · {v.fuelType} · {v.transmission}
                  </p>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => openView(v)}
                      className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors"
                    >
                      <Eye size={13} /> View
                    </button>
                    <button
                      onClick={() => openEdit(v)}
                      className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => toggleActive(v.id)}
                      className={`flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg text-xs font-semibold transition-colors ${
                        v.active
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {v.active ? <><ToggleRight size={13} /> Deactivate</> : <><ToggleLeft size={13} /> Activate</>}
                    </button>
                    <button
                      onClick={() => deleteVehicle(v.id)}
                      className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Drawers ── */}
      <ViewDrawer
        vehicle={viewVehicle}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onEdit={() => openEdit(viewVehicle)}
      />
      <FormDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        vehicle={editVehicle}
        onSave={handleSave}
      />
      <FormDrawer
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        vehicle={null}
        onSave={handleSave}
      />
    </div>
  );
}
