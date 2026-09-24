# Deploy Bytecore ke Shared Hosting

Situs **Bytecore** adalah situs statis murni (HTML/CSS/JS). Tidak butuh database, `index.php`,
atau `install.php` — server langsung melayani `index.html`. Ikuti langkah ini.

**Paket siap unggah:** `bytecore-upload.zip` (di folder proyek ini, ±11 MB).

---

## Opsi A — cPanel File Manager (tanpa FTP)

1. Login cPanel Anda.
2. Buka **File Manager** → masuk folder **`public_html`** (bisa bernama `httpdocs` atau
   `server-name` balik ke penyedia).
3. **Bersihkan isi bawaan host** di `public_html` (selain folder `cgi-bin` kalau ada):
   pilih semua → **Delete**. Jangan hapus `.htaccess` bot/host kalau Anda ragu; cukup hapus
   file seperti `index.html`/`index.php` default.
4. Klik **Upload** → pilih `bytecore-upload.zip` → tunggu selesai (11 MB).
5. Kembali ke File Manager → klik kanan `bytecore-upload.zip` → **Extract** (harusnya
   otomatis mengekstrak di `public_html`).
6. Hapus `bytecore-upload.zip` setelah ekstrak (pilih → Delete).
7. Selesai — cek `https://bytecore.biz.id/`.

---

## Opsi B — FTP (FileZilla)

1. Buat akun FTP di cPanel (**FTP Accounts**) jika belum ada. Catat: host, username, password.
2. Di FileZilla: **File → Site Manager → New Site** — isi Host, port `21`, User, Password → Connect.
3. Buka folder remote `public_html`, bersihkan isi bawaan host.
4. Unggah **isi** `bytecore-upload.zip` (buka zip dulu di PC, lalu drag seluruh isinya:
   `index.html`, `_assets/`, `tool/`, `ffmpeg/`, `pdfjs/`, dst.) ke `public_html`.
   Jangan unggah zip-nya utuh untuk diekstrak di server; unggh file hasil ekstrak langsung.
5. Pastikan mode transfer **Binary** (FileZilla default otomatis).

---

## Setelah unggah — pastikan struktur benar

Di dalam `public_html` harus ada:

```
public_html/
├── .htaccess          ← ikut terunggah (cara B: file tersembunyi, aktifkan "Show hidden files" di FileZilla/biar tak terlewat)
├── 404.html
├── ads.txt
├── favicon.svg
├── index.html         ← halaman utama
├── og-image.png
├── robots.txt
├── sitemap-0.xml
├── sitemap-index.xml
├── _assets/           ← CSS & JS (penting untuk styling; wajib ada)
├── ffmpeg/            ← core ffmpeg.wasm (untuk tool video/audio)
├── pdfjs/             ← pdf.js worker (untuk tool PDF)
├── about/
├── blog/
├── contact/
├── privacy-policy/
├── terms-of-service/
└── tools/             ← 12 halaman tool
```

> **Tips:** jika `.htaccess` tidak muncul di File Manager, centang **Settings → Show Hidden Files**
> (dotfiles). Kalau terlewat, salin isi berikut ke file baru `.htaccess` di `public_html`:

```apache
Options -Indexes
ErrorDocument 404 /404.html

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
<IfModule mod_headers.c>
  <FilesMatch "\.(wasm|jpg|png|svg|css|js)(\?.*)?$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
```

Di PHP/server shared hosting biasa, cache-control baris di atas wajar. Jika host menolak
`.htaccess` (misal Litespeed tanpa AllowOverride), hapus blok `<IfModule mod_headers.c>` dan
ganti-ganti sesuaian — styling tetap jalan; yang penting `index.html` + `_assets/`.

---

## Verifikasi setelah live

Buka dan periksa:

1. `https://bytecore.biz.id/` → tampil dengan styling (bukan teks polos).
2. `https://bytecore.biz.id/tools/qr-code-generator/` → halaman tool tampil.
3. `https://bytecore.biz.id/robots.txt` → berisi
   `Sitemap: https://bytecore.biz.id/sitemap-index.xml`.
4. `https://bytecore.biz.id/sitemap-index.xml` → pointer ke `sitemap-0.xml`.
5. `https://bytecore.biz.id/ads.txt` → status saat ini berisi panduan (ganti setelah
   AdSense disetujui).

**Jika halaman tampil tanpa styling** = kemungkinan besar `_assets/` tidak terunggah atau
subfolder custom base path masih ketinggal (memang tidak, build sudah pakai `/`).

---

## DNS (sebelum / pas mengaktifkan)

Untuk domain `bytecore.biz.id` di-browse ke situs ini:

- **Jika domain dibeli dari penyedia hosting** → biasanya sudah otomatis. Cukup upload.
- **Jika domain di Registrar lain (Cloudflare/Namecheap)**: arahkan ke nama server (nameserver)
  dari penyedia shared hosting Anda di panel registra, atau tambahkan record `A`/`CNAME` ke IP
  hosting. Hubungi support hosting untuk nilai yang tepat.
- Bila sebelumnya dipakai GitHub Pages, pastikan setting custom domain di GitHub Pages
  **tidak** lagi menunjuk domain ini, agar hosting Anda yang melayani (jika keduanya aktif,
  DNS yang menentukan).

---

## Update terakhir

Setiap ada perubahan fitur: jalankan `npm run build` di `frontend/`, lalu ulangi proses
unggah di atas (hanya file berubah yang perlu diganti lewat FTP; dengan File Manager cukup
unggah ulang zip). File `.htaccess`, `robots.txt`, `ads.txt`, dan `_assets/` ikut di-build ulang
dan harus ter-update.