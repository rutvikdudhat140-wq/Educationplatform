import SignUpForm from '../../components/auth/SignUpForm';
import AuthShell from '../../components/auth/AuthShell';

function SignUp() {
  return (
    <AuthShell
      wide
      badge="Candidate Registration"
      headline="Build your personalized college admission profile."
      sub="Join thousands of students getting accurate rank predictors, verified college data, and expert career roadmaps."
      title="Stay Connected with Us"
      subtitle="Enhance your experience with some insights about you."
    >
      <SignUpForm />
    </AuthShell>
  );
}

export default SignUp;
