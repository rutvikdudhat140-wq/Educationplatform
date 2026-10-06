import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, ShieldCheck, GraduationCap } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`http://localhost:5001/api/user/reset-password/${token}`, { password });
      toast.success('Password has been reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Token might be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-ink flex-row-reverse">
      {/* Left side branding - Deep Navy Desktop */}
      <div className="hidden w-1/2 bg-[#172554] p-10 md:flex flex-col justify-between relative overflow-hidden text-white">
        <div className="relative z-10 flex items-center justify-end gap-3">
          <span className="text-2xl font-bold tracking-tight">EduPlatform</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#172554] font-bold text-xl">
            <GraduationCap size={22} className="text-brand" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center py-10 max-w-lg ml-auto text-right">
          <div className="inline-block rounded bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-white/15 mb-4 ml-auto">
            Security & Authentication
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
            Secure your student account.
          </h1>
          <p className="text-sm text-white/80 font-normal leading-relaxed mt-4">
            Create a strong, unique password to ensure unauthorized access to your admissions, certificates, and scholarship records is prevented.
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/60 text-right">
          © {new Date().getFullYear()} EduPlatform. All rights reserved.
        </div>
      </div>

      {/* Right side form */}
      <div className="flex w-full flex-col justify-center px-6 md:w-1/2 xl:px-20 relative">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-brand mb-4 border border-blue-100">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">Set New Password</h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Your new password must be at least 6 characters long.
            </p>
          </div>

          <div className="bg-white p-8 rounded-md border border-line shadow-none">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-ink-muted">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-10 text-xs rounded-md bg-surface"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-ink-muted">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="h-10 text-xs rounded-md bg-surface"
                />
              </div>

              <Button type="submit" className="w-full h-10 text-xs font-semibold rounded-md bg-brand hover:bg-brand-dark shadow-none mt-2" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Reset Password
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-line text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline">
                <ArrowLeft size={13} /> Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
