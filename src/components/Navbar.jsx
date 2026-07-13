import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useCompany } from '../contexts/CompanyContext';
import logo from "../assets/logo.png";

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/ventes', label: 'Vente' },
  { to: '/location', label: 'Location' },
  { to: '/entretien', label: 'Entretien' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { company } = useCompany();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <Link to="/" className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex-shrink-0">
  <img
    src="/favicon.png"
    alt="Toure Auto Service SARL"
    className="w-full h-full object-contain"
  />
</div>
            <div className="min-w-0">
              <div className="font-bold text-sm sm:text-base truncate text-ink-900">{company.nom}</div>
              <div className="text-[10px] sm:text-xs text-ink-800/60 truncate">Vente · Location</div>
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-copper-600 text-white' : 'text-ink-800 hover:bg-cream-100'
                }`
              }>{l.label}</NavLink>
          ))}
          <Link to="/login" className="ml-2 btn-ghost py-2 px-4 text-sm">Admin</Link>
        </nav>
        <button className="md:hidden p-2 rounded-lg hover:bg-cream-100"
          onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <FiX size={22}/> : <FiMenu size={22}/>}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-cream-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'bg-copper-600 text-white' : 'hover:bg-cream-100'}`
                }>{l.label}</NavLink>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="btn-primary mt-2 text-sm">Espace Admin</Link>
          </div>
        </div>
      )}
    </header>
  );
}
