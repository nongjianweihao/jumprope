import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const links = [
  { to: '/classes', label: '班级' },
  { to: '/students', label: '学员' },
  { to: '/templates', label: '模板库' },
  { to: '/training', label: '训练库' },
  { to: '/session/demo', label: '上课面板' },
  { to: '/wallboard', label: '壁板模式' },
  { to: '/assessments', label: '测评' },
  { to: '/finance', label: '财务' },
  { to: '/settings', label: '设置' }
];

export function NavigationMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex flex-wrap items-center gap-3 text-sm">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `rounded-full px-3 py-1 transition-colors ${isActive ? 'bg-brand-primary text-white' : 'text-slate-600 hover:bg-slate-200'}`
          }
        >
          {link.label}
        </NavLink>
      ))}
      <div className="ml-2 flex items-center gap-2 border-l border-slate-300 pl-3">
        <span className="text-xs text-slate-500">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="rounded-full bg-red-500 px-3 py-1 text-white transition-colors hover:bg-red-600"
        >
          退出
        </button>
      </div>
    </nav>
  );
}
