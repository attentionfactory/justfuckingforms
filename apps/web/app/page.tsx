import Link from "next/link";
import { EmbedSnippet } from "@/components/jff/embed-snippet";
import { DemoForm } from "@/components/jff/demo-form";
import { SignupCTA } from "@/components/jff/signup-cta";

export default function Home() {
  return (
    <main className="af-page" style={{ paddingTop: 56, paddingBottom: 80 }}>
      <nav style={{ marginBottom: 24, display: "flex", gap: 14, fontSize: 16 }}>
        <span style={{ color: "var(--jff-fg)", fontWeight: 600 }}>jff.dev</span>
        <Link href="#">docs</Link>
        <Link href="/login">login</Link>
      </nav>

      <h1>just fucking forms.</h1>
      <p>stop paying $10/month for a form backend.</p>
      <p>stop installing 14 plugins. stop building your own.</p>

      <p style={{ marginTop: 24 }}>paste this into your html:</p>

      <div style={{ margin: "12px 0 20px" }}>
        <EmbedSnippet />
      </div>

      <p>that&apos;s it. we email you the submissions.</p>
      <p>
        <strong>$3/month</strong> after your first 100 free.
      </p>

      <SignupCTA />
      <p style={{ fontSize: 16 }}>
        100 free submissions/month. no credit card.{" "}
        <Link href="#">see what an email looks like</Link>.
      </p>

      <hr />

      <h2>actually try it.</h2>
      <p>
        this form posts to a real jff endpoint. submit it, you&apos;ll get a confirmation that it
        worked.
      </p>
      <DemoForm />

      <hr />

      <h2>what we don&apos;t do.</h2>
      <p>
        no file uploads. no zapier. no form builder. no team accounts. no &quot;ai-powered
        insights&quot;.
      </p>
      <p>we receive a POST. we email you. we keep the row. that&apos;s the entire product.</p>

      <hr />

      <div
        className="row between"
        style={{ fontSize: 14, color: "#a3a3a3", flexWrap: "wrap", gap: 16 }}
      >
        <div className="row" style={{ gap: 14, flexWrap: "wrap" }}>
          <Link href="#">docs</Link>
          <Link href="#">status</Link>
          <Link href="#">changelog</Link>
          <Link href="#">terms</Link>
          <Link href="#">privacy</Link>
        </div>
        <div className="row" style={{ gap: 14 }}>
          <Link href="#">@jffdev</Link>
          <Link href="#">github</Link>
        </div>
      </div>
      <p style={{ fontSize: 14, color: "#a3a3a3", marginTop: 12 }}>
        © 2026 just fucking forms. complaints to <Link href="#">/dev/null</Link>.
      </p>
    </main>
  );
}
