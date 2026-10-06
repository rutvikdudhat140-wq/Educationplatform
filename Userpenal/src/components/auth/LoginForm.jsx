import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const fieldCls =
  'w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none transition focus:border-[#172554] focus:ring-2 focus:ring-[#172554]/10 disabled:opacity-60';
const labelCls = 'block text-[13px] font-semibold text-[#111827] mb-1.5';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}`}/user/login`, { email, password });
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className={labelCls}>Email</label>
        <input id="email" type="email" className={fieldCls} placeholder="you@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)} disabled={loading} autoComplete="email" required />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="text-[13px] font-semibold text-[#111827]">Password</label>
          <Link to="/forgot-password" className="text-[12px] font-semibold text-[#2563EB] hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input id="password" type={showPw ? 'text' : 'password'} className={`${fieldCls} pr-11`}
            placeholder="Enter your password" value={password}
            onChange={(e) => setPassword(e.target.value)} disabled={loading} autoComplete="current-password" required />
          <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#172554]">
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full h-12 rounded-lg bg-[#172554] text-white text-[15px] font-semibold flex items-center justify-center gap-2 hover:bg-[#1e3a8a] active:scale-[0.99] transition disabled:opacity-70">
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-[13px] text-[#6B7280] pt-1">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-[#2563EB] hover:underline">Create an account</Link>
      </p>
    </form>
  );
}
