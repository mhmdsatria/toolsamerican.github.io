# PRD — Bytecore
**Domain:** `bytecore.biz.id`
**Tujuan akhir:** Situs multi-tools (dokumen, file, mp3, mp4, link, dll) yang layak diajukan ke Google AdSense 2026 dan lolos review.

---

## 0. Keputusan Arsitektur (WAJIB DIBACA)

`*.github.io` = **GitHub Pages = static hosting only**. Tidak ada PHP runtime, tidak ada Node.js server runtime di sana.

**Keputusan:** Semua tools berjalan **client-side** (di browser, pakai JavaScript/WASM). Tidak butuh backend server untuk fitur utama. Ini bahkan jadi *nilai plus* untuk AdSense karena:
- Tidak ada biaya server / downtime
- Loading cepat (Core Web Vitals bagus → salah satu sinyal kualitas AdSense)
- File user tidak pernah diupload ke server manapun → poin privasi kuat untuk Privacy Policy

**Stack yang dipakai:**
- **Static Site Generator:** Astro (atau 11ty) — build dengan Node.js di lokal/CI, output-nya HTML murni ke GitHub Pages. **Ini "pakai Node.js"-nya di titik ini**, bukan sebagai server produksi.
- **Styling:** Tailwind CSS
- **Tools engine (client-side JS/WASM):**
  - PDF: `pdf-lib`, `pdf.js`
  - Gambar: `browser-image-compression`, canvas API
  - Audio/Video (mp3/mp4): `ffmpeg.wasm`
  - Convert dokumen ringan: `mammoth.js` (docx→html), `SheetJS` (xlsx)
  - Link tools (shortener, QR, dll): logic JS murni + localStorage, atau API pihak ke-3 gratis (misal QR pakai `qrcode.js` client-side, tanpa server)
- **Blog / CMS ringan:** Markdown files + frontmatter, di-generate jadi halaman statis oleh Astro. Untuk "CMS" mengelola kode GA/GSC/dll → cukup **1 file config** (`site.config.json`) yang di-inject ke semua halaman saat build. Tidak perlu database/backend.
- **Hosting:** GitHub Pages (gratis, cocok domain `.github.io`)
- **CI/CD:** GitHub Actions (build Astro → deploy ke Pages otomatis tiap push)

> Kalau nanti butuh proses file berat (di luar kemampuan browser) → baru tambah **Opsi B**: backend terpisah (Node.js/Express atau PHP) di Railway/Render/VPS, dipanggil via API dari frontend statis. Tidak mengubah domain utama.

---

## 1. Ringkasan Produk

**Nama:** Bytecore
**Positioning:** "All-in-one online tools" — convert, compress, edit file dokumen/gambar/audio/video/link, gratis, tanpa install, privasi terjaga (proses di browser).

**Kategori tools (contoh, kembangkan sesuai kebutuhan):**
1. **Dokumen:** PDF to Word, Word to PDF, Merge PDF, Split PDF, Compress PDF, PDF to JPG
2. **Gambar:** Compress Image, Convert Image (PNG↔JPG↔WebP), Resize Image, Remove Background (client-side model ringan atau skip dulu)
3. **Audio:** MP3 Converter, Audio Compressor, Trim Audio
4. **Video:** MP4 Converter, Video Compressor, Video to MP3, Trim Video
5. **Link/Web:** URL Shortener (perlu backend ringan/3rd party), QR Code Generator, Meta Tag Generator, Word Counter
6. **Umum:** File Converter (universal), Unit Converter

> **Catatan AdSense penting:** Google AdSense 2026 semakin ketat soal *"tools clone / thin utility site"*. Jangan cuma bikin tool tanpa penjelasan. **Tiap halaman tool WAJIB punya:**
> - Judul & deskripsi unik (bukan template kosong)
> - Minimal 300–500 kata konten pendukung: cara pakai, FAQ, use case
> - Breadcrumb & navigasi jelas
> - Tidak ada halaman kosong/"lorem ipsum"/under construction

---

## 2. Ketentuan Google AdSense 2026 — Checklist Wajib

### A. Kebijakan Konten & Kebijakan Program
- [ ] Konten 100% original, tidak scraping/duplikat
- [ ] Tidak ada konten dewasa, kekerasan, ujaran kebencian, judi, obat terlarang
- [ ] Tidak ada konten yang mendorong klik iklan secara curang (no "click here to support us")
- [ ] Setiap tool berfungsi nyata (bukan fake/placeholder)
- [ ] Bahasa konsisten (pilih 1 bahasa utama per halaman — jangan campur ID/EN acak)

### B. Halaman Wajib (Legal & Trust Pages)
- [ ] `/about` — About Us (jelaskan siapa di balik situs, tujuan)
- [ ] `/contact` — Contact form/email jelas
- [ ] `/privacy-policy` — **Wajib jelaskan penggunaan cookies, Google Analytics, AdSense (personalized ads), dan bahwa file user diproses lokal di browser (tidak diupload)**
- [ ] `/terms-of-service` — Syarat & ketentuan penggunaan
- [ ] `/disclaimer` (opsional tapi disarankan)
- [ ] `/cookie-policy` (bisa digabung ke privacy policy, tapi sebutkan eksplisit)

