import { getBrowser } from "@/lib/puppeteer";
import type { ProjectData } from "@/types/project";

export type ArtifactType = "png" | "pdf" | "pptx" | "ics" | "zip" | "json";

export interface Artifact {
  type: ArtifactType;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  size: number;
}

function buildReportHtml(title: string, data: ProjectData): string {
  const now = new Date().toLocaleString();
  const strengths = data.results?.llmOutputs?.strengths || [];
  const weaknesses = data.results?.llmOutputs?.weaknesses || [];
  const recommendations = data.results?.llmOutputs?.recommendations || [];
  const kits = data.results?.llmOutputs?.conversionKits || [];
  const scoring = data.results?.scoringResult;

  const metricItems = scoring
    ? Object.entries(scoring.dimensionScores)
        .map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`) // simple layout
        .join("")
    : "<li>No scoring available</li>";

  const style = `
    <style>
      body { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 0; padding: 24px; color: #111827; }
      .container { max-width: 900px; margin: 0 auto; }
      h1 { font-size: 28px; margin: 0 0 4px; }
      .subtitle { color: #6B7280; font-size: 14px; margin-bottom: 16px; }
      h2 { font-size: 20px; margin: 24px 0 8px; }
      section { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-top: 12px; }
      ul { margin: 8px 0; padding-left: 18px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .metric-grid li { list-style: none; background: #f3f4f6; padding: 8px; border-radius: 8px; font-size: 13px; }
      .kits li { list-style: disc; }
      footer { color: #9CA3AF; font-size: 12px; margin-top: 24px; text-align: right; }
    </style>
  `;

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        ${style}
      </head>
      <body>
        <div class="container">
          <h1>${title || "Offer Analysis Report"}</h1>
          <div class="subtitle">Generated ${now}</div>

          <section>
            <h2>Overview</h2>
            <div class="grid">
              <div>
                <h3>Strengths</h3>
                <ul>${strengths.map((s) => `<li>${s}</li>`).join("") || "<li>—</li>"}</ul>
                <h3>Weaknesses</h3>
                <ul>${weaknesses.map((s) => `<li>${s}</li>`).join("") || "<li>—</li>"}</ul>
              </div>
              <div>
                <h3>Key Recommendations</h3>
                <ul>${recommendations.map((s) => `<li>${s}</li>`).join("") || "<li>—</li>"}</ul>
              </div>
            </div>
          </section>

          <section>
            <h2>Scores</h2>
            <ul class="metric-grid">${metricItems}</ul>
          </section>

          <section>
            <h2>Conversion Kits</h2>
            <ul class="kits">${kits.map((k) => `<li>${k}</li>`).join("") || "<li>—</li>"}</ul>
          </section>

          <footer>Offer Wind Tunnel</footer>
        </div>
      </body>
    </html>
  `;
}

async function renderPNG(html: string): Promise<Artifact> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0" });

    const height = await page.evaluate(() => Math.max(document.body.scrollHeight, 800));
    await page.setViewport({ width: 1200, height, deviceScaleFactor: 2 });

    const buffer = (await page.screenshot({ fullPage: true, type: "png" })) as Buffer;
    return {
      type: "png",
      fileName: `results-${Date.now()}@2x.png`,
      mimeType: "image/png",
      buffer,
      size: buffer.length,
    };
  } finally {
    try {
      await page.close();
    } catch {}
  }
}

async function renderPDF(html: string): Promise<Artifact> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0" });

    const buffer = (await page.pdf({ printBackground: true, format: "A4" })) as Buffer;
    return {
      type: "pdf",
      fileName: `report-${Date.now()}.pdf`,
      mimeType: "application/pdf",
      buffer,
      size: buffer.length,
    };
  } finally {
    try {
      await page.close();
    } catch {}
  }
}

async function generatePPTX(title: string, data: ProjectData): Promise<Artifact> {
  // Dynamic import to avoid bundling issues in edge runtimes
  const PptxGenJS = (await import("pptxgenjs")).default as unknown as {
    new (): any;
  };
  const pptx = new (PptxGenJS as any)();

  const slide1 = pptx.addSlide();
  slide1.addText(title || "Offer Analysis", {
    x: 0.5,
    y: 0.5,
    fontSize: 24,
    bold: true,
  });
  const strengths = data.results?.llmOutputs?.strengths || [];
  const weaknesses = data.results?.llmOutputs?.weaknesses || [];
  slide1.addText("Strengths:", { x: 0.5, y: 1.2, fontSize: 16, bold: true });
  slide1.addText(strengths.map((s) => `• ${s}`).join("\n") || "—", {
    x: 0.6,
    y: 1.6,
    fontSize: 14,
  });

  const slide2 = pptx.addSlide();
  slide2.addText("Weaknesses:", { x: 0.5, y: 0.5, fontSize: 16, bold: true });
  slide2.addText(weaknesses.map((s) => `• ${s}`).join("\n") || "—", {
    x: 0.6,
    y: 0.9,
    fontSize: 14,
  });

  const recs = data.results?.llmOutputs?.recommendations || [];
  const slide3 = pptx.addSlide();
  slide3.addText("Recommendations:", { x: 0.5, y: 0.5, fontSize: 16, bold: true });
  slide3.addText(recs.map((s) => `• ${s}`).join("\n") || "—", {
    x: 0.6,
    y: 0.9,
    fontSize: 14,
  });

  const arr = (await pptx.write("arraybuffer")) as ArrayBuffer;
  const buffer = Buffer.from(new Uint8Array(arr));
  return {
    type: "pptx",
    fileName: `deck-${Date.now()}.pptx`,
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    buffer,
    size: buffer.length,
  };
}

async function generateICS(title: string, data: ProjectData): Promise<Artifact> {
  const ics = await import("ics");
  const now = new Date();
  const start = [now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes()] as const;

  const events = [
    {
      title: `${title || "Offer Analysis"} — Review Results`,
      start,
      duration: { hours: 1 },
    },
  ];

  const recs = data.results?.llmOutputs?.recommendations || [];
  for (let i = 0; i < Math.min(2, recs.length); i++) {
    const d = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
    events.push({
      title: `Implement: ${recs[i]}`,
      start: [d.getFullYear(), d.getMonth() + 1, d.getDate(), 10, 0],
      duration: { hours: 1 },
    });
  }

  const { error, value } = (ics as any).createEvents(events);
  if (error) throw error;
  const buffer = Buffer.from(value, "utf-8");
  return {
    type: "ics",
    fileName: `calendar-${Date.now()}.ics`,
    mimeType: "text/calendar",
    buffer,
    size: buffer.length,
  };
}

async function bundleZIP(artifacts: Artifact[]): Promise<Artifact> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const art of artifacts) {
    zip.file(art.fileName, art.buffer);
  }
  const buffer = (await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } })) as Buffer;
  return {
    type: "zip",
    fileName: `bundle-${Date.now()}.zip`,
    mimeType: "application/zip",
    buffer,
    size: buffer.length,
  };
}

export interface GenerateArtifactsOptions {
  title?: string;
}

export async function generateArtifacts(data: ProjectData, opts?: GenerateArtifactsOptions) {
  const title = opts?.title || "Offer Analysis";
  const html = buildReportHtml(title, data);
  // Render with retry for robustness
  const withRetry = async <T>(fn: () => Promise<T>, attempts = 2): Promise<T> => {
    let lastErr: unknown;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        await new Promise((r) => setTimeout(r, 300 * (i + 1)));
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error("Operation failed");
  };

  const png = await withRetry(() => renderPNG(html));
  const pdf = await withRetry(() => renderPDF(html));
  const pptx = await withRetry(() => generatePPTX(title, data));
  const ics = await generateICS(title, data);
  const jsonBuffer = Buffer.from(JSON.stringify({ title, data }, null, 2), "utf-8");
  const json: Artifact = {
    type: "json",
    fileName: `project-${Date.now()}.json`,
    mimeType: "application/json",
    buffer: jsonBuffer,
    size: jsonBuffer.length,
  };

  const bundle = await bundleZIP([png, pdf, pptx, ics, json]);

  return { png, pdf, pptx, ics, json, bundle };
}
