"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { checkoutAction, portalAction } from "./actions";

export function UpgradeButton({
  plan,
  label,
  disabled,
  variant = "outline",
  fullWidth = false,
}: {
  plan: "starter" | "pro";
  label: string;
  disabled?: boolean;
  variant?: "default" | "outline";
  fullWidth?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await checkoutAction(plan);
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

export function ManageSubscriptionButton() {
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
      style={{ background: "#fafafa", color: "var(--jff-fg)" }}
    >
      {pending ? "opening..." : "manage subscription"}
    </Button>
  );
}
