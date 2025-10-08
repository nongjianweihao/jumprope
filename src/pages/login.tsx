import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('用户名或密码错误。演示系统：任意用户名，密码为 "123456" 或 "admin"');
      }
    } catch (err) {
      setError('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-primary">勇士跳绳</h1>
          <p className="mt-2 text-sm text-slate-600">智慧跳绳教学管理平台</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              用户名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              placeholder="请输入用户名"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              placeholder="请输入密码"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-brand-primary px-4 py-3 font-semibold text-white transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>演示环境 · 任意用户名 + 密码: 123456 或 admin</p>
        </div>
      </div>
    </div>
  );
}
