import AuthLayout from "@/components/auth/AuthLayout";
import GuestGuard from "@/components/auth/GuestGuard";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue."
    >
      <GuestGuard>
        <LoginForm />
      </GuestGuard>
    </AuthLayout>
  );
}