import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post('/api/admin/signup', { name, email, password });
      localStorage.setItem("adminToken", data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('Could not create the account. Check the details and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <Label className="edu-field-label">Full Name</Label>
        <Input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
        Sign Up
      </Button>
      <p className="text-center text-[0.8125rem] text-ink-muted">
        Already have an admin account?{' '}
        <Link to="/login" className="font-semibold text-brand underline-offset-4 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
