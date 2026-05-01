import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="af-page" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mono" style={{ fontSize: 13, marginBottom: 32, color: "var(--jff-fg)", fontWeight: 600 }}>
        jff.dev
      </div>
      <h1>just fucking forms.</h1>
      <p>phase 1 is alive. tokens loaded, fonts wired, shadcn primitives ready.</p>
      <p>landing copy lives at <a href="https://github.com">/</a> in phase 7.</p>
      <hr />
      <h2>smoke test</h2>
      <p>shadcn button below should render with JFF black + Geist sans:</p>
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <Button>send me a link</Button>
        <Button variant="outline">cancel</Button>
      </div>
      <p className="mono text-muted" style={{ fontSize: 12, marginTop: 32 }}>
        $ pnpm turbo type-check
      </p>
    </main>
  );
}
