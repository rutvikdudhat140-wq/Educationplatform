import LoginForm from '../../components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold tracking-tight">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
        <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
