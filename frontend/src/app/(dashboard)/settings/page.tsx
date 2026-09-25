"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Lock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useLogout } from "@/hooks/auth/useLogout";
import authService from "@/services/auth.service";
import { getApiErrorMessage } from "@/lib/api-error";

export default function Page() {
  const { data: user } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const changePasswordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      toast.success("Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Unable to update password."));
    },
  });

  const verificationMutation = useMutation({
    mutationFn: () => authService.sendVerificationEmail(),
    onSuccess: (response) => toast.success(response.message),
    onError: () => toast.error("Unable to send the verification email."),
  });

  const handleChangePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
  };

  return (
    <div className="space-y-6 p-1 md:p-2">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-600">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account and security preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
              {user?.name?.slice(0, 2).toUpperCase() || "JD"}
            </div>

            <div>
              <h2 className="text-lg font-semibold">{user?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email || "No email provided"}</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between rounded-xl border p-3">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium">{user?.role || "Member"}</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-3">
              <span className="text-muted-foreground">Email status</span>
              {user?.isEmailVerified ? (
                <span className="font-medium text-emerald-600">Verified</span>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={verificationMutation.isPending}
                  onClick={() => verificationMutation.mutate()}
                >
                  {verificationMutation.isPending ? "Sending..." : "Send verification email"}
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between rounded-xl border p-3">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
            </div>
          </div>

          <Button
            variant="destructive"
            className="mt-6 w-full"
            onClick={() => logout()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        </div>

        <form onSubmit={handleChangePassword} className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Lock className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Change password</h2>
              <p className="text-sm text-muted-foreground">Keep your account secure with a fresh password.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current password</label>
              <Input
                type="password"
                value={form.currentPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                placeholder="Enter your current password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New password</label>
              <Input
                type="password"
                value={form.newPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                placeholder="Enter a new password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm new password</label>
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                placeholder="Confirm the new password"
              />
            </div>
          </div>

          <Button type="submit" className="mt-6" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? "Updating..." : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}