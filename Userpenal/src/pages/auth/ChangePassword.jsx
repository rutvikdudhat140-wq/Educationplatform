import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(
        'http://localhost:5001/api/user/change-password',
        { currentPassword: form.currentPassword, newPassword: form.newPassword, confirmPassword: form.confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    { key: 'currentPassword', label: 'Current Password', showKey: 'current', placeholder: 'Enter current password' },
    { key: 'newPassword', label: 'New Password', showKey: 'new', placeholder: 'Enter new password' },
    { key: 'confirmPassword', label: 'Confirm New Password', showKey: 'confirm', placeholder: 'Confirm new password' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-line h-[56px] flex items-center px-4 gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-md bg-surface flex items-center justify-center border border-line">
          <ArrowLeft size={18} className="text-ink" />
        </button>
        <h1 className="text-base font-bold text-ink">Change Password</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block max-w-xl mx-auto px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-ink">Change Password</h1>
        <p className="text-ink-muted text-xs mt-1">Update your account password</p>
      </div>

      <div className="max-w-xl mx-auto px-4 md:px-6 pt-4 pb-20">
        {success ? (
          <div className="bg-white rounded-md p-8 text-center border border-line shadow-none">
            <div className="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <CheckCircle className="w-6 h-6 text-brand" />
            </div>
            <h2 className="text-lg font-bold text-ink mb-1">Password Updated</h2>
            <p className="text-ink-muted text-xs mb-5">Your password has been changed successfully.</p>
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-brand hover:bg-brand-dark text-white py-2.5 rounded-md font-semibold text-xs transition-colors shadow-none"
            >
              Back to Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-md p-6 border border-line shadow-none space-y-4">
            {/* Icon */}
            <div className="flex justify-center mb-1">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-center">
                <Lock className="w-6 h-6 text-brand" />
              </div>
            </div>

            <div className="text-center mb-3">
              <h2 className="text-base font-bold text-ink">Update Password</h2>
              <p className="text-xs text-ink-muted mt-0.5">Choose a strong password with at least 6 characters</p>
            </div>

            {inputs.map(({ key, label, showKey, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-ink mb-1">{label}</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock size={14} className="text-ink-muted" />
                  </div>
                  <input
                    type={show[showKey] ? 'text' : 'password'}
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    className="w-full border border-line bg-surface rounded-md py-2 pl-9 pr-9 text-xs text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {show[showKey]
                      ? <EyeOff size={14} className="text-ink-muted" />
                      : <Eye size={14} className="text-ink-muted" />
                    }
                  </button>
                </div>
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-md px-3 py-2 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-white py-2.5 rounded-md font-semibold text-xs mt-2 disabled:opacity-60 transition-colors shadow-none"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
