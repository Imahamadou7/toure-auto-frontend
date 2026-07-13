import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import api from '../api/client';
import { sendReservationEmail } from '../utils/emailjs';
import { formatFCFA } from '../utils/format';

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + Number(days || 0));
  return d.toISOString().slice(0, 10);
}

export default function ReservationModal({ vehicule, onClose }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ nom_client: '', telephone: '', email: '', date_debut: today, nombre_jours: 1, message: '' });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => {
    const value = k === 'nombre_jours' ? Math.max(1, Number(e.target.value) || 1) : e.target.value;
    setForm({ ...form, [k]: value });
  };

  const dateFin = useMemo(() => addDays(form.date_debut || today, form.nombre_jours), [form.date_debut, form.nombre_jours]);
  const total = useMemo(() => Number(vehicule.prix || 0) * Number(form.nombre_jours || 0), [vehicule.prix, form.nombre_jours]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nom_client.trim() || !form.telephone.trim() || !form.date_debut) {
      return toast.error('Veuillez remplir les champs obligatoires.');
    }
    setSending(true);
    try {
      await api.post('/reservations', {
        nom_client: form.nom_client,
        telephone: form.telephone,
        email: form.email,
        date_debut: form.date_debut,
        date_fin: dateFin,
        nombre_jours: form.nombre_jours,
        message: form.message,
        vehicule_id: vehicule.id,
      });
      sendReservationEmail({
        vehiculeNom: vehicule.nom,
        nomClient: form.nom_client,
        telephone: form.telephone,
        email: form.email,
        dateDebut: form.date_debut,
        dateFin: dateFin,
        message: `${form.message || '—'} (Total estimé : ${formatFCFA(total)} pour ${form.nombre_jours} jour(s))`,
      }).catch((err) => console.error('[emailjs] envoi échoué :', err));
      toast.success('Demande envoyée ! Le vendeur vous contactera rapidement.');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur d'envoi. Réessayez plus tard.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4"
        onClick={onClose}
      >
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          onSubmit={submit}
          className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-lg text-ink-900">Réserver ce véhicule</h2>
              <p className="text-sm text-ink-800/60">{vehicule.nom} — {formatFCFA(vehicule.prix)} /jour</p>
            </div>
            <button type="button" onClick={onClose} className="p-1 hover:bg-cream-100 rounded"><FiX/></button>
          </div>

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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date de début *</label>
              <input type="date" min={today} className="input" value={form.date_debut} onChange={set('date_debut')} required />
            </div>
            <div>
              <label className="label">Nombre de jours *</label>
              <input type="number" min={1} className="input" value={form.nombre_jours} onChange={set('nombre_jours')} required />
            </div>
          </div>
          <p className="text-xs text-ink-800/60">Retour prévu le <strong>{dateFin}</strong></p>

          <div>
            <label className="label">Message (optionnel)</label>
            <textarea rows={2} className="input" value={form.message} onChange={set('message')} />
          </div>

          <div className="bg-cream-100 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm text-ink-800/70">Total estimé ({form.nombre_jours} jour{form.nombre_jours > 1 ? 's' : ''})</span>
            <span className="text-xl font-extrabold text-copper-700">{formatFCFA(total)}</span>
          </div>

          <button disabled={sending} className="btn-primary w-full disabled:opacity-60">
            {sending ? 'Envoi en cours…' : 'Envoyer la demande'}
          </button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}
