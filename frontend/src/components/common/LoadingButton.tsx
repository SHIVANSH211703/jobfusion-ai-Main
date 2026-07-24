"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

type LoadingButtonProps = ComponentProps<typeof Button> & {
  loading?: boolean;
  loadingText?: string;
};

export function LoadingButton({
  loading = false,
  loadingText = "Please wait...",
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}

      {loading ? loadingText : children}
    </Button>
  );
}