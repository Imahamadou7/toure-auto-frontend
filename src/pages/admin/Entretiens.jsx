import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { formatFCFA, mediaUrl } from '../../utils/format';
import { FiTrash2 } from 'react-icons/fi';

const STATUTS = [
  { value: 'en_attente', label: 'En attente', cls: 'bg-amber-100 text-amber-700' },
  { value: 'confirme', label: 'Confirmé', cls: 'bg-green-100 text-green-700' },
  { value: 'termine', label: 'Terminé', cls: 'bg-gray-100 text-gray-700' },
  { value: 'annule', label: 'Annulé', cls: 'bg-red-100 text-red-700' },
];

export default function Entretiens() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/entretiens').then(({ data }) => setList(data))
      .catch(() => toast.error('Chargement impossible')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatut = async (id, statut) => {
    try { await api.patch(`/entretiens/${id}/statut`, { statut }); load(); }
    catch { toast.error('Mise à jour impossible'); }
  };

  const remove = async (id) => {
    if (!confirm('Supprimer cette demande ?')) return;
    await api.delete(`/entretiens/${id}`); load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-ink-900">Demandes d'entretien</h1>
      {loading ? <p className="text-ink-800/60">Chargement…</p> :
        list.length === 0 ? <p className="text-ink-800/60">Aucune demande pour le moment.</p> :
        <div className="space-y-3">
          {list.map(e => {
            const statutInfo = STATUTS.find(s => s.value === e.statut) || STATUTS[0];
            return (
              <div key={e.id} className="card p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-bold text-ink-900">{e.nom_client}
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded ${statutInfo.cls}`}>{statutInfo.label}</span>
                    </div>
                    <div className="text-xs text-ink-800/60">{e.vehicule_info}</div>
                    {e.date_souhaitee && <div className="text-xs text-ink-800/60 mt-1">Souhaité le {e.date_souhaitee}</div>}
                    <div className="text-xs text-ink-800/60 mt-1">
                      <a href={`tel:${e.telephone}`} className="hover:underline">{e.telephone}</a>
                      {e.email && <> · <a href={`mailto:${e.email}`} className="hover:underline">{e.email}</a></>}
                    </div>
                    {e.services && <div className="text-xs text-ink-800/70 mt-1">Services : {e.services}</div>}
                    {e.total_estime != null && <div className="text-sm font-bold text-copper-700 mt-1">{formatFCFA(e.total_estime)}</div>}
                  </div>
                  <div className="flex gap-1 items-start">
                    <select value={e.statut} onChange={(ev) => updateStatut(e.id, ev.target.value)} className="input py-1.5 text-xs">
                      {STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <button onClick={() => remove(e.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><FiTrash2/></button>
                  </div>
                </div>
                {e.description && <p className="mt-3 text-sm text-ink-800/80 whitespace-pre-wrap border-t border-cream-200 pt-3">{e.description}</p>}
                {(e.photo1 || e.photo2) && (
                  <div className="mt-3 flex gap-3 border-t border-cream-200 pt-3">
                    {e.photo1 && <a href={mediaUrl(e.photo1)} target="_blank" rel="noreferrer"><img src={mediaUrl(e.photo1)} alt="photo 1" className="w-24 h-24 object-cover rounded-lg border border-cream-200 hover:opacity-80" /></a>}
                    {e.photo2 && <a href={mediaUrl(e.photo2)} target="_blank" rel="noreferrer"><img src={mediaUrl(e.photo2)} alt="photo 2" className="w-24 h-24 object-cover rounded-lg border border-cream-200 hover:opacity-80" /></a>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}
