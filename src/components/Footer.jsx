import { useCompany } from '../contexts/CompanyContext';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';

export default function Footer() {
  const { company } = useCompany();
  return (
    <footer className="bg-ink-900 text-cream-50 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-bold text-lg">{company.nom}</div>
          <p className="text-sm text-cream-50/70 mt-2">{company.description.slice(0, 140)}…</p>
        </div>
        <div className="text-sm space-y-2">
          <div className="font-semibold mb-2 text-copper-400">Contact</div>
          <p className="flex items-start gap-2"><FiPhone className="mt-0.5"/> {company.telephone} · {company.telephone2}</p>
          <p className="flex items-start gap-2"><FiMail className="mt-0.5"/> {company.email}</p>
          <p className="flex items-start gap-2"><FiMapPin className="mt-0.5"/> {company.adresse}</p>
          <p className="flex items-start gap-2"><FiClock className="mt-0.5"/> {company.horaires}</p>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-2 text-copper-400">Notre engagement</div>
          <p className="text-cream-50/70">Véhicules sélectionnés, prix justes, suivi après-vente.</p>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs sm:text-sm text-cream-50/60 py-4">
        © {new Date().getFullYear()} {company.nom} — Tous droits réservés.
      </div>
    </footer>
  );
}
