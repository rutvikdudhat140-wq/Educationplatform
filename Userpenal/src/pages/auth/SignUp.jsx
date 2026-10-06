import SignUpForm from '../../components/auth/SignUpForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

 function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold tracking-tight">User Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
        <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
export default SignUp
