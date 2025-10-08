import { jsx as _jsx } from "react/jsx-runtime";
export function ExportPdfButton({ target, fileName, student }) {
    const handleExport = async () => {
        console.info('Exporting PDF for target', target);
        alert(`模拟导出：${fileName({ name: student?.name ?? 'student' })}`);
    };
    return (_jsx("button", { type: "button", onClick: handleExport, className: "rounded-full border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10", children: "\u5BFC\u51FA\u6210\u957F\u62A5\u544A" }));
}
