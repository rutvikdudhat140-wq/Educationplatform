import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, KeyRound, GraduationCap } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5001/api/user/forgot-password', { email });
      setIsSent(true);
      toast.success('Password reset link sent to your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-ink">
      {/* Left side branding - Deep Navy Desktop */}
      <div className="hidden w-1/2 bg-[#172554] p-10 md:flex flex-col justify-between relative overflow-hidden text-white">
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#172554] font-bold text-xl">
            <GraduationCap size={22} className="text-brand" />
          </div>
          <span className="text-2xl font-bold tracking-tight">EduPlatform</span>
        </div>

        <div className="relative z-10 flex flex-col justify-center py-10 max-w-lg">
          <div className="inline-block rounded bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-white/15 mb-4 w-fit">
            Account Recovery
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
            Secure password recovery.
          </h1>
          <p className="text-sm text-white/80 font-normal leading-relaxed mt-4">
            Enter your registered email address and we will send you secure verification instructions to reset your account password.
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} EduPlatform. All rights reserved.
        </div>
      </div>

      {/* Right side form */}
      <div className="flex w-full flex-col justify-center px-6 md:w-1/2 xl:px-20 relative">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-brand mb-4 border border-blue-100">
              <KeyRound size={20} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">Forgot Password?</h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Enter your email to receive recovery instructions.
            </p>
          </div>

          <div className="bg-white p-8 rounded-md border border-line shadow-none">
            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-ink-muted">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-10 text-xs rounded-md bg-surface"
                  />
                </div>
                <Button type="submit" className="w-full h-10 text-xs font-semibold rounded-md bg-brand hover:bg-brand-dark shadow-none" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <div className="text-center py-2 space-y-4">
                <p className="text-xs sm:text-sm text-ink-muted">
                  We have dispatched a reset link to <strong className="text-ink">{email}</strong>. Please check your inbox.
                </p>
                <Button variant="outline" className="w-full h-10 text-xs font-semibold rounded-md border-line" onClick={() => setIsSent(false)}>
                  Try Another Email
                </Button>
              </div>
            )}

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
