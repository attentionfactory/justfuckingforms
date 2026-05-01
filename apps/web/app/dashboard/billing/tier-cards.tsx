"use client";

import { useState } from "react";
import type { Plan, BillingCycle } from "@jff/types";
import { PLAN_PRICES } from "@/lib/plans";
import { UpgradeButton, ManageSubscriptionButton } from "./buttons";

type TierMeta = {
  name: Plan;
  subs: string;
  forms: string;
};

const TIERS: TierMeta[] = [
  { name: "free", subs: "100", forms: "3" },
  { name: "starter", subs: "1,000", forms: "unlimited" },
  { name: "pro", subs: "10,000", forms: "unlimited" },
];

export function TierCards({
  currentPlan,
  currentCycle,
}: {
  currentPlan: Plan;
  currentCycle: BillingCycle;
}) {
  // Annual is the default. We bias users toward yearly because it's the right
  // commercial choice (they save 17%, we get cash up front + lower churn).
  const [cycle, setCycle] = useState<BillingCycle>("annual");

  return (
    <>
      <div className="between" style={{ marginBottom: 16, alignItems: "flex-end" }}>
        <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
          {cycle === "annual"
            ? "annual — two months free."
            : "monthly. switch to annual to save 17%."}
        </p>
        <CycleToggle cycle={cycle} onChange={setCycle} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {TIERS.map((tier) => {
          const isCurrent = tier.name === currentPlan && tier.name === "free"
            ? true
            : tier.name === currentPlan && cycle === currentCycle;
          const price = PLAN_PRICES[tier.name][cycle];
          const subPrice =
            cycle === "annual" && tier.name !== "free"
              ? `$${(price / 12).toFixed(2)}/mo billed annually`
              : null;
          return (
            <div
              key={tier.name}
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
                  {tier.name}
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
                ${price}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--jff-muted)",
                  }}
                >
                  {tier.name === "free"
                    ? ""
                    : cycle === "annual"
                      ? "/yr"
                      : "/mo"}
                </span>
              </div>
              {subPrice && (
                <div
                  className="text-muted"
                  style={{ fontSize: 12, marginTop: 2 }}
                >
                  {subPrice}
                </div>
              )}
              <div className="text-muted" style={{ fontSize: 13, marginTop: 12 }}>
                <div>{tier.subs} submissions/mo</div>
                <div>{tier.forms} forms</div>
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
                ) : tier.name === "free" ? (
                  // To downgrade to free, cancel from the Polar portal.
                  <ManageSubscriptionButton variant="outline" fullWidth />
                ) : (
                  <UpgradeButton
                    plan={tier.name}
                    cycle={cycle}
                    label={
                      currentPlan === tier.name
                        ? "switch cycle"
                        : tier.name === "pro"
                          ? "upgrade"
                          : "switch"
                    }
                    fullWidth
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function CycleToggle({
  cycle,
  onChange,
}: {
  cycle: BillingCycle;
  onChange: (c: BillingCycle) => void;
}) {
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        background: "var(--jff-bg-alt)",
        border: "1px solid var(--jff-line)",
        borderRadius: 8,
        padding: 2,
      }}
    >
      <SegmentButton selected={cycle === "annual"} onClick={() => onChange("annual")}>
        annual
        <span
          style={{
            marginLeft: 6,
            fontSize: 11,
            fontWeight: 600,
            background: "var(--jff-ok-bg)",
            color: "var(--jff-ok-fg)",
            padding: "1px 6px",
            borderRadius: 999,
          }}
        >
          save 17%
        </span>
      </SegmentButton>
      <SegmentButton selected={cycle === "monthly"} onClick={() => onChange("monthly")}>
        monthly
      </SegmentButton>
    </div>
  );
}

function SegmentButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "6px 14px",
        height: 30,
        borderRadius: 6,
        border: 0,
        background: selected ? "#fff" : "transparent",
        color: selected ? "var(--jff-fg)" : "var(--jff-muted)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: selected ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
        transition: "background .15s, color .15s",
      }}
    >
      {children}
    </button>
  );
}
