// Default thank-you HTML served when a form has no redirect_url and the
// requester isn't asking for JSON. Mirrors apps/web /thanks visually but
// inline-styled so it can be served from the Workers domain without any asset
// pipeline.

export function defaultThankYouHtml() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>submitted.</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{
    font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    background:#fefefe;color:#888;min-height:100vh;
    display:flex;align-items:center;justify-content:center;padding:40px;
  }
  .card{max-width:480px;text-align:center}
  .check{
    width:56px;height:56px;border-radius:999px;background:#0a0a0a;color:#fff;
    display:flex;align-items:center;justify-content:center;margin:0 auto 20px;
  }
  h1{font-size:36px;font-weight:700;color:#0a0a0a;letter-spacing:-0.03em;margin:0 0 8px}
  p{font-size:16px;line-height:1.55;margin:0 0 20px}
  .mono{font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;font-size:12px}
  .small{color:#a3a3a3}
  a{color:#a3a3a3}
</style>
</head>
<body>
  <div class="card">
    <div class="check">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <h1>submitted.</h1>
    <p>they got it. you can close this tab. or stare at it. up to you.</p>
    <p class="mono small">← back to where you came from</p>
    <p class="mono small" style="color:#d4d4d4;margin-top:56px">delivered by jff.dev — <a href="https://justfuckingforms.com">get your own endpoint</a></p>
  </div>
</body>
</html>`;
}
