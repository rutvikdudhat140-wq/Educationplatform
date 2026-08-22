import SignUpForm from '../../components/auth/SignUpForm';

 function SignUp() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">User Sign Up</h2>
        <SignUpForm />
      </div>
    </div>
  );
}
export default SignUp
