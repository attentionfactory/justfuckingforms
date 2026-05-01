"use client";

import { useTransition } from "react";
import type { BillingCycle } from "@jff/types";
import { Button } from "@/components/ui/button";
import { checkoutAction, portalAction } from "./actions";

export function UpgradeButton({
  plan,
  cycle,
  label,
  disabled,
  variant = "outline",
  fullWidth = false,
}: {
  plan: "starter" | "pro";
  cycle: BillingCycle;
  label: string;
  disabled?: boolean;
  variant?: "default" | "outline";
  fullWidth?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await checkoutAction(plan, cycle);
      if (!result.ok) {
        alert(result.error);
        return;
      }
      window.location.href = result.url;
    });
  };

  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled || pending}
      style={fullWidth ? { width: "100%" } : undefined}
    >
      {pending ? "redirecting..." : label}
    </Button>
  );
}

export function ManageSubscriptionButton({
  variant = "default",
  fullWidth = false,
}: {
  variant?: "default" | "outline";
  fullWidth?: boolean;
} = {}) {
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await portalAction();
      if (!result.ok) {
        alert(result.error);
        return;
      }
      window.location.href = result.url;
    });
  };

  return (
    <Button
      onClick={onClick}
      disabled={pending}
      variant={variant === "outline" ? "outline" : undefined}
      style={
        variant === "default"
          ? {
              background: "#fafafa",
              color: "var(--jff-fg)",
              ...(fullWidth ? { width: "100%" } : {}),
            }
          : fullWidth
            ? { width: "100%" }
            : undefined
      }
    >
      {pending ? "opening..." : "manage subscription"}
    </Button>
  );
}
