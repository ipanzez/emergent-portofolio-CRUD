import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Briefcase, ExternalLink, FolderKanban, LayoutDashboard, LogOut, Settings, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/profile", label: "Hero & About", icon: UserRound },
  { to: "/admin/skills", label: "Skills & Tools", icon: Sparkles },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const doLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] md:flex" data-testid="admin-layout">
      <aside className="flex w-full flex-col border-b border-gray-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-5 md:block">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white"><Sparkles size={16} className="text-blue-300" /></span>
            <span className="text-sm font-bold tracking-tight text-gray-900">Portfolio CMS</span>
          </Link>
          <button onClick={doLogout} data-testid="admin-logout-btn-mobile" className="text-gray-500 md:hidden"><LogOut size={18} /></button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:pb-0">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              data-testid={`admin-nav-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-ink text-white" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t border-gray-100 p-4 md:block">
          <a href="/" target="_blank" rel="noreferrer" data-testid="admin-view-site-link" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
            <ExternalLink size={15} /> View site
          </a>
          <div className="mt-2 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
            <span className="text-sm font-medium text-gray-800" data-testid="admin-username">{user?.username}</span>
            <button onClick={doLogout} data-testid="admin-logout-btn" className="text-gray-500 hover:text-rose" title="Logout"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>
      <main className="flex-1 px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl"><Outlet /></div>
      </main>
    </div>
  );
}
