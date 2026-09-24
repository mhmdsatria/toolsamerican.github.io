# Tahap-Tahap Publish Bytecore ke GitHub Pages

Situs di-host di: **https://bytecore.biz.id** (custom domain GitHub Pages)

Semua perintah dijalankan di **PowerShell** di folder `C:\Users\Sardev\Desktop\Tools_ads`.
> Tips: klik kanan folder `Tools_ads` di Windows Explorer → "Open in Terminal".

---

## Tahap 1 — Install GitHub CLI (sekali saja)

```powershell
winget install --id GitHub.cli --accept-source-agreements --accept-package-agreements
```

Tutup & buka ulang Terminal setelah selesai.

---

## Tahap 2 — Login ke GitHub (sekali saja)

```powershell
gh auth login
```

Pilih urut:
1. **GitHub.com**
2. **HTTPS**
3. **Login with a web browser**

Akan muncul *one-time code* (contoh: `B525-E4E4`). Tekan Enter → browser terbuka →
masukkan kode di `https://github.com/login/device` → klik **Authorize** → selesai.

Cek login berhasil:
```powershell
gh auth status
```

---

## Tahap 3 — Commit semua file situs

```powershell
git add -A
git status
```

Pastikan muncul daftar file (`frontend/`, `.github/`, `README.md`, dll) — jangan ikut terpush
file `node_modules`, `dist`, `.astro` (sudah otomatis diabaikan via `.gitignore`).

Lakukan commit:

```powershell
git commit -m "Initial commit: Bytecore site"
```

---

## Tahap 4 — Buat repository di GitHub

```powershell
gh repo create <nama-repo> --public --source . --remote origin --push
```

- `--push` otomatis mengirim commit main → memicu build di GitHub.

---

## Tahap 5 — Lihat proses deploy

```powershell
gh run watch
```

Tunggu sampai kedua job **build** (hijau) lalu **deploy** selesai (±2 menit).
Artinya:
- Build: npm install → build Astro → upload `frontend/dist`
- Deploy: mem-publish ke GitHub Pages

---

## Tahap 6 — Aktifkan Pages + custom domain (satu kali)

Buka di browser: **Settings → Pages** di repo Anda.

1. **Source = "Deploy from a branch" → `gh-pages` → `/ (root)`**.
2. Isi **Custom domain** = `bytecore.biz.id` → **Save** (unit DNS otomatis dibuat).
3. Pastikan DNS domain Anda mengarah ke GitHub Pages (A records:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`).

---

## Tahap 7 — Cek situs live

Buka di browser: **https://bytecore.biz.id**

Periksa:
- Homepage tampil dengan styling
- `/tools/` daftar 12 tools
- `/robots.txt` → berisi `Sitemap: https://bytecore.biz.id/sitemap-index.xml`
- `/sitemap-index.xml` → pointer ke `sitemap-0.xml`

---

## Tahap 8 — Masukkan kode AdSense/GA (setelah punya kodenya)

**Tidak ada halaman admin.** Semua diatur melalui 1 file:
`frontend\src\config\site.config.json`

| Field | Isi dengan | Contoh |
|---|---|---|
| `googleAnalyticsId` | Measurement ID GA4 | `G-3XKL79Q2FA` |
| `googleAdsensePublisherId` | ID publisher AdSense | `ca-pub-1234567890123456` |
| `googleSiteVerification` | Token verifikasi | `9WfX...` |

Lalu isi file `frontend\public\ads.txt` dengan baris yang diberikan AdSense (ID `pub-...`
tanpa awalan `ca-`), misalnya:
```
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

Setelah keduanya diedit, deploy ulang:

```powershell
git add -A
git commit -m "Add Google codes"
git push
```

GitHub otomatis rebuild & publish. Selesai.

---

## Catatan

- **Verifikasi Search Console / AdSense:** isi `googleSiteVerification` lalu push — tag meta
  otomatis muncul di `<head>` semua halaman.
- **Akses lanjutan:** Anda bisa install GitHub CLI di PC lain dan login dengan akun yang sama.
- **Hapus situs:** hapus repo di GitHub → situs tidak akan lagi diakses.