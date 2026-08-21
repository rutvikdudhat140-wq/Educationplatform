import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:5001/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('userToken');
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="border-b border-gray-200 p-4 flex justify-between items-center max-w-6xl w-full mx-auto">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm text-gray-800"
        >
          Logout
        </button>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        {user ? (
          <p className="text-lg text-gray-700">Welcome, {user.name} ({user.email})</p>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </main>
    </div>
  );
}
