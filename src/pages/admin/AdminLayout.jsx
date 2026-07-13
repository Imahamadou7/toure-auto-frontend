import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiHome, FiTag, FiKey, FiCalendar, FiTool, FiMail, FiSettings, FiLogOut } from 'react-icons/fi';

const items = [
  { to: '/admin', label: 'Tableau de bord', icon: FiHome, end: true },
  { to: '/admin/ventes', label: 'Ventes', icon: FiTag },
  { to: '/admin/locations', label: 'Locations', icon: FiKey },
  { to: '/admin/reservations', label: 'Réservations', icon: FiCalendar },
  { to: '/admin/entretiens', label: 'Entretiens', icon: FiTool },
  { to: '/admin/services', label: 'Services entretien', icon: FiSettings },
  { to: '/admin/messages', label: 'Messages', icon: FiMail },
  { to: '/admin/parametres', label: 'Paramètres', icon: FiSettings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[240px_1fr] gap-6">
      <aside className="card p-4 lg:sticky lg:top-20 lg:h-fit">
        <div className="px-2 pb-3 border-b border-cream-200 mb-3">
          <div className="text-xs text-ink-800/60">Connecté en tant que</div>
          <div className="font-bold text-ink-900">{user?.username}</div>
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  isActive ? 'bg-copper-600 text-white' : 'text-ink-800 hover:bg-cream-100'
                }`}>
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout}
          className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
          <FiLogOut/> Déconnexion
        </button>
      </aside>
      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
