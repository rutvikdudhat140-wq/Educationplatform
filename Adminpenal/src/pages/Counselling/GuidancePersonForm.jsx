import { useState } from 'react';
import axios from "axios";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GuidancePersonForm = ({ counsellor, onClose, onSaved }) => {
  const isEdit = !!counsellor;

  const [form, setForm] = useState({
    name: counsellor?.name || '',
    email: counsellor?.email || '',
    password: '',
    phone: counsellor?.phone || '',
    image: counsellor?.image || '',
    expertise: counsellor?.expertise?.join(', ') || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required');
      return;
    }

    if (!isEdit && !form.password) {
      setError('Password is required for a new Guidance Person');
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone,
      image: form.image,
      expertise: form.expertise
        ? form.expertise
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    };
    if (!isEdit) payload.password = form.password;

    setSaving(true);

    try {

      if (isEdit) {
        await axios.put(
          `/api/admin/counselling/counsellors/${counsellor._id}`,
          payload
        );
      } else {
        await axios.post(
          '/api/admin/counselling/counsellors',
          payload
        );
      }

      onSaved();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {isEdit ? 'Edit Guidance Person' : 'Add Guidance Person'}
          </h2>

          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink text-xl"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink">
              Name
            </label>
            <Input
              value={form.name}
              onChange={set('name')}
              placeholder="Full name"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">
              Email
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="email@example.com"
              className="mt-1"
            />
          </div>

          {!isEdit && (
            <div>
              <label className="text-sm font-medium text-ink">
                Password
              </label>
              <Input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Set a password"
                className="mt-1"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-ink">
              Phone
            </label>
            <Input
              value={form.phone}
              onChange={set('phone')}
              placeholder="+91 XXXXX XXXXX"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">
              Profile Image URL
            </label>
            <Input
              value={form.image}
              onChange={set('image')}
              placeholder="image"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">
              Description / Expertise
            </label>
            <Input
              value={form.expertise}
              onChange={set('expertise')}
              placeholder="Engineering, MBA, Medical"
              className="mt-1"
            />

            <p className="text-xs text-ink-muted mt-1">
              Separate multiple areas with commas
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand hover:bg-brand-dark"
            >
              {saving
                ? 'Saving…'
                : isEdit
                  ? 'Update'
                  : 'Add Guidance Person'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuidancePersonForm;