import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Props {
  target: string;
  fileName: (options?: { name: string }) => string;
  student?: { name: string };
}

export function ExportPdfButton({ target, fileName, student }: Props) {
  const handleExport = async () => {
    const el = document.querySelector(target) as HTMLElement | null;
    if (!el) {
      alert('未找到报告节点');
      return;
    }
    const canvas = await html2canvas(el, { scale: 2 });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = 210;
    const height = (canvas.height / canvas.width) * width;
    pdf.addImage(img, 'PNG', 0, 0, width, height);
    pdf.save(fileName({ name: student?.name ?? 'student' }));
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
