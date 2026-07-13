import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { FiTrash2, FiCheck } from 'react-icons/fi';

export default function MessagesAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/messages').then(({ data }) => setList(data))
      .catch(() => toast.error('Chargement impossible')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markRead = async (id) => { await api.patch(`/messages/${id}/lu`); load(); };
  const remove = async (id) => {
    if (!confirm('Supprimer ce message ?')) return;
    await api.delete(`/messages/${id}`); load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-ink-900">Messages reçus</h1>
      {loading ? <p className="text-ink-800/60">Chargement…</p> :
        list.length === 0 ? <p className="text-ink-800/60">Aucun message.</p> :
        <div className="space-y-3">
          {list.map(m => (
            <div key={m.id} className={`card p-4 ${m.lu ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-ink-900">{m.nom}
                    {!m.lu && <span className="ml-2 text-xs px-2 py-0.5 rounded bg-copper-600 text-white">Nouveau</span>}
                  </div>
                  <div className="text-xs text-ink-800/60">
                    <a href={`mailto:${m.email}`} className="hover:underline">{m.email}</a>
                    {m.telephone && ` · ${m.telephone}`} ·
                    {' '}{new Date(m.createdAt).toLocaleString('fr-FR')}
                  </div>
                </div>
                <div className="flex gap-1">
                  {!m.lu && <button onClick={() => markRead(m.id)} className="p-2 rounded hover:bg-cream-100" title="Marquer comme lu"><FiCheck/></button>}
                  <button onClick={() => remove(m.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><FiTrash2/></button>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-800/80 whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
