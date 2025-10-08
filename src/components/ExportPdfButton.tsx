import { ensureHtml2Canvas, ensureJsPDF } from '../utils/pdf';

interface Props {
  target: string;
  fileName: (options?: { name?: string }) => string;
  student?: { name?: string };
}

export function ExportPdfButton({ target, fileName, student }: Props) {
  const handleExport = async () => {
    try {
      const el = document.querySelector(target) as HTMLElement | null;
      if (!el) {
        alert('未找到报告节点');
        return;
      }
      const [html2canvas, JsPDF] = await Promise.all([ensureHtml2Canvas(), ensureJsPDF()]);
      const canvas = await html2canvas(el, { scale: 2 });
      const img = canvas.toDataURL('image/png');
      const pdf = new JsPDF('p', 'mm', 'a4');
      const width = 210;
      const height = (canvas.height / canvas.width) * width;
      pdf.addImage(img, 'PNG', 0, 0, width, height);
      pdf.save(fileName({ name: student?.name ?? 'student' }));
    } catch (error) {
      console.error('导出 PDF 失败', error);
      alert('导出失败，请检查网络或稍后再试');
    }
  };
  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-full border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10"
    >
      导出成长报告
    </button>
  );
}
