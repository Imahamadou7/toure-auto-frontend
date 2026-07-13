import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { formatFCFA } from '../../utils/format';
import { FiTrash2, FiPlus, FiEdit2 } from 'react-icons/fi';

export default function Services() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nom: '', prix: '' });
  const [editingId, setEditingId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/services?all=1').then(({ data }) => setList(data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const resetForm = () => { setForm({ nom: '', prix: '' }); setEditingId(null); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.prix) return toast.error('Nom et prix obligatoires.');
    try {
      if (editingId) await api.put(`/services/${editingId}`, { nom: form.nom, prix: Number(form.prix) });
      else await api.post('/services', { nom: form.nom, prix: Number(form.prix) });
      toast.success(editingId ? 'Service mis à jour' : 'Service ajouté');
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  const edit = (s) => { setForm({ nom: s.nom, prix: s.prix }); setEditingId(s.id); };

  const toggleActif = async (s) => {
    await api.put(`/services/${s.id}`, { actif: !s.actif });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Supprimer ce service ?')) return;
    await api.delete(`/services/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-ink-900">Services d'entretien</h1>

      <form onSubmit={submit} className="card p-5 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="label">Nom du service</label>
          <input className="input" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
        </div>
        <div className="w-40">
          <label className="label">Prix (FCFA)</label>
          <input type="number" min="0" className="input" value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} />
        </div>
        <button className="btn-primary flex items-center gap-2">
          <FiPlus/> {editingId ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {editingId && <button type="button" onClick={resetForm} className="btn-ghost">Annuler</button>}
      </form>

      {loading ? <p className="text-ink-800/60">Chargement…</p> : (
        <div className="card divide-y divide-cream-200">
          {list.map(s => (
            <div key={s.id} className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleActif(s)}
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${s.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {s.actif ? 'Actif' : 'Désactivé'}
                </button>
                <span className="font-medium text-ink-900">{s.nom}</span>
                <span className="text-copper-700 font-bold">{formatFCFA(s.prix)}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => edit(s)} className="p-2 rounded hover:bg-cream-100"><FiEdit2 size={16}/></button>
                <button onClick={() => remove(s.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><FiTrash2 size={16}/></button>
              </div>
            </div>
          ))}
          {!list.length && <p className="p-4 text-sm text-ink-800/60">Aucun service pour le moment.</p>}
        </div>
      )}
      <p className="text-xs text-ink-800/50">Un service "Désactivé" n'apparaît plus dans le formulaire public, mais reste visible ici.</p>
    </div>
  );
}
