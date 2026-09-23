export const CATEGORIES = [
  { id: 'document', label: 'Document' },
  { id: 'image', label: 'Image' },
  { id: 'audio-video', label: 'Audio & Video' },
  { id: 'link', label: 'Link' },
];

export const TOOLS = [
  {
    slug: 'merge-pdf',
    path: '/tools/merge-pdf/',
    title: 'Merge PDF',
    tagline: 'Combine multiple PDF files into one document, in any order, right in your browser.',
    icon: '📄',
    category: 'document',
    accent: '#2563eb',
  },
  {
    slug: 'compress-pdf',
    path: '/tools/compress-pdf/',
    title: 'Compress PDF',
    tagline: 'Reduce PDF file size by cleaning metadata, fonts, and unused objects — no quality loss.',
    icon: '🗜️',
    category: 'document',
    accent: '#2563eb',
  },
  {
    slug: 'pdf-to-text',
    path: '/tools/pdf-to-text/',
    title: 'PDF to Text',
    tagline: 'Extract all text from a PDF document quickly. Works with scanned pages too.',
    icon: '📝',
    category: 'document',
    accent: '#2563eb',
  },
  {
    slug: 'pdf-to-jpg',
    path: '/tools/pdf-to-jpg/',
    title: 'PDF to JPG',
    tagline: 'Convert PDF pages into high-quality JPG images, one page or all pages.',
    icon: '🖼️',
    category: 'document',
    accent: '#2563eb',
  },
  {
    slug: 'docx-to-html',
    path: '/tools/docx-to-html/',
    title: 'DOCX to HTML',
    tagline: 'Convert Word documents to clean, readable HTML with formatting preserved.',
    icon: '🧾',
    category: 'document',
    accent: '#2563eb',
  },
  {
    slug: 'excel-to-csv',
    path: '/tools/excel-to-csv/',
    title: 'Excel to CSV',
    tagline: 'Convert XLS/XLSX worksheets to CSV in one click. No uploads, full privacy.',
    icon: '📊',
    category: 'document',
    accent: '#2563eb',
  },
  {
    slug: 'compress-image',
    path: '/tools/compress-image/',
    title: 'Compress Image',
    tagline: 'Shrink JPG, PNG, WebP, and AVIF files while keeping them looking great.',
    icon: '🫙',
    category: 'image',
    accent: '#38bdf8',
  },
  {
    slug: 'image-converter',
    path: '/tools/image-converter/',
    title: 'Image Converter',
    tagline: 'Convert between JPG, PNG, and WebP formats instantly. Smart background fill included.',
    icon: '🔁',
    category: 'image',
    accent: '#38bdf8',
  },
  {
    slug: 'image-resizer',
    path: '/tools/image-resizer/',
    title: 'Image Resizer',
    tagline: 'Resize images by exact pixels or percentage with live preview. Great for social media.',
    icon: '📐',
    category: 'image',
    accent: '#38bdf8',
  },
  {
    slug: 'mp4-to-mp3',
    path: '/tools/mp4-to-mp3/',
    title: 'MP4 to MP3',
    tagline: 'Extract high-quality MP3 audio from any MP4 video. Runs on WebAssembly, private.',
    icon: '🎵',
    category: 'audio-video',
    accent: '#34d399',
  },
  {
    slug: 'audio-converter',
    path: '/tools/audio-converter/',
    title: 'Audio Converter',
    tagline: 'Convert audio between MP3, WAV, OGG, and M4A right in your browser.',
    icon: '🎧',
    category: 'audio-video',
    accent: '#34d399',
  },
  {
    slug: 'qr-code-generator',
    path: '/tools/qr-code-generator/',
    title: 'QR Code Generator',
    tagline: 'Create QR codes from URLs, text, or contact details. Download as PNG instantly.',
    icon: '🔳',
    category: 'link',
    accent: '#a78bfa',
  },
];

export function getToolsByCategory(ids) {
  if (!ids) return TOOLS;
  return TOOLS.filter((t) => ids.includes(t.category));
}

export function getTool(slug) {
  return TOOLS.find((t) => t.slug === slug);
}

export function getRelatedTools(slug, limit = 3) {
  const tool = getTool(slug);
  if (!tool) return [];
  const same = TOOLS.filter((t) => t.slug !== slug && t.category === tool.category);
  const others = TOOLS.filter((t) => t.slug !== slug && t.category !== tool.category);
  return [...same, ...others].slice(0, limit);
}

export function getCategoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || id;
}