### C. Teknis
- [ ] `sitemap.xml` — auto-generate saat build (Astro sitemap integration)
- [ ] `robots.txt` — allow semua crawler, arahkan ke sitemap
- [ ] `ads.txt` — **wajib** setelah dapat Publisher ID dari AdSense, taruh di root domain
- [ ] Mobile-responsive (wajib, Google cek mobile-first)
- [ ] HTTPS aktif (GitHub Pages otomatis kasih HTTPS — pastikan "Enforce HTTPS" dicentang di settings repo)
- [ ] Meta tags lengkap tiap halaman (title unik, description unik, canonical, OG tags)
- [ ] Struktur URL rapi (`/tools/pdf-to-word`, bukan `?id=123`)
- [ ] Tidak ada broken link / 404 masif
- [ ] Loading cepat (skor Core Web Vitals hijau — cek via PageSpeed Insights)
- [ ] Favicon, 404 page custom

### D. Konten Minimum untuk Approval
- [ ] Minimal 15–30 halaman konten bermakna sebelum apply (tools + blog + legal pages)
- [ ] Blog aktif dengan minimal 5–10 artikel awal (misal: "Cara Compress PDF tanpa Kehilangan Kualitas", "Perbedaan MP3 vs WAV", dll) — ini yang bikin situs terlihat "punya konten", bukan cuma kumpulan tools kosong
- [ ] Navigasi menu jelas: Home, Tools (dropdown kategori), Blog, About, Contact

### E. Setelah Approve
- [ ] Pasang AdSense auto ads / manual ad units sesuai kebijakan penempatan (jangan di atas fold berlebihan, jangan menutupi tombol/CTA)
- [ ] Pasang Google Analytics 4
- [ ] Daftarkan di Google Search Console, submit sitemap

---

## 3. Struktur Folder Proyek

```
toolsamerican/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions: build & deploy ke Pages
├── frontend/
│   ├── src/
│   │   ├── layouts/
│   │   │   ├── BaseLayout.astro
│   │   │   ├── ToolLayout.astro
│   │   │   └── BlogLayout.astro
│   │   ├── components/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── AdSlot.astro         # komponen slot iklan (reusable, ambil ID dari config)
│   │   │   ├── CTAButton.astro
│   │   │   ├── ToolCard.astro
│   │   │   ├── Breadcrumb.astro
│   │   │   └── FAQAccordion.astro
│   │   ├── pages/
│   │   │   ├── index.astro          # Homepage
│   │   │   ├── about.astro
│   │   │   ├── contact.astro
│   │   │   ├── privacy-policy.astro
│   │   │   ├── terms-of-service.astro
│   │   │   ├── tools/
│   │   │   │   ├── index.astro      # daftar semua tools
│   │   │   │   ├── pdf-to-word.astro
│   │   │   │   ├── compress-image.astro
│   │   │   │   ├── mp4-to-mp3.astro
│   │   │   │   ├── qr-code-generator.astro
│   │   │   │   └── ... (tiap tool = 1 halaman)
│   │   │   └── blog/
│   │   │       ├── index.astro
│   │   │       └── [slug].astro     # render dari content/blog/*.md
│   │   ├── content/
│   │   │   └── blog/
│   │   │       ├── cara-compress-pdf.md
│   │   │       └── ...
│   │   ├── lib/
│   │   │   ├── pdf-tools.js         # logic client-side per kategori
│   │   │   ├── image-tools.js
│   │   │   ├── audio-video-tools.js (pakai ffmpeg.wasm)
│   │   │   └── link-tools.js
│   │   └── config/
│   │       └── site.config.json     # <-- "CMS mini": GA ID, GSC verify code, AdSense Publisher ID, site meta
│   ├── public/
│   │   ├── robots.txt
│   │   ├── sitemap.xml              # auto-generated
│   │   ├── ads.txt
│   │   └── favicon.svg
│   ├── astro.config.mjs
│   ├── package.json
│   └── tailwind.config.js
├── backend/                         # OPSIONAL — hanya isi kalau butuh Opsi B (proses berat)
│   ├── (kosong untuk fase awal — GitHub Pages tidak menjalankan ini)
│   └── README.md                    # catatan: deploy terpisah ke Railway/Render kalau dibutuhkan nanti
├── docs/
│   └── PRD.md                       # file ini
└── README.md
```

### Isi `site.config.json` (ini "CMS" mini-nya)
```json
{
  "siteName": "Bytecore",
  "siteUrl": "https://toolsamerican.github.io",
  "googleAnalyticsId": "G-XXXXXXX",
  "googleAdsensePublisherId": "ca-pub-XXXXXXXXXXXXXXX",
  "googleSiteVerification": "verification-code-dari-search-console",
  "defaultMetaDescription": "..."
}
```
Semua kode tracking (GA4, Search Console meta tag, AdSense script) diambil dari 1 file ini lalu di-*inject* otomatis ke `<head>` semua halaman lewat `BaseLayout.astro`. Jadi kalau mau ganti ID, cukup edit 1 file, tidak perlu sentuh tiap halaman.

