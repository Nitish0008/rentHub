import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Calendar, ArrowRight, ShieldCheck, Zap,
  HeadphonesIcon, Car, Bike, Star, SlidersHorizontal, X
} from 'lucide-react';
import { vehicles } from '../../data/dummyData';

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    key: 'All',
    label: 'All Vehicles',
    emoji: '🚀',
    gradient: 'from-violet-500 to-indigo-600',
    light: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    active: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-lg shadow-indigo-300/40',
  },
  {
    key: 'Car',
    label: 'Cars',
    emoji: '🚗',
    gradient: 'from-blue-500 to-cyan-500',
    light: 'bg-blue-50 text-blue-700 border-blue-200',
    active: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-lg shadow-blue-300/40',
  },
  {
    key: 'Bike',
    label: 'Bikes',
    emoji: '🏍️',
    gradient: 'from-orange-500 to-rose-500',
    light: 'bg-orange-50 text-orange-700 border-orange-200',
    active: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white border-transparent shadow-lg shadow-orange-300/40',
  },
  {
    key: 'Scooter',
    label: 'Scooters',
    emoji: '🛵',
    gradient: 'from-emerald-500 to-teal-500',
    light: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    active: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-lg shadow-emerald-300/40',
  },
];

const MAX_PRICE = 200;

