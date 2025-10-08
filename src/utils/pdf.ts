interface Html2CanvasFn {
  (element: HTMLElement, options?: Record<string, unknown>): Promise<HTMLCanvasElement>;
}

interface JsPdfInstance {
  addImage(imageData: string, format: string, x: number, y: number, width: number, height: number): void;
  save(filename?: string): void;
}

interface JsPdfConstructor {
  new (orientation?: string, unit?: string, format?: string | number[]): JsPdfInstance;
}

const HTML2CANVAS_SRC = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
const JSPDF_SRC = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';

let html2canvasPromise: Promise<Html2CanvasFn> | null = null;
let jsPdfPromise: Promise<JsPdfConstructor> | null = null;

function loadScript(src: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('脚本仅能在浏览器环境加载'));
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-external="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`加载脚本失败: ${src}`)), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.external = src;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    });
    script.addEventListener('error', () => reject(new Error(`加载脚本失败: ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

export async function ensureHtml2Canvas(): Promise<Html2CanvasFn> {
  if (typeof window === 'undefined') {
    throw new Error('html2canvas 仅在浏览器环境可用');
  }
  if (window.html2canvas) {
    return window.html2canvas as Html2CanvasFn;
  }
  if (!html2canvasPromise) {
    html2canvasPromise = loadScript(HTML2CANVAS_SRC).then(() => {
      if (!window.html2canvas) {
        throw new Error('未能获取 html2canvas 实例');
      }
      return window.html2canvas as Html2CanvasFn;
    });
  }
  return html2canvasPromise;
}

export async function ensureJsPDF(): Promise<JsPdfConstructor> {
  if (typeof window === 'undefined') {
    throw new Error('jsPDF 仅在浏览器环境可用');
  }
  const globalJsPdf = window.jspdf?.jsPDF;
  if (globalJsPdf) {
    return globalJsPdf as JsPdfConstructor;
  }
  if (!jsPdfPromise) {
    jsPdfPromise = loadScript(JSPDF_SRC).then(() => {
      const ctor = window.jspdf?.jsPDF;
      if (!ctor) {
        throw new Error('未能获取 jsPDF 实例');
      }
      return ctor as JsPdfConstructor;
    });
  }
  return jsPdfPromise;
}
