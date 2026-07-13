import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { formatFCFA } from '../../utils/format';
import { FiTrash2 } from 'react-icons/fi';

const STATUTS = [
  { value: 'en_attente', label: 'En attente', cls: 'bg-amber-100 text-amber-700' },
  { value: 'confirmee', label: 'Confirmée', cls: 'bg-green-100 text-green-700' },
  { value: 'annulee', label: 'Annulée', cls: 'bg-red-100 text-red-700' },
  { value: 'terminee', label: 'Terminée', cls: 'bg-gray-100 text-gray-700' },
];

export default function Reservations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/reservations').then(({ data }) => setList(data))
      .catch(() => toast.error('Chargement impossible')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatut = async (id, statut) => {
    try {
      await api.patch(`/reservations/${id}/statut`, { statut });
      load();
    } catch {
      toast.error('Mise à jour impossible');
    }
  };

  const remove = async (id) => {
    if (!confirm('Supprimer cette réservation ?')) return;
    await api.delete(`/reservations/${id}`); load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-ink-900">Demandes de réservation</h1>
      {loading ? <p className="text-ink-800/60">Chargement…</p> :
        list.length === 0 ? <p className="text-ink-800/60">Aucune réservation pour le moment.</p> :
        <div className="space-y-3">
          {list.map(r => {
            const statutInfo = STATUTS.find(s => s.value === r.statut) || STATUTS[0];
            return (
              <div key={r.id} className="card p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-bold text-ink-900">{r.nom_client}
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded ${statutInfo.cls}`}>{statutInfo.label}</span>
                    </div>
                    <div className="text-xs text-ink-800/60">
                      {r.vehicule?.nom || 'Véhicule supprimé'} · {formatFCFA(r.vehicule?.prix)} /jour
                    </div>
                    <div className="text-xs text-ink-800/60 mt-1">
                      Du {r.date_debut} au {r.date_fin} · {r.nombre_jours} jour{r.nombre_jours > 1 ? 's' : ''}
                    </div>
                    {r.total_estime != null && (
                      <div className="text-sm font-bold text-copper-700 mt-1">{formatFCFA(r.total_estime)}</div>
                    )}
                    <div className="text-xs text-ink-800/60 mt-1">
                      <a href={`tel:${r.telephone}`} className="hover:underline">{r.telephone}</a>
                      {r.email && <> · <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a></>}
                    </div>
                  </div>
                  <div className="flex gap-1 items-start">
                    <select value={r.statut} onChange={(e) => updateStatut(r.id, e.target.value)}
                      className="input py-1.5 text-xs">
                      {STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <button onClick={() => remove(r.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><FiTrash2/></button>
                  </div>
                </div>
                {r.message && <p className="mt-3 text-sm text-ink-800/80 whitespace-pre-wrap border-t border-cream-200 pt-3">{r.message}</p>}
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}
