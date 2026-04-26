import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vehicles } from '../../data/dummyData';
import {
  MapPin, User, ChevronLeft, Check, ShieldCheck, Settings,
  Droplets, Users, Activity, Star, ChevronRight, Phone,
  FileText, Calendar, BadgeCheck, X
} from 'lucide-react';

// ── Image Slideshow ─────────────────────────────────────────────────────────
function ImageSlider({ images, name }) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl">
      {/* Main image */}
      <div className="relative h-[340px] md:h-[420px] overflow-hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${name} ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all"
        >
          <ChevronRight size={20} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 p-3 bg-slate-800">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`flex-1 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === current ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60 hover:opacity-90'}`}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function VehicleDetails() {
  const { id } = useParams();
  const vehicle = vehicles.find(v => v.id === id) || vehicles[0];
  const images = vehicle.images || [vehicle.image, vehicle.image, vehicle.image];
  const relatedVehicles = vehicles.filter(v => v.type === vehicle.type && v.id !== vehicle.id).slice(0, 3);

  const [activeTab, setActiveTab] = useState('details');
  const [bookingStatus, setBookingStatus] = useState('idle');

  // Form state
  const [form, setForm] = useState({
    vehicleName: `${vehicle.brand} ${vehicle.name}`,
    userName: '',
    phone: '',
    location: vehicle.location,
    hasLicence: '',
    pickupDate: '',
    dropDate: '',
    rentalPeriod: '',
  });

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Auto-calculate rental days and price
  const { days, totalPrice } = useMemo(() => {
    if (form.pickupDate && form.dropDate) {
      const d1 = new Date(form.pickupDate);
      const d2 = new Date(form.dropDate);
      const diff = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
      return { days: diff, totalPrice: diff * vehicle.pricePerDay + 15 };
    }
    return { days: 0, totalPrice: 0 };
  }, [form.pickupDate, form.dropDate, vehicle.pricePerDay]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setBookingStatus('loading');
    setTimeout(() => setBookingStatus('success'), 1500);
  };

  const tabs = ['details', 'features'];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">

      {/* ── Header Banner ── */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border-b border-slate-800 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors mb-4">
            <ChevronLeft size={16} className="mr-1" /> Back to listings
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {vehicle.category}
                </span>
                <span className="flex items-center text-sm text-slate-400">
                  <MapPin size={14} className="mr-1 text-indigo-400" />{vehicle.location}
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${vehicle.status === 'Available' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-rose-900/50 text-rose-400'}`}>
                  {vehicle.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">{vehicle.brand} {vehicle.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="text-white font-bold">{vehicle.rating}</span>
                <span className="text-slate-400 text-sm">({vehicle.reviews} reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Rental price</p>
              <p className="text-4xl font-extrabold text-white">₹{vehicle.pricePerDay}<span className="text-lg font-normal text-slate-400">/day</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Images + Info ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image slider */}
            <ImageSlider images={images} name={vehicle.name} />

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex border-b border-slate-100">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {tab === 'details' ? 'Vehicle Info' : 'Features & Specs'}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-3">About the Vehicle</h3>
                      <p className="text-slate-600 leading-relaxed">{vehicle.description}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { icon: <Users size={20} />, label: 'Seats', val: vehicle.seats },
                        { icon: <Settings size={20} />, label: 'Transmission', val: vehicle.transmission },
                        { icon: <Droplets size={20} />, label: 'Fuel', val: vehicle.fuelType },
                        { icon: <Activity size={20} />, label: 'Rating', val: `${vehicle.rating} ★` },
                      ].map((s, i) => (
                        <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                          <span className="text-indigo-500">{s.icon}</span>
                          <div>
                            <p className="text-xs text-slate-400">{s.label}</p>
                            <p className="font-bold text-slate-900 text-sm">{s.val}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-5">Premium Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {vehicle.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                            <Check size={14} className="text-white" />
                          </div>
                          <span className="text-slate-700 font-medium text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Owner card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-extrabold shrink-0">
                {vehicle.owner.name[0]}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold text-slate-900 text-lg">{vehicle.owner.name}</h4>
                <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                  <ShieldCheck size={14} className="text-emerald-500" /> Verified Owner
                  <span className="ml-2 text-amber-500 font-semibold">★ {vehicle.owner.rating}</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Booking Form ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 sticky top-24 overflow-hidden">

              {/* Form header */}
              <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-5">
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Book This Vehicle</p>
                <h3 className="text-white font-extrabold text-xl leading-tight">{vehicle.brand} {vehicle.name}</h3>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-white">₹{vehicle.pricePerDay}</span>
                  <span className="text-indigo-200 mb-1">/ day</span>
                </div>
              </div>

              {bookingStatus === 'success' ? (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Sent!</h3>
                  <p className="text-slate-500 text-sm mb-2">Vehicle: <span className="font-semibold text-slate-700">{vehicle.brand} {vehicle.name}</span></p>
                  <p className="text-slate-500 text-sm mb-6">The owner will confirm your request shortly.</p>
                  <button onClick={() => setBookingStatus('idle')} className="btn btn-secondary w-full py-3">
                    Make Another Booking
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                  {/* Vehicle name (readonly) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Vehicle</label>
                    <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                      <FileText size={15} className="text-indigo-400 shrink-0" />
                      <span className="text-indigo-700 font-semibold text-sm">{form.vehicleName}</span>
                    </div>
                  </div>

                  {/* User name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all bg-white">
                      <User size={15} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={form.userName}
                        onChange={e => setField('userName', e.target.value)}
                        className="flex-1 bg-transparent text-sm focus:outline-none text-slate-700 placeholder-slate-300"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all bg-white">
                      <Phone size={15} className="text-slate-400 shrink-0" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => setField('phone', e.target.value)}
                        className="flex-1 bg-transparent text-sm focus:outline-none text-slate-700 placeholder-slate-300"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pickup Location *</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all bg-white">
                      <MapPin size={15} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        required
                        placeholder="City / Area"
                        value={form.location}
                        onChange={e => setField('location', e.target.value)}
                        className="flex-1 bg-transparent text-sm focus:outline-none text-slate-700 placeholder-slate-300"
                      />
                    </div>
                  </div>

                  {/* Pickup & Drop dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pickup Date *</label>
                      <input
                        type="date"
                        required
                        value={form.pickupDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setField('pickupDate', e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Drop Date *</label>
                      <input
                        type="date"
                        required
                        value={form.dropDate}
                        min={form.pickupDate || new Date().toISOString().split('T')[0]}
                        onChange={e => setField('dropDate', e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Driving Licence */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Do you have a valid Driving Licence? *</label>
                    <div className="flex gap-3">
                      {['Yes', 'No'].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setField('hasLicence', opt)}
                          className={`flex-1 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
                            form.hasLicence === opt
                              ? opt === 'Yes'
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200'
                                : 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {opt === 'Yes' ? '✓ ' : '✗ '}{opt}
                        </button>
                      ))}
                    </div>
                    {form.hasLicence === 'No' && (
                      <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                        <X size={12} /> A valid licence is required to rent.
                      </p>
                    )}
                  </div>

                  {/* Price Summary */}
                  {days > 0 && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>₹{vehicle.pricePerDay} × {days} day{days > 1 ? 's' : ''}</span>
                        <span>₹{vehicle.pricePerDay * days}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Service fee</span>
                        <span>₹15</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-slate-900 text-base pt-2 border-t border-slate-200">
                        <span>Total</span>
                        <span className="text-indigo-700">₹{totalPrice}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingStatus === 'loading' || form.hasLicence === 'No'}
                    className="btn btn-primary w-full py-4 text-base font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingStatus === 'loading' ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        Processing...
                      </span>
                    ) : 'Confirm Booking Request'}
                  </button>
                  <p className="text-center text-xs text-slate-400">You won't be charged until the owner confirms.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Similar Vehicles ── */}
      {relatedVehicles.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
            Similar <span className="text-indigo-600">{vehicle.type}s</span> You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedVehicles.map(v => (
              <Link
                to={`/vehicles/${v.id}`}
                key={v.id}
                onClick={() => window.scrollTo(0, 0)}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={v.images ? v.images[0] : v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    ₹{v.pricePerDay}/day
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star size={11} className="text-amber-500 fill-amber-500" /> {v.rating}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{v.category}</p>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{v.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={11} /> {v.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
