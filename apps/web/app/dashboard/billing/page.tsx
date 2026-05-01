import { apiGet } from "@/lib/api";
import { PLAN_LIMITS, PLAN_PRICES } from "@/lib/plans";
import type { FormListItem, FormStats } from "@/lib/api-types";
import type { Plan, BillingCycle } from "@jff/types";
import { ManageSubscriptionButton, UpgradeButton } from "./buttons";
import { TierCards } from "./tier-cards";

export default async function BillingPage() {
  // Reuse /api/forms + form-detail to fetch current plan/cycle/usage. Phase 9b
  // can collapse into a single /api/me endpoint later if this page does more.
  const { forms } = await apiGet<{ forms: FormListItem[] }>("/api/forms");
  const sub = forms.length
    ? await apiGet<{ stats: FormStats }>(`/api/forms/${forms[0].id}`).then(
        (r) => ({
          plan: r.stats.plan,
          cycle: r.stats.cycle,
          used: r.stats.planUsed,
        }),
      )
    : {
        plan: "free" as Plan,
        cycle: "monthly" as BillingCycle,
        used: 0,
      };

  const limit = PLAN_LIMITS[sub.plan];
  const pct = Math.min(100, (sub.used / limit) * 100);
  const isPaid = sub.plan !== "free";
  const upgradeTarget: Plan =
    sub.plan === "pro" ? "pro" : sub.plan === "starter" ? "pro" : "starter";

  const currentPrice = PLAN_PRICES[sub.plan][sub.cycle];
  const currentPlanLine =
    sub.plan === "free"
      ? "no charge. resets monthly."
      : sub.cycle === "annual"
        ? `$${currentPrice}/year · ${(currentPrice / 12).toFixed(2)}/mo equivalent`
        : `$${currentPrice}/month`;

  return (
    <>
      <div className="crumb">workspace / billing</div>
      <h1 style={{ marginBottom: 24 }}>billing</h1>

      <div
        className="card"
        style={{
          padding: 24,
          marginBottom: 20,
          background: "var(--jff-fg)",
          color: "#fafafa",
          border: 0,
          borderRadius: 12,
        }}
      >
        <div className="between" style={{ alignItems: "flex-start" }}>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#a3a3a3",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              current plan
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                margin: "4px 0",
              }}
            >
              {sub.plan}
              {isPaid && (
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    marginLeft: 8,
                    color: "#a3a3a3",
                    textTransform: "lowercase",
                  }}
                >
                  · {sub.cycle}
                </span>
              )}
            </div>
            <div style={{ color: "#a3a3a3", fontSize: 14 }}>{currentPlanLine}</div>
          </div>
          {isPaid ? (
            <ManageSubscriptionButton />
          ) : (
            <UpgradeButton
              plan={upgradeTarget}
              cycle="annual"
              label={`upgrade to ${upgradeTarget}`}
            />
          )}
        </div>
        <div style={{ marginTop: 24 }}>
          <div className="between" style={{ marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: "#a3a3a3" }}>submissions used</span>
            <span className="mono">
              {sub.used.toLocaleString()} / {limit.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: "#262626",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: "#fafafa",
              }}
            />
          </div>
        </div>
      </div>

      <TierCards currentPlan={sub.plan} currentCycle={sub.cycle} />

      <p className="text-muted" style={{ fontSize: 13 }}>
        {isPaid
          ? "manage payment method, view invoices, and cancel from the polar portal."
          : "no charges yet. upgrade unlocks the polar portal for invoice history."}
      </p>
    </>
  );
}
