interface Props {
  target: string;
  fileName: (options?: { name: string }) => string;
  student?: { name: string };
}

export function ExportPdfButton({ target, fileName, student }: Props) {
  const handleExport = async () => {
    console.info('Exporting PDF for target', target);
    alert(`模拟导出：${fileName({ name: student?.name ?? 'student' })}`);
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
