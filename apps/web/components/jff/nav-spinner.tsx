"use client";

import { useLinkStatus } from "next/link";
import { Spinner } from "@/components/ui/spinner";

/**
 * Renders <Spinner/> while the parent <Link> is navigating. Must be a descendant
 * of <Link> for useLinkStatus() to work.
 *
 * Usage pattern: when the link has its own icon, swap the icon for this spinner
 * during pending. When it has no icon, drop this in next to the label.
 *
 * Slight delay before showing (`min-pending-ms`) avoids flicker on instant
 * cache hits — most navigations are <50ms and don't need a spinner.
 */
export function NavSpinner({
  size = 13,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <Spinner
      style={{ width: size, height: size }}
      className={className}
    />
  );
}

/**
 * Pattern helper: render either the original icon (when idle) or the spinner
 * (when the parent <Link> is navigating). Use inside <Link> children when the
 * link has an icon you want to swap.
 */
export function IconOrSpinner({
  icon,
  size = 14,
}: {
  icon: React.ReactNode;
  size?: number;
}) {
  const { pending } = useLinkStatus();
  return pending ? (
    <Spinner style={{ width: size, height: size }} />
  ) : (
    <>{icon}</>
  );
}
