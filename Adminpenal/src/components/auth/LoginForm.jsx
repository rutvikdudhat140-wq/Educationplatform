import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post('/api/admin/login', { email, password });
      localStorage.setItem("adminToken", data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid email or password.');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <Label className="edu-field-label">Email</Label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label className="edu-field-label">Password</Label>
        <Input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p className="text-[0.8125rem] font-medium text-red-600">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full"
      >
        Login
      </Button>
      <p className="text-center text-[0.8125rem] text-ink-muted">
        Don't have an admin account?{' '}
        <Link to="/signup" className="font-semibold text-brand underline-offset-4 hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
