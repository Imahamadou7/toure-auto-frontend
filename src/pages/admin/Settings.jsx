import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { useCompany } from '../../contexts/CompanyContext';

const FIELDS = [
  { key: 'nom', label: 'Nom de l\'entreprise', required: true },
  { key: 'telephone', label: 'Téléphone principal (et numéro WhatsApp)', required: false },
  { key: 'telephone2', label: 'Téléphone secondaire', required: false },
  { key: 'email', label: 'Email de contact', required: false },
  { key: 'adresse', label: 'Adresse', required: false },
  { key: 'horaires', label: 'Horaires d\'ouverture', required: false },
  { key: 'facebook', label: 'Lien Facebook', required: false },
  { key: 'whatsapp', label: 'Lien WhatsApp (ex: https://wa.me/22370000000)', required: false },
];

export default function Settings() {
  const { setCompany } = useCompany();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/company').then(({ data }) => setForm(data)).catch(() => toast.error('Chargement impossible'));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nom?.trim()) return toast.error('Le nom est obligatoire.');
    setSaving(true);
    try {
      const { data } = await api.put('/company', form);
      setCompany(prev => ({ ...prev, ...data })); // met à jour partout dans l'app immédiatement
      toast.success('Paramètres sauvegardés !');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <p className="text-ink-800/60">Chargement…</p>;

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-extrabold text-ink-900">Paramètres de l'entreprise</h1>
      <p className="text-sm text-ink-800/60">Ces informations s'affichent sur l'ensemble du site public (Navbar, Contact, fiches véhicules…).</p>
      <form onSubmit={submit} className="card p-6 space-y-4">
        {FIELDS.map(({ key, label, required }) => (
          <div key={key}>
            <label className="label">{label}{required && ' *'}</label>
            <input className="input" value={form[key] || ''} onChange={set(key)} required={required} />
          </div>
        ))}
        <div>
          <label className="label">Description</label>
          <textarea rows={4} className="input" value={form.description || ''} onChange={set('description')} />
        </div>
        <button disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Sauvegarde…' : 'Sauvegarder les modifications'}
        </button>
      </form>
    </div>
  );
}
