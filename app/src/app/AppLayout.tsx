import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

const navItems = [
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/rbac', label: 'RBAC' },
  { to: '/ai-assistant', label: 'RAG Demo' },
];

function navClassName(isActive: boolean) {
  return `block rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
  }`;
}

export function AppLayout() {
  const { session, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="w-64 border-r border-slate-200 bg-white p-4">
          <h1 className="mb-6 text-lg font-semibold">Portfolio</h1>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => navClassName(isActive)}>
                {item.label}
              </NavLink>
            ))}
            <a
              href="https://jobsearchagent.koshurwaan.in"
              target="_blank"
              rel="noreferrer"
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Job Search ↗
            </a>
          </nav>
          <div className="mt-8 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Signed in as</p>
            <p className="mt-1 truncate">{session?.user.email}</p>
            <button
              type="button"
              className="mt-3 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() => logout('You have been logged out.')}
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
