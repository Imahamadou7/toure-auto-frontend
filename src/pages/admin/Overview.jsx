import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { formatFCFA } from '../../utils/format';

export default function Overview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/stats').then(({ data }) => setStats(data)).catch(() => {}); }, []);

  const cards = [
    { label: 'Total véhicules', value: stats?.total ?? '…', color: 'bg-copper-600' },
    { label: 'En vente', value: stats?.ventes ?? '…', color: 'bg-ink-900', to: '/admin/ventes' },
    { label: 'En location', value: stats?.locations ?? '…', color: 'bg-copper-700', to: '/admin/locations' },
    { label: 'Réservations en attente', value: stats?.reservationsEnAttente ?? '…', color: 'bg-amber-600', to: '/admin/reservations' },
    { label: 'Entretiens en attente', value: stats?.entretiensEnAttente ?? '…', color: 'bg-teal-600', to: '/admin/entretiens' },
    { label: 'Messages reçus', value: stats?.messages ?? '…', color: 'bg-ink-800', to: '/admin/messages' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">Tableau de bord</h1>
        <p className="text-ink-800/60 text-sm">Vue d'ensemble de votre activité.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c, i) => {
          const Wrapper = c.to ? Link : 'div';
          return (
            <Wrapper key={i} to={c.to} className="card p-5 block">
              <div className={`w-10 h-10 rounded-lg ${c.color} mb-3`} />
              <div className="text-2xl font-extrabold text-ink-900">{c.value}</div>
              <div className="text-sm text-ink-800/60">{c.label}</div>
            </Wrapper>
          );
        })}
      </div>
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-ink-900">Dernières publications</h2>
          <Link to="/admin/ventes" className="text-sm text-copper-700 font-semibold">Gérer →</Link>
        </div>
        {stats?.derniers?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-ink-800/60">
                <tr><th className="py-2">Nom</th><th>Type</th><th>Prix</th><th>Date</th></tr>
              </thead>
              <tbody>
                {stats.derniers.map(v => (
                  <tr key={v.id} className="border-t border-cream-200">
                    <td className="py-2 font-medium">{v.nom}</td>
                    <td><span className="text-xs px-2 py-0.5 rounded bg-cream-100">{v.type}</span></td>
                    <td>{formatFCFA(v.prix)}</td>
                    <td className="text-ink-800/60">{new Date(v.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-sm text-ink-800/60">Aucune publication pour le moment.</p>}
      </div>
    </div>
  );
}
