# ToolsAmerican

Free online tools for documents, images, audio, video, and links — **everything runs locally in your browser. Your files are never uploaded.**

Live at: [https://toolsamerican.github.io](https://toolsamerican.github.io)

## Featured tools

| Category | Tools |
|---|---|
| Document | Merge PDF, Compress PDF, PDF to Text, PDF to JPG, DOCX to HTML, Excel to CSV |
| Image | Compress Image, Image Converter, Image Resizer |
| Audio & Video | MP4 to MP3, Audio Converter |
| Link | QR Code Generator |

## Tech stack

- **Astro 7** — static site generator (all pages are pre-rendered HTML).
- **Tailwind CSS 4** — utility-first styling via the Vite plugin (`@tailwindcss/vite`).
- **100% client-side processing** — `pdf-lib`, `pdf.js`, `mammoth`, `SheetJS`, `browser-image-compression`, `@ffmpeg/ffmpeg` (WASM), and `qrcode`.
- Deployed to **GitHub Pages** via GitHub Actions.

## Local development

Prerequisites: Node 22+ and npm 11+.

```bash
cd frontend
npm install
npm run dev          # start dev server at http://localhost:4321
npm run build        # production build -> frontend/dist
npm run preview      # preview the production build
```

During the build, `scripts/copy-assets.mjs` copies the ffmpeg WASM core and the pdf.js worker into `public/`, and `scripts/generate-og.mjs` generates the default Open Graph image. Both must run before `astro build`; `npm run build` handles this automatically.

## Configuration (site.config.json)

Edit `frontend/src/config/site.config.json` before going live:

| Key | Purpose |
|---|---|
| `siteName` | Site name used in titles, headers, and footer |
| `siteUrl` | Canonical origin — keep `https://toolsamerican.github.io` |
| `googleAnalyticsId` | Google Analytics 4 property ID (e.g. `G-XXXXXXXXXX`) |
| `googleAdsensePublisherId` | AdSense publisher ID (e.g. `ca-pub-XXXXXXXXXXXXXX`) — empty = ads not injected |
| `googleSiteVerification` | Google Search Console verification token |
| `defaultMetaDescription` | Fallback meta description |

All of these are optional except the site name and URL. Analytics/AdSense scripts are only injected into `<head>` when a real value is present.

## Going live

1. Create a GitHub repository named **`toolsamerican.github.io`** for this project.
2. Push the `main` branch. The `.github/workflows/deploy.yml` workflow builds Astro and deploys `frontend/dist` to GitHub Pages.
3. In the repo settings: **Settings → Pages → Source: GitHub Actions**.
4. In Google Search Console, add the property and submit the sitemap:
   `https://toolsamerican.github.io/sitemap-index.xml`
5. After AdSense approval, fill in the Publisher ID, then update `frontend/public/ads.txt` with the exact content AdSense provides.

## Project structure

```
├── .github/workflows/deploy.yml   # GitHub Actions deploy to Pages
├── docs/PRD.md                    # Product requirements document
├── backend/README.md              # Backend placeholder (static site has none)
└── frontend/
    ├── public/                    # robots.txt, ads.txt, favicon, og-image, ffmpeg/, pdfjs/
    ├── scripts/                   # copy-assets.mjs, generate-og.mjs (build helpers)
    └── src/
        ├── config/site.config.json
        ├── layouts/               # BaseLayout, ToolLayout, BlogLayout, PageLayout
        ├── components/            # Header, Footer, AdSlot, ToolCard, FAQAccordion, etc.
        ├── lib/                   # tool registry + client-side tool engines
        ├── content/blog/          # blog markdown articles
        └── pages/                 # routes: /, /tools/*, /blog/*, /about, /contact, /privacy-policy, /terms-of-service, 404
```

## License

Site code © ToolsAmerican. Blog content © ToolsAmerican. Tools run entirely client-side; no rights are claimed over user-uploaded content.