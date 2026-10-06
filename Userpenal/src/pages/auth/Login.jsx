import LoginForm from '../../components/auth/LoginForm';
import AuthShell from '../../components/auth/AuthShell';

function Login() {
  return (
    <AuthShell
      badge="Admissions & Education Intelligence"
      headline="Discover your ideal college & academic pathway."
      sub="Sign in to track your admissions, access verified cutoffs, compare programs, and consult with academic advisors."
      title="Welcome Back"
      subtitle="Sign in to access your applications and recommendations."
    >
      <LoginForm />
    </AuthShell>
  );
}

export default Login;
