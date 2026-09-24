# Backend

Bytecore is a **static site**. All tools run client-side in the browser using WebAssembly
(`@ffmpeg/ffmpeg`, `pdf.js`, `pdf-lib`, etc.).

There is no backend server and no API. Files are never uploaded or stored — they are processed
entirely on the user's device.

If a future feature truly requires server-side processing (e.g., OCR for scanned documents),
it would be a separate repository deployed behind the GitHub Pages site. Until then, this
directory intentionally stays empty.