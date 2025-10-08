declare global {
  interface Window {
    html2canvas?: (element: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
    jspdf?: {
      jsPDF: new (orientation?: string, unit?: string, format?: string | number[]) => {
        addImage(imageData: string, format: string, x: number, y: number, width: number, height: number): void;
        save(filename?: string): void;
      };
    };
  }
}

export {};

declare module 'virtual:pwa-register' {
  interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}
