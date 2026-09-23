# Tahap-Tahap Publish ToolsAmerican ke GitHub Pages

Situs akan di-host di: **https://toolsamerican.github.io**

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
git commit -m "Initial commit: ToolsAmerican site"
```

---

## Tahap 4 — Buat repository di GitHub

```powershell
gh repo create toolsamerican.github.io --public --source . --remote origin --push
```

- Nama **harus persis** `toolsamerican.github.io` (tanpa akhiran lain).
- `--push` otomatis mengirim commit main → memicu build di GitHub.

**Jika nama itu sudah dipakai orang lain:** ubah akun Anda ke username lain di GitHub, atau
ganti nama sesuai username akun Anda: `<username>.github.io`.

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

## Tahap 6 — Aktifkan Pages (satu kali, kalau belum otomatis)

Setelah workflow selesai, buka di browser:
`https://github.com/<username>/toolsamerican.github.io/settings/pages`

Pastikan **Source = "Deploy from a branch" → `main` → `/ (root)`**.
Biasanya `deploy-pages@v4` sudah mengaktifkannya sendiri; langkah ini hanya cadangan.

---

## Tahap 7 — Cek situs live

Buka di browser: **https://toolsamerican.github.io**

Periksa:
- Homepage tampil dengan styling
- `/tools/` daftar 12 tools
- `/robots.txt` → berisi `Sitemap: https://toolsamerican.github.io/sitemap-index.xml`
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