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
  /**
   * "default" — white bg, black text. Used on the dark current-plan card so
   * the button doesn't inherit the card's white text color.
   * "outline" — bordered + transparent. Used on white tier cards.
   */
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

  // Match the visual treatment of ManageSubscriptionButton when on dark cards.
  const inlineStyle =
    variant === "default"
      ? {
          background: "#fafafa",
          color: "var(--jff-fg)",
          ...(fullWidth ? { width: "100%" } : {}),
        }
      : fullWidth
        ? { width: "100%" }
        : undefined;

  return (
    <Button
      variant={variant === "outline" ? "outline" : undefined}
      onClick={onClick}
      disabled={disabled || pending}
      style={inlineStyle}
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
