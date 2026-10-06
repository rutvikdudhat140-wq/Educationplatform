import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Check } from 'lucide-react';

const fieldCls =
  'w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none transition focus:border-[#172554] focus:ring-2 focus:ring-[#172554]/10 disabled:opacity-60';
const labelCls = 'block text-[13px] font-semibold text-[#111827] mb-1.5';

const strengthOf = (pw) => {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 8 && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

export default function SignUpForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = strengthOf(password);
  const strengthMeta = [
    { t: '', c: 'bg-[#E5E7EB]' },
    { t: 'Weak', c: 'bg-[#DC2626]' },
    { t: 'Good', c: 'bg-[#F59E0B]' },
    { t: 'Strong', c: 'bg-[#16A34A]' },
  ][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (!agree) {
      toast.error('Please accept the terms to continue.');
      return;
    }

    setLoading(true);
    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/user/signup`, {
        name,
        email,
        password,
        phone: phone ? `+91${phone}` : '',
      });
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', JSON.stringify({ ...response.data.user, gender }));
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className={labelCls}>First Name</label>
          <input id="firstName" className={fieldCls} placeholder="Enter your first name" value={firstName}
            onChange={(e) => setFirstName(e.target.value)} disabled={loading} autoComplete="given-name" />
        </div>
        <div>
          <label htmlFor="lastName" className={labelCls}>Last Name</label>
          <input id="lastName" className={fieldCls} placeholder="Enter your surname" value={lastName}
            onChange={(e) => setLastName(e.target.value)} disabled={loading} autoComplete="family-name" />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelCls}>Mobile Number</label>
        <div className="flex h-12 rounded-lg border border-[#D1D5DB] bg-white overflow-hidden focus-within:border-[#172554] focus-within:ring-2 focus-within:ring-[#172554]/10 transition">
          <div className="flex items-center gap-1.5 px-3 border-r border-[#D1D5DB] text-[14px] text-[#374151] shrink-0">
            <span className="text-lg leading-none">🇮🇳</span>
            <span>+91</span>
          </div>
          <input id="phone" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} disabled={loading}
            className="flex-1 min-w-0 px-3 text-[14px] outline-none bg-transparent placeholder:text-[#9CA3AF]" autoComplete="tel-national" />
        </div>
      </div>

      <div>
        <label className={labelCls}>Gender</label>
        <div className="flex gap-2">
          {[{ v: 'Male', e: '👨🏻‍💼' }, { v: 'Female', e: '👩🏻‍💼' }].map((g) => (
            <button type="button" key={g.v} onClick={() => setGender(g.v)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold border transition active:scale-95 ${
                gender === g.v ? 'border-[#172554] bg-white text-[#172554]' : 'border-transparent bg-[#F3F4F6] text-[#374151]'
              }`}>
              <span className="text-base">{g.e}</span>{g.v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>Email</label>
        <input id="email" type="email" className={fieldCls} placeholder="you@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)} disabled={loading} autoComplete="email" />
      </div>

      <div>
        <label htmlFor="password" className={labelCls}>Password</label>
        <div className="relative">
          <input id="password" type={showPw ? 'text' : 'password'} className={`${fieldCls} pr-11`}
            placeholder="Create a password (min. 6 characters)" value={password}
            onChange={(e) => setPassword(e.target.value)} disabled={loading} autoComplete="new-password" />
          <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#172554]">
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {password && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex flex-1 gap-1">
              {[1, 2, 3].map((i) => (
                <span key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthMeta.c : 'bg-[#E5E7EB]'}`} />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-[#6B7280]">{strengthMeta.t}</span>
          </div>
        )}
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <span onClick={() => setAgree((a) => !a)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${agree ? 'bg-[#172554] border-[#172554]' : 'border-[#9CA3AF] bg-white'}`}>
          {agree && <Check size={13} className="text-white" strokeWidth={3} />}
        </span>
        <span className="text-[12px] text-[#6B7280] leading-snug">
          I agree to the Terms of Use and Privacy Policy and to receive admission updates.
        </span>
      </label>

      <button type="submit" disabled={loading}
        className="w-full h-12 rounded-lg bg-[#172554] text-white text-[15px] font-semibold flex items-center justify-center gap-2 hover:bg-[#1e3a8a] active:scale-[0.99] transition disabled:opacity-70">
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-[13px] text-[#6B7280]">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[#2563EB] hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
