"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  formId?: string;
  copyable?: boolean;
  label?: string;
  className?: string;
  children?: React.ReactNode;
};

export function CodeBlock({ copyable = true, label, className, children }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    const text = typeof children === "string" ? children : "";
    if (text && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`code ${className ?? ""}`} style={{ position: "relative" }}>
      {label && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 16,
            fontSize: 11,
            color: "#737373",
            textTransform: "uppercase",
            letterSpacing: ".06em",
          }}
        >
          {label}
        </div>
      )}
      {copyable && (
        <button
          onClick={onCopy}
          aria-label="Copy"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            height: 28,
            width: 28,
            border: "1px solid #262626",
            background: "#171717",
            color: "#fafafa",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}
      <pre
        style={{
          margin: 0,
          paddingTop: label ? 28 : 0,
          paddingRight: copyable ? 36 : 0,
          fontFamily: "inherit",
          whiteSpace: "pre",
        }}
      >
        {children}
      </pre>
    </div>
  );
}

export function EmbedSnippet({ formId = "a3f9k2x" }: { formId?: string }) {
  return (
    <CodeBlock>
      <span className="tag">{"<form"}</span>{" "}
      <span className="attr">action</span>=<span className="str">{`"https://jff.dev/f/${formId}"`}</span>{" "}
      <span className="attr">method</span>=<span className="str">{`"POST"`}</span>
      <span className="tag">{">"}</span>
      {"\n"}
      {"  "}
      <span className="tag">{"<input"}</span>{" "}
      <span className="attr">name</span>=<span className="str">{`"email"`}</span>{" "}
      <span className="attr">type</span>=<span className="str">{`"email"`}</span>{" "}
      <span className="tag">{"/>"}</span>
      {"\n"}
      {"  "}
      <span className="tag">{"<textarea"}</span>{" "}
      <span className="attr">name</span>=<span className="str">{`"message"`}</span>
      <span className="tag">{"></textarea>"}</span>
      {"\n"}
      {"  "}
      <span className="tag">{"<button>"}</span>Submit<span className="tag">{"</button>"}</span>
      {"\n"}
      <span className="tag">{"</form>"}</span>
    </CodeBlock>
  );
}
