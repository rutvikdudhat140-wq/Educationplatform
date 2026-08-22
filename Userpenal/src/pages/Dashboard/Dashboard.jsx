import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5001/api/user/logout'
      );

      localStorage.removeItem('userToken');
      localStorage.removeItem('user');

      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <header className="border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <h1 className="text-xl font-bold text-black">
            User Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm text-gray-800"
          >
            Logout
          </button>

        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">

        <p className="text-lg text-black">
          Welcome, {user?.name}
        </p>

        <p className="text-gray-500 mt-1">
          {user?.email}
        </p>

        <Link
          to="/change-password"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Change Password
        </Link>

      </main>

    </div>
  );
}