function VehicleCard({ v }) {
  const statusColor = v.status === 'Available'
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-rose-100 text-rose-600';

  const typeEmoji = v.type === 'Car' ? '🚗' : v.type === 'Bike' ? '🏍️' : '🛵';

  return (
    <Link
      to={`/vehicles/${v.id}`}
      className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/80 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={v.image}
          alt={v.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold px-2 py-1 rounded-lg">
            {typeEmoji} {v.type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm ${statusColor}`}>
            {v.status}
          </span>
        </div>

        {/* Rating bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-slate-800">{v.rating}</span>
          <span className="text-xs text-slate-500">({v.reviews})</span>
        </div>

        {/* Price bottom right */}
        <div className="absolute bottom-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-lg">
          <span className="text-sm font-extrabold">₹{v.pricePerDay}</span>
          <span className="text-xs opacity-80">/day</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="mb-1">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{v.category}</p>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight">
            {v.name}
          </h3>
        </div>

        <div className="flex items-center text-sm text-slate-500 gap-1 mt-1 mb-4">
          <MapPin size={13} className="text-indigo-400" />
          <span>{v.location}</span>
          <span className="mx-1.5 text-slate-300">·</span>
          <span>{v.fuelType}</span>
          <span className="mx-1.5 text-slate-300">·</span>
          <span>{v.transmission}</span>
        </div>

        {/* Features pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {v.features.slice(0, 3).map((f, i) => (
            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
              {v.owner.name[0]}
            </div>
            <span className="text-xs text-slate-500">{v.owner.name}</span>
          </div>
          <span className="text-sm font-semibold text-indigo-600 group-hover:underline flex items-center gap-1">
            View Details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minPrice, setMinPrice] = useState(0);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');

  const maxInData = Math.max(...vehicles.map(v => v.pricePerDay));

  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      const typeMatch = activeCategory === 'All' || v.type === activeCategory;
      const priceMatch = v.pricePerDay >= minPrice && v.pricePerDay <= maxPrice;
      const locationMatch = !searchLocation || v.location.toLowerCase().includes(searchLocation.toLowerCase());
      return typeMatch && priceMatch && locationMatch;
    });
  }, [activeCategory, minPrice, maxPrice, searchLocation]);

  const counts = useMemo(() => {
    const all = {};
    CATEGORIES.forEach(c => {
      all[c.key] = c.key === 'All'
        ? vehicles.length
        : vehicles.filter(v => v.type === c.key).length;
    });
    return all;
  }, []);

  const activeCat = CATEGORIES.find(c => c.key === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-800/30" />
          {/* Animated blobs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-sm text-indigo-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Zap size={14} className="fill-current" />
            <span>India's #1 Vehicle Rental Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Find Your Perfect Ride{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>
          <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Premium cars, bikes &amp; scooters — rent by the day, explore without limits.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl">
            <div className="bg-white p-2 rounded-xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-lg border border-slate-100">
                <MapPin className="text-indigo-500 mr-2 shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Search by city…"
                  value={searchLocation}
                  onChange={e => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent py-3 focus:outline-none text-slate-700 placeholder-slate-400"
                />
                {searchLocation && (
                  <button onClick={() => setSearchLocation('')} className="ml-1 text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-lg border border-slate-100">
                <Calendar className="text-indigo-500 mr-2 shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Pickup Date"
                  className="w-full bg-transparent py-3 focus:outline-none text-slate-700"
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => (e.target.type = 'text')}
                />
              </div>
              <button className="btn btn-primary px-8 py-3 w-full md:w-auto text-lg rounded-lg">
                <Search size={20} className="mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* Hero stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
            {[
              { label: 'Vehicles', value: '400+' },
              { label: 'Cities', value: '25+' },
              { label: 'Happy Renters', value: '10K+' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-white">{s.value}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter + Listings Section ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Browse Our <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Fleet</span>
            </h2>
            <p className="mt-3 text-slate-500 text-lg">Filter by type and budget to find your perfect match</p>
          </div>

          {/* ── Category Filter Tabs ── */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-200 ${
                    isActive ? cat.active : cat.light
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20' : 'bg-white/60'}`}>
                    {counts[cat.key]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Price Filter Toggle Row ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span className="font-semibold text-slate-800 text-base">{filtered.length}</span>
              <span>vehicle{filtered.length !== 1 ? 's' : ''} found</span>
              {activeCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {activeCat.emoji} {activeCat.label}
                </span>
              )}
            </div>

            <button
              onClick={() => setShowPriceFilter(p => !p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm transition-all ${
                showPriceFilter
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-700'
              }`}
            >
              <SlidersHorizontal size={16} />
              Price Filter
              {(minPrice > 0 || maxPrice < MAX_PRICE) && (
                <span className="bg-rose-500 text-white text-xs px-1.5 py-0.5 rounded-full">●</span>
              )}
            </button>
          </div>

          {/* ── Price Range Panel ── */}
          {showPriceFilter && (
            <div className="mb-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-lg animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      💰 Price Range <span className="text-slate-400 font-normal">(per day)</span>
                    </label>
                    <span className="text-sm font-bold text-indigo-600">
                      ₹{minPrice} — ₹{maxPrice}
                    </span>
                  </div>

                  {/* Dual range slider using two overlapping range inputs */}
                  <div className="relative h-6 flex items-center mb-1">
                    <div className="absolute left-0 right-0 h-2 bg-slate-100 rounded-full" />
                    <div
                      className="absolute h-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      style={{
                        left: `${(minPrice / MAX_PRICE) * 100}%`,
                        right: `${100 - (maxPrice / MAX_PRICE) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={MAX_PRICE}
                      value={minPrice}
                      onChange={e => {
                        const val = Number(e.target.value);
                        if (val <= maxPrice) setMinPrice(val);
                      }}
                      className="absolute w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-md"
                    />
                    <input
                      type="range"
                      min={0}
                      max={MAX_PRICE}
                      value={maxPrice}
                      onChange={e => {
                        const val = Number(e.target.value);
                        if (val >= minPrice) setMaxPrice(val);
                      }}
                      className="absolute w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-violet-600 [&::-webkit-slider-thumb]:shadow-md"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹0</span>
                    <span>₹{MAX_PRICE}</span>
                  </div>
                </div>

                {/* Quick preset buttons */}
                <div className="flex flex-col gap-2 shrink-0">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Quick Select</p>
                  {[
                    { label: 'Budget (≤₹25)', min: 0, max: 25 },
                    { label: 'Mid (₹25–₹80)', min: 25, max: 80 },
                    { label: 'Premium (₹80+)', min: 80, max: MAX_PRICE },
                  ].map(p => (
                    <button
                      key={p.label}
                      onClick={() => { setMinPrice(p.min); setMaxPrice(p.max); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-600 transition-colors font-medium"
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    onClick={() => { setMinPrice(0); setMaxPrice(MAX_PRICE); }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors font-medium flex items-center gap-1"
                  >
                    <X size={12} /> Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Vehicle Grid ── */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(v => (
                <VehicleCard key={v.id} v={v} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No vehicles found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your filters or price range</p>
              <button
                onClick={() => { setActiveCategory('All'); setMinPrice(0); setMaxPrice(MAX_PRICE); setSearchLocation(''); }}
                className="btn btn-primary px-6 py-2"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Why RentHub ── */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold">Why Choose <span className="text-indigo-400">RentHub?</span></h2>
            <p className="mt-4 text-slate-400 text-lg">The easiest way to rent vehicles with peace of mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { icon: <ShieldCheck size={36} />, title: 'Verified Owners', desc: 'Every vehicle and owner goes through our strict verification process.' },
              { icon: <Zap size={36} />, title: 'Instant Booking', desc: 'No waiting around. Browse, select, and book instantly online.' },
              { icon: <HeadphonesIcon size={36} />, title: '24/7 Support', desc: 'Our dedicated team is ready to assist you any time, anywhere.' },
            ].map((item, i) => (
              <div key={i} className="group flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-indigo-900/50 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
