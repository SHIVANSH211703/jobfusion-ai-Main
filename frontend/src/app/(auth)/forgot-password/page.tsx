import AuthLayout from "@/components/auth/AuthLayout";
import GuestGuard from "@/components/auth/GuestGuard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link."
    >
      <GuestGuard>
        <ForgotPasswordForm />
      </GuestGuard>
    </AuthLayout>
  );
}