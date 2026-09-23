export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export class ToolController {
  constructor(opts) {
    this.uid = opts.uid;
    this.minFiles = opts.minFiles || 1;
    this.maxFiles = opts.maxFiles || Infinity;
    this.process = opts.process;
    this.files = [];

    this.dropzone = document.getElementById(`${this.uid}-dropzone`);
    this.input = document.getElementById(`${this.uid}-input`);
    this.filesEl = document.getElementById(`${this.uid}-files`);
    this.processBtn = document.getElementById(`${this.uid}-process`);
    this.statusEl = document.getElementById(`${this.uid}-status`);
    this.spinner = document.getElementById(`${this.uid}-spinner`);
    this.progressWrap = document.getElementById(`${this.uid}-progresswrap`);
    this.bar = document.getElementById(`${this.uid}-bar`);
    this.progressText = document.getElementById(`${this.uid}-progressText`);
    this.result = document.getElementById(`${this.uid}-result`);

    this.busy = false;
    this._bind();
  }

  _bind() {
    if (!this.dropzone || !this.input || !this.processBtn) return;
    this.input.addEventListener('change', () => this._addFiles([...this.input.files]));
    this.dropzone.addEventListener('click', () => this.input.click());
    this.dropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.input.click();
      }
    });

    for (const ev of ['dragenter', 'dragover']) {
      this.dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        this.dropzone.classList.add('dropzone-over');
      });
    }
    for (const ev of ['dragleave', 'drop']) {
      this.dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        this.dropzone.classList.remove('dropzone-over');
      });
    }
    this.dropzone.addEventListener('drop', (e) => this._addFiles([...e.dataTransfer.files]));
    this.processBtn.addEventListener('click', () => this._run());
  }

  _addFiles(incoming) {
    if (this.busy) return;
    for (const f of incoming) {
      if (this.files.length >= this.maxFiles) break;
      this.files.push(f);
    }
    this.input.value = '';
    this._renderFiles();
  }

  _removeFile(index) {
    if (this.busy) return;
    this.files.splice(index, 1);
    this._renderFiles();
  }

  _renderFiles() {
    this.filesEl.innerHTML = '';
    this.files.forEach((f, i) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm';
      const name = document.createElement('span');
      name.className = 'truncate text-slate-700';
      name.textContent = f.name;
      const size = document.createElement('span');
      size.className = 'shrink-0 text-xs text-slate-400';
      size.textContent = formatBytes(f.size);
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'shrink-0 rounded p-1 text-slate-400 hover:text-rose-500';
      rm.setAttribute('aria-label', `Remove ${f.name}`);
      rm.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
      rm.addEventListener('click', () => this._removeFile(i));
      row.append(name, size, rm);
      this.filesEl.appendChild(row);
    });

    const ready = this.files.length >= this.minFiles;
    this.processBtn.disabled = !ready;
    this.setStatus(this.files.length > 0 ? `${this.files.length} file(s) ready` : '');
  }

  setStatus(msg) {
    if (this.statusEl) this.statusEl.textContent = msg || '';
  }

  setProgress(pct) {
    const shown = pct !== null && pct !== undefined;
    this.progressWrap.classList.toggle('hidden', !shown);
    if (shown) {
      this.bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
      this.progressText.textContent = `${Math.round(pct)}%`;
    }
  }

  _setBusy(busy) {
    this.busy = busy;
    if (this.processBtn) this.processBtn.disabled = busy;
    if (this.spinner) this.spinner.classList.toggle('hidden', !busy);
    if (busy) this.result.innerHTML = '';
  }

  async _run() {
    if (this.busy || this.files.length < this.minFiles) return;
    this._setBusy(true);
    this.setStatus('Processing…');
    try {
      const outputs = await this.process(this.files, {
        status: (msg) => this.setStatus(msg),
        progress: (pct) => this.setProgress(pct),
      });
      this.setStatus('');
      this.setProgress(null);
      this.renderResults(outputs);
    } catch (err) {
      console.error(err);
      this.setStatus('');
      this.setProgress(null);
      this.result.innerHTML = '';
      const box = document.createElement('div');
      box.className = 'rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700';
      box.textContent = `Something went wrong: ${err?.message || 'Unknown error'}`;
      this.result.appendChild(box);
    } finally {
      this._setBusy(false);
      this.renderResultAfter();
    }
    this.processBtn && (this.processBtn.disabled = this.files.length < this.minFiles);
  }

  renderResults(outputs) {
    this.result.innerHTML = '';
    if (!Array.isArray(outputs)) outputs = [outputs];
    outputs.forEach((out) => {
      const url = typeof out === 'string' ? out : out.url;
      const name = typeof out === 'string' ? 'download' : out.name;
      const fileSize = typeof out === 'string' ? null : out.size;
      const wrap = document.createElement('div');
      wrap.className = 'flex flex-wrap items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3';
      const label = document.createElement('span');
      label.className = 'flex-1 text-sm font-medium text-emerald-800';
      label.textContent = fileSize ? `${name} · ${formatBytes(fileSize)}` : name;
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.className = 'inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700';
      a.textContent = 'Download';
      wrap.append(label, a);
      this.result.appendChild(wrap);
    });
  }

  renderResultAfter() {}
}

export function createDownload(blob, name) {
  return {
    url: URL.createObjectURL(blob),
    name,
    size: blob.size,
  };
}