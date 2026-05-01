import { apiGet } from "@/lib/api";
import { PLAN_LIMITS } from "@/lib/plans";
import type { FormListItem, FormStats } from "@/lib/api-types";
import type { Plan } from "@jff/types";
import { ManageSubscriptionButton, UpgradeButton } from "./buttons";

const TIERS: Array<{
  name: Plan;
  price: string;
  subs: string;
  forms: string;
}> = [
  { name: "free", price: "$0", subs: "100", forms: "3" },
  { name: "starter", price: "$3", subs: "1,000", forms: "unlimited" },
  { name: "pro", price: "$9", subs: "10,000", forms: "unlimited" },
];

export default async function BillingPage() {
  // Reuse /api/forms + form-detail to get current plan/usage. Phase 9b can
  // collapse into a single /api/me endpoint later.
  const { forms } = await apiGet<{ forms: FormListItem[] }>("/api/forms");
  const sub = forms.length
    ? await apiGet<{ stats: FormStats }>(`/api/forms/${forms[0].id}`).then(
        (r) => ({ plan: r.stats.plan, used: r.stats.planUsed }),
      )
    : { plan: "free" as Plan, used: 0 };

  const limit = PLAN_LIMITS[sub.plan];
  const pct = Math.min(100, (sub.used / limit) * 100);
  const isPaid = sub.plan !== "free";
  const upgradeTarget: Plan = sub.plan === "pro" ? "pro" : sub.plan === "starter" ? "pro" : "starter";

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
            </div>
            <div style={{ color: "#a3a3a3", fontSize: 14 }}>
              {sub.plan === "free"
                ? "no charge. resets monthly."
                : `${TIERS.find((t) => t.name === sub.plan)?.price}/month`}
            </div>
          </div>
          {isPaid ? (
            <ManageSubscriptionButton />
          ) : (
            <UpgradeButton plan={upgradeTarget} label={`upgrade to ${upgradeTarget}`} />
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {TIERS.map((p) => {
          const isCurrent = p.name === sub.plan;
          return (
            <div
              key={p.name}
              className="card"
              style={{
                background: "#fff",
                border: `1px solid ${isCurrent ? "var(--jff-fg)" : "var(--jff-line)"}`,
                borderRadius: 12,
                padding: 20,
                boxShadow: isCurrent ? "0 0 0 1px var(--jff-fg)" : "none",
              }}
            >
              <div className="between">
                <div
                  style={{
                    fontWeight: 700,
                    color: "var(--jff-fg)",
                    fontSize: 16,
                    textTransform: "lowercase",
                  }}
                >
                  {p.name}
                </div>
                {isCurrent && (
                  <span
                    style={{
                      background: "var(--jff-chip)",
                      color: "#525252",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "0 8px",
                      height: 20,
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: 999,
                    }}
                  >
                    current
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "var(--jff-fg)",
                  letterSpacing: "-0.03em",
                  marginTop: 8,
                }}
              >
                {p.price}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--jff-muted)",
                  }}
                >
                  /mo
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: 13, marginTop: 12 }}>
                <div>{p.subs} submissions/mo</div>
                <div>{p.forms} forms</div>
                <div>spam filter, csv export</div>
              </div>
              <div style={{ marginTop: 16 }}>
                {isCurrent ? (
                  <button
                    disabled
                    style={{
                      width: "100%",
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid var(--jff-line)",
                      background: "#fff",
                      color: "var(--jff-muted)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "not-allowed",
                    }}
                  >
                    you&apos;re here
                  </button>
                ) : p.name === "free" ? (
                  // Downgrade to free → use portal to cancel; not a checkout.
                  <ManageSubscriptionButton />
                ) : (
                  <UpgradeButton
                    plan={p.name}
                    label={p.name === "pro" ? "upgrade" : "switch"}
                    fullWidth
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-muted" style={{ fontSize: 13 }}>
        {isPaid
          ? "manage payment method, view invoices, and cancel from the polar portal."
          : "no charges yet. upgrade unlocks the polar portal for invoice history."}
      </p>
    </>
  );
}