---

## 4. CTA & Elemen Wajib per Halaman Tool

Tiap halaman tool (`ToolLayout.astro`) harus punya struktur konsisten:
1. **H1** — nama tool jelas ("Convert PDF to Word Online Free")
2. **Area upload/drag-drop** dengan CTA jelas: `Upload File` / `Choose File`
3. Tombol proses: `Convert Now`, `Compress`, dll (state: loading → selesai → `Download Result`)
4. **Breadcrumb**: Home > Tools > PDF Tools > PDF to Word
5. Section **"How to Use"** (langkah 1-2-3)
6. Section **FAQ** (accordion, minimal 3-5 pertanyaan)
7. Section **Related Tools** (internal linking, bagus untuk SEO)
8. **Ad slot** ditaruh: setelah hero (bukan di atas H1), di antara konten, dan di sidebar (desktop) — jangan menutupi tombol upload/convert
9. Footer dengan link ke legal pages

---

## 5. Prompt untuk Agen Coding (OpenCode / Claude Code / dll)


```
Kamu akan membangun situs "Bytecore" — situs static multi-tools (dokumen, gambar,
audio, video, link) yang akan di-deploy ke GitHub Pages di domain bytecore.biz.id,
dan harus memenuhi syarat Google AdSense 2026.

KONSTRAIN WAJIB:
1. Output akhir harus 100% static (HTML/CSS/JS) — deploy ke GitHub Pages. TIDAK ADA
   server PHP/Node.js di produksi. Node.js hanya dipakai sebagai build tool (Astro).
2. Semua fitur tools (convert PDF, compress image, convert mp3/mp4, dll) harus berjalan
   CLIENT-SIDE di browser pakai JS/WASM (pdf-lib, pdf.js, ffmpeg.wasm, mammoth.js,
   browser-image-compression, SheetJS). Jangan upload file user ke server manapun.
3. Gunakan Astro + Tailwind CSS. Struktur folder ikuti dokumen PRD ini
   (frontend/src/pages, components, layouts, content/blog, lib, config).
4. Buat 1 file `frontend/src/config/site.config.json` berisi placeholder untuk:
   googleAnalyticsId, googleAdsensePublisherId, googleSiteVerification, siteUrl, siteName.
   Semua kode tracking di-inject dari file ini via BaseLayout.astro ke <head>
   di SEMUA halaman (jangan hardcode di banyak file).
5. Buat halaman wajib: /about, /contact, /privacy-policy (sebutkan eksplisit
   penggunaan cookies, Google Analytics, personalized ads AdSense, dan bahwa file
   user diproses lokal di browser tanpa diupload), /terms-of-service, custom 404.
6. Buat minimal 8 halaman tool (pilih dari kategori dokumen/gambar/audio/video/link),
   tiap halaman WAJIB punya: H1 unik, deskripsi 300-500 kata original, area
   upload/drag-drop dengan CTA jelas, tombol proses & download, breadcrumb,
   section "How to Use" 1-2-3 langkah, section FAQ accordion (3-5 item),
   section "Related Tools" untuk internal linking. JANGAN buat halaman kosong
   atau lorem ipsum.
7. Buat sistem blog sederhana: /blog (index) + /blog/[slug] render dari markdown
   di src/content/blog/. Buat minimal 6 artikel blog awal yang relevan dengan
   tools yang ada (misal "Cara Compress PDF Tanpa Kehilangan Kualitas",
   "MP3 vs WAV: Mana yang Lebih Baik", dll), masing-masing 500-800 kata, original.
8. Generate otomatis: sitemap.xml (pakai @astrojs/sitemap), robots.txt
   (allow semua, arahkan ke sitemap), placeholder ads.txt (kosongkan value publisher
   ID dulu, beri komentar cara isi setelah AdSense approve).
9. Pastikan meta tags lengkap & unik per halaman: title, description, canonical,
   Open Graph (og:title, og:description, og:image), responsive viewport.
10. Desain harus mobile-first, responsive, Core Web Vitals baik (lazy-load gambar,
    minim JS blocking, font-display swap).
11. Sediakan komponen <AdSlot /> reusable untuk penempatan iklan, ditaruh di posisi
    aman (tidak menutupi tombol upload/convert, tidak di atas H1/hero langsung).
12. Buat GitHub Actions workflow (.github/workflows/deploy.yml) yang build Astro
    dan deploy otomatis ke GitHub Pages tiap push ke branch main.
13. Sertakan README.md di root berisi instruksi setup lokal, cara isi
    site.config.json, dan cara submit sitemap ke Google Search Console setelah deploy.

Kerjakan bertahap: (1) setup project Astro + Tailwind + struktur folder,
(2) layouts & components dasar termasuk AdSlot & config injection,
(3) halaman legal wajib, (4) 8 halaman tools dengan logic JS/WASM asli
(bukan dummy), (5) sistem blog + 6 artikel, (6) sitemap/robots/ads.txt,
