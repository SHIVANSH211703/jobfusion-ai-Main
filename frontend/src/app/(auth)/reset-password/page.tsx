import AuthLayout from "@/components/auth/AuthLayout";
import GuestGuard from "@/components/auth/GuestGuard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account."
    >
      <GuestGuard>
        <ResetPasswordForm />
      </GuestGuard>
    </AuthLayout>
  );
}