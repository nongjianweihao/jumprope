import { useState } from 'react';
import { templatesRepo } from '../../store/repositories/templatesRepo';
import { parseTemplates } from '../../utils/csv';
import { nanoid } from '../../utils/id';

export default function SettingsIndex() {
  const [json, setJson] = useState('');
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    try {
      const templates = parseTemplates(json).map((template) => ({
        ...template,
        id: template.id ?? nanoid(),
        createdAt: template.createdAt ?? new Date().toISOString()
      }));
      await Promise.all(templates.map((template) => templatesRepo.upsert(template)));
      setMessage(`成功导入 ${templates.length} 个模板`);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">系统设置 & 导入导出</h2>
        <p className="text-sm text-slate-500">支持课程模板 JSON 导入、导出备份以及品牌配置。</p>
      </div>
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-600">导入课程模板 JSON</h3>
        <textarea
          value={json}
          onChange={(event) => setJson(event.target.value)}
          className="h-40 w-full rounded-2xl border border-slate-200 p-3 text-xs"
          placeholder="粘贴模板数组 JSON，支持新增字段 durationMinTotal"
        />
        <button type="button" onClick={handleImport} className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
          导入模板
        </button>
        {message && <div className="text-xs text-brand-success">{message}</div>}
      </section>
    </div>
  );
}
