import { Outlet } from 'react-router-dom';
import { NavigationMenu } from './NavigationMenu';

export function LayoutShell() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-brand-primary">勇士跳绳 · 教学中台</h1>
            <p className="text-xs text-slate-500">PWA 离线 · Dexie 本地化 · 游戏化成长档案</p>
          </div>
          <NavigationMenu />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
