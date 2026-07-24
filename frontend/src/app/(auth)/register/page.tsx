import AuthLayout from "@/components/auth/AuthLayout";
import GuestGuard from "@/components/auth/GuestGuard";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <GuestGuard>
      <AuthLayout
        title="Create Account"
        subtitle="Create your account to get started."
      >
        <RegisterForm />
      </AuthLayout>
    </GuestGuard>
  );
}