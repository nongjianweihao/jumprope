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
