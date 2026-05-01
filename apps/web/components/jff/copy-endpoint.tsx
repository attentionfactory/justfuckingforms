"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyEndpoint({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    if (navigator.clipboard) void navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="row" style={{ gap: 8 }}>
      <div
        className="mono"
        style={{
          flex: 1,
          padding: "12px 14px",
          background: "var(--jff-bg-alt)",
          border: "1px solid var(--jff-line)",
          borderRadius: 8,
          fontSize: 14,
          color: "var(--jff-fg)",
        }}
      >
        {url}
      </div>
      <Button variant="outline" onClick={onCopy}>
        {copied ? (
          <>
            <Check size={14} /> copied
          </>
        ) : (
          <>
            <Copy size={14} /> copy
          </>
        )}
      </Button>
    </div>
  );
}
