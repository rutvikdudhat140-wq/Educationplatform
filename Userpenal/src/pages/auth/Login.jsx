import LoginForm from '../../components/auth/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">User Login</h2>
        <LoginForm />
      </div>
    </div>
  );
}
