import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';
import api from '../api/client';
import { formatFCFA, mediaUrl } from '../utils/format';
import { sendEntretienEmail } from '../utils/emailjs';
import { useCompany } from '../contexts/CompanyContext';

export default function Entretien() {
  const { company } = useCompany();
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ nom_client: '', telephone: '', email: '', vehicule_info: '', date_souhaitee: '', description: '' });
  const [sending, setSending] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    api.get('/services').then(({ data }) => setServices(data)).catch(() => {});
  }, []);

  const total = useMemo(
    () => services.filter(s => selected.includes(s.id)).reduce((sum, s) => sum + Number(s.prix), 0),
    [services, selected]
  );

  const toggleService = (id) => setSelected(sel => sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files || []);
    const allowed = 2 - photos.length;
    const toAdd = files.slice(0, allowed).filter(f => f.size <= 5 * 1024 * 1024);
    if (files.some(f => f.size > 5 * 1024 * 1024)) toast.error('Fichier trop lourd (5 Mo max).');
    setPhotos(prev => [...prev, ...toAdd.map(f => ({ file: f, preview: URL.createObjectURL(f) }))]);
    e.target.value = '';
  };

  const removePhoto = (i) => {
    URL.revokeObjectURL(photos[i].preview);
    setPhotos(prev => prev.filter((_, idx) => idx !== i));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nom_client.trim() || !form.telephone.trim() || !form.vehicule_info.trim()) {
      return toast.error('Veuillez remplir les champs obligatoires.');
    }
    setSending(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      selected.forEach(id => formData.append('service_ids', id));
      photos.forEach(p => formData.append('photos', p.file));

      const { data } = await api.post('/entretiens', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      sendEntretienEmail({
        nomClient: form.nom_client,
        telephone: form.telephone,
        email: form.email,
        vehiculeInfo: form.vehicule_info,
        services: data.services || 'Non précisé',
        total: data.total_estime ? formatFCFA(data.total_estime) : 'Non précisé',
        dateSouhaitee: form.date_souhaitee || 'Non précisée',
        description: form.description || '—',
      }).catch(err => console.error('[emailjs]', err));

      toast.success('Demande envoyée ! Nous vous contactons rapidement.');
      setForm({ nom_client: '', telephone: '', email: '', vehicule_info: '', date_souhaitee: '', description: '' });
      setSelected([]);
      photos.forEach(p => URL.revokeObjectURL(p.preview));
      setPhotos([]);
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur d'envoi. Réessayez plus tard.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900">Entretien de votre véhicule</h1>
        <p className="text-ink-800/60 mt-2">Confiez l'entretien de votre véhicule à {company.nom} — peu importe où vous l'avez acheté.</p>
      </div>

      <form onSubmit={submit} className="card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Nom complet *</label>
            <input className="input" value={form.nom_client} onChange={set('nom_client')} required />
          </div>
          <div>
            <label className="label">Téléphone *</label>
            <input className="input" value={form.telephone} onChange={set('telephone')} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="label">Date souhaitée</label>
            <input type="date" min={new Date().toISOString().slice(0, 10)} className="input" value={form.date_souhaitee} onChange={set('date_souhaitee')} />
          </div>
        </div>

        <div>
          <label className="label">Véhicule (marque, modèle, année) *</label>
          <input className="input" placeholder="Ex : Toyota Corolla 2015" value={form.vehicule_info} onChange={set('vehicule_info')} required />
        </div>

        {services.length > 0 && (
          <div>
            <label className="label">Services souhaités (optionnel)</label>
            <div className="space-y-2">
              {services.map(s => (
                <label key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-cream-200 cursor-pointer hover:border-copper-400">
                  <span className="flex items-center gap-3">
                    <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleService(s.id)} className="w-4 h-4 accent-copper-600" />
                    <span className="text-sm text-ink-900">{s.nom}</span>
                  </span>
                  <span className="text-sm font-semibold text-copper-700">{formatFCFA(s.prix)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="label">Précisez votre besoin (optionnel)</label>
          <textarea rows={3} className="input" placeholder="Décrivez le problème ou les travaux souhaités…" value={form.description} onChange={set('description')} />
        </div>

        {/* Upload photos */}
        <div>
          <label className="label">Photos de votre véhicule (optionnel, 2 max)</label>
          <div className="flex gap-3 flex-wrap">
            {photos.map((p, i) => (
              <div key={i} className="relative w-28 h-28 rounded-lg overflow-hidden border border-cream-200">
                <img src={p.preview} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-red-600">
                  <FiX size={12} />
                </button>
              </div>
            ))}
            {photos.length < 2 && (
              <label className="w-28 h-28 rounded-lg border-2 border-dashed border-cream-200 grid place-items-center cursor-pointer hover:border-copper-500 text-ink-800/40 hover:text-copper-600 transition">
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handlePhotos} />
                <div className="text-center">
                  <FiUpload className="mx-auto" size={20} />
                  <div className="text-xs mt-1">Ajouter</div>
                </div>
              </label>
            )}
          </div>
          <p className="text-xs text-ink-800/40 mt-1">JPG, PNG ou WebP · 5 Mo max par photo</p>
        </div>

        {selected.length > 0 && (
          <div className="bg-cream-100 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm text-ink-800/70">Total estimé ({selected.length} service{selected.length > 1 ? 's' : ''})</span>
            <span className="text-xl font-extrabold text-copper-700">{formatFCFA(total)}</span>
          </div>
        )}

        <button disabled={sending} className="btn-primary w-full disabled:opacity-60">
          {sending ? 'Envoi en cours…' : 'Envoyer la demande'}
        </button>
      </form>
    </div>
  );
}
