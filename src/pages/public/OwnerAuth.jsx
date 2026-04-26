import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car, Mail, Phone, User, Building2, Lock, ArrowRight,
  ShieldCheck, CheckCircle2, Eye, EyeOff, ChevronLeft,
  KeyRound, RefreshCw, TrendingUp, IndianRupee, Users, Star, Zap
} from 'lucide-react';

// ── Shared Input ─────────────────────────────────────────────────────────────
function Field({ icon, label, type = 'text', placeholder, value, onChange, required = true, extra }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <span className="text-slate-400 shrink-0">{icon}</span>
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 focus:outline-none"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)} className="text-slate-400 hover:text-slate-600">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
        {extra}
      </div>
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ['Details', 'OTP', 'Done'];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
            i < current ? 'bg-emerald-500 text-white' :
            i === current ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
            'bg-slate-100 text-slate-400'
          }`}>
            {i < current ? <CheckCircle2 size={16} /> : i + 1}
          </div>
          <span className={`text-xs font-semibold hidden sm:block ${i === current ? 'text-indigo-700' : i < current ? 'text-emerald-600' : 'text-slate-400'}`}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 ${i < current ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Register Flow ─────────────────────────────────────────────────────────────
function RegisterFlow() {
  const [step, setStep] = useState(0); // 0=form, 1=otp, 2=success
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', password: '', confirm: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setStep(1);
    }, 1500);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the 6-digit OTP.'); return; }
    setLoading(true);
    setError('');
    // Simulate OTP verification (accept any 6-digit code for demo)
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const resendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    // simulate resend
  };

  if (step === 2) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={42} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Registration Successful!</h3>
        <p className="text-slate-500 mb-2">Welcome to RentHub, <span className="font-semibold text-slate-700">{form.name}</span>!</p>
        <p className="text-slate-500 text-sm mb-8">Your owner account has been verified and is under review. We'll notify you at <span className="text-indigo-600 font-semibold">{form.email}</span>.</p>
        <Link to="/" className="btn btn-primary px-8 py-3">Go to Home</Link>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div>
        <Steps current={1} />
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <KeyRound size={28} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Check your email</h3>
          <p className="text-slate-500 text-sm mt-1">We sent a 6-digit OTP to</p>
          <p className="text-indigo-600 font-bold">{form.email}</p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">Enter OTP</label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(e.target.value, idx)}
                  onKeyDown={e => handleOtpKeyDown(e, idx)}
                  className="w-11 h-13 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
                  style={{ height: '3.25rem' }}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-rose-500 text-xs text-center bg-rose-50 py-2 px-3 rounded-lg">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 text-sm font-bold rounded-xl disabled:opacity-60">
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Verifying...
              </span>
            ) : 'Verify & Complete Registration'}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => { setStep(0); setOtp(['','','','','','']); }} className="text-slate-500 hover:text-slate-700 flex items-center gap-1">
              <ChevronLeft size={14} /> Back
            </button>
            <button type="button" onClick={resendOtp} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">
              <RefreshCw size={13} /> Resend OTP
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Steps current={0} />
      <form onSubmit={handleRegister} className="space-y-4">
        <Field icon={<User size={15} />} label="Full Name" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
        <Field icon={<Building2 size={15} />} label="Rental Company Name" placeholder="Your company or brand name" value={form.company} onChange={e => set('company', e.target.value)} />
        <Field icon={<Mail size={15} />} label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
        <Field icon={<Phone size={15} />} label="Phone Number" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
        <Field icon={<Lock size={15} />} label="Password" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
        <Field icon={<Lock size={15} />} label="Confirm Password" type="password" placeholder="Repeat your password" value={form.confirm} onChange={e => set('confirm', e.target.value)} />

        {error && <p className="text-rose-500 text-xs bg-rose-50 py-2 px-3 rounded-lg">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 text-sm font-bold rounded-xl mt-2 disabled:opacity-60">
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              Sending OTP…
            </span>
          ) : (
            <span className="flex items-center gap-2 justify-center">
              Continue <ArrowRight size={16} />
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

// ── Dummy owner accounts ──────────────────────────────────────────────────────
const DUMMY_OWNERS = [
  { email: 'owner@renthub.com', password: 'owner123', name: 'Rahul Sharma' },
  { email: 'amit@renthub.com',  password: 'amit@123',  name: 'Amit Das' },
];

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const match = DUMMY_OWNERS.find(
        o => o.email === form.email.trim() && o.password === form.password
      );
      setLoading(false);
      if (match) {
        navigate('/owner');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }, 1200);
  };


  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {/* Demo hint */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-xs text-indigo-700">
        <p className="font-bold mb-1">🔑 Demo Credentials</p>
        <p>Email: <span className="font-mono font-semibold">owner@renthub.com</span></p>
        <p>Password: <span className="font-mono font-semibold">owner123</span></p>
      </div>

      <Field icon={<Mail size={15} />} label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
      <Field icon={<Lock size={15} />} label="Password" type="password" placeholder="Your password" value={form.password} onChange={e => set('password', e.target.value)} />

      {error && (
        <p className="text-rose-500 text-xs bg-rose-50 border border-rose-100 py-2 px-3 rounded-lg">{error}</p>
      )}

      <div className="flex justify-end">
        <button type="button" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</button>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 text-sm font-bold rounded-xl disabled:opacity-60">
        {loading ? (
          <span className="flex items-center gap-2 justify-center">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            Logging in…
          </span>
        ) : 'Login to Owner Portal'}
      </button>
    </form>
  );
}

// ── Benefits Panel ────────────────────────────────────────────────────────────
const benefits = [
  {
    icon: <IndianRupee size={22} />,
    title: 'Earn Every Day',
    desc: 'Your idle vehicle earns money. Get daily payouts directly to your bank account.',
  },
  {
    icon: <Users size={22} />,
    title: '10,000+ Active Renters',
    desc: 'Tap into our large verified customer base ready to book your vehicle right now.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Zero Risk Listing',
    desc: 'Every renter is verified. Full insurance coverage & 24/7 support included.',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Grow Your Fleet',
    desc: 'Start with one vehicle and scale up. Our dashboard makes managing easy.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Instant Approvals',
    desc: 'List your vehicle in minutes. Get approved fast and start earning the same day.',
  },
  {
    icon: <Star size={22} />,
    title: 'Top Owner Rewards',
    desc: 'High-rated owners get featured placement and bonus payouts every month.',
  },
];

function BenefitsPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 rounded-3xl text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full" />
      <div className="absolute top-1/2 right-4 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-white/15 rounded-xl">
              <Car size={22} />
            </div>
            <span className="text-lg font-extrabold">RentHub</span>
          </div>
          <h2 className="text-2xl font-extrabold leading-snug mb-2">
            Why Register as<br />an Owner? 🚀
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Join 1,500+ vehicle owners already earning with RentHub. It's simple, safe & rewarding.
          </p>
        </div>

        {/* Benefits list */}
        <div className="space-y-4">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-4 group">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                {b.icon}
              </div>
              <div>
                <p className="font-bold text-sm">{b.title}</p>
                <p className="text-indigo-200 text-xs leading-relaxed mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-3 gap-3 text-center">
          {[
            { val: '₹45K+', label: 'Avg monthly earning' },
            { val: '1,500+', label: 'Active owners' },
            { val: '4.8★', label: 'Owner satisfaction' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xl font-extrabold">{s.val}</p>
              <p className="text-indigo-300 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OwnerAuth() {
  const [tab, setTab] = useState('register');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 flex items-center justify-center px-4 py-12">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-200/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-violet-200/25 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── Left: Form card ── */}
        <div className="w-full">
          {/* Logo (mobile only) */}
          <div className="text-center mb-6 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="p-2 bg-indigo-600 text-white rounded-xl"><Car size={22} /></div>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700">RentHub</span>
            </Link>
          </div>

          {/* Logo (desktop, above card) */}
          <div className="hidden lg:flex items-center gap-2 mb-5">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-600 text-white rounded-xl group-hover:bg-indigo-700 transition-colors"><Car size={22} /></div>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700">RentHub</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${tab === 'register' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Register as Owner
              </button>
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${tab === 'login' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Already Registered? Login
              </button>
            </div>

            <div className="p-7">
              {tab === 'register' ? <RegisterFlow /> : <LoginForm />}
            </div>
          </div>

          {/* Nudge */}
          {tab === 'register' && (
            <p className="text-center text-sm text-slate-500 mt-4">
              Already registered?{' '}
              <button onClick={() => setTab('login')} className="text-indigo-600 font-semibold hover:underline">
                Please Login →
              </button>
            </p>
          )}

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-500" /> Secure & Encrypted</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={13} className="text-indigo-400" /> OTP Verified</span>
          </div>
        </div>

        {/* ── Right: Benefits panel ── */}
        <BenefitsPanel />
      </div>
    </div>
  );
}
