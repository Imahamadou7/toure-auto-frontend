import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../api/client';
import { sendContactEmail } from '../utils/emailjs';
import { useCompany } from '../contexts/CompanyContext';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';

export default function Contact() {
  const { company } = useCompany();
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', message: '' });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) {
      return toast.error('Veuillez remplir tous les champs obligatoires.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return toast.error('Email invalide.');
    }
    setSending(true);
    try {
      await api.post('/messages', form);
      sendContactEmail(form).catch((err) => console.error('[emailjs] envoi échoué :', err));
      toast.success('Message envoyé ! Nous vous répondrons rapidement.');
      setForm({ nom: '', email: '', telephone: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur d'envoi. Réessayez plus tard.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900">Contactez-nous</h1>
        <p className="text-ink-800/60 mt-2 max-w-2xl mx-auto">{company.description}</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <h2 className="font-bold text-ink-900 text-lg mb-4">{company.nom}</h2>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-3"><FiPhone className="mt-0.5 text-copper-600"/>
                <span><b>Téléphone principal :</b><br/>{company.telephone}</span></p>
              <p className="flex items-start gap-3"><FiPhone className="mt-0.5 text-copper-600"/>
                <span><b>Téléphone secondaire :</b><br/>{company.telephone2}</span></p>
              <p className="flex items-start gap-3"><FiMail className="mt-0.5 text-copper-600"/>
                <span><b>Email :</b><br/>{company.email}</span></p>
              <p className="flex items-start gap-3"><FiMapPin className="mt-0.5 text-copper-600"/>
                <span><b>Adresse :</b><br/>{company.adresse}</span></p>
              <p className="flex items-start gap-3"><FiClock className="mt-0.5 text-copper-600"/>
                <span><b>Horaires :</b><br/>{company.horaires}</span></p>
            </div>
          </div>
        </motion.div>

        <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          onSubmit={submit} className="lg:col-span-3 card p-6 sm:p-8 space-y-4">
          <h2 className="font-bold text-ink-900 text-lg">Envoyez-nous un message</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nom complet *</label>
              <input className="input" value={form.nom} onChange={set('nom')} required />
            </div>
            <div>
              <label className="label">Email *</label>
              <input type="email" className="input" value={form.email} onChange={set('email')} required />
            </div>
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input className="input" value={form.telephone} onChange={set('telephone')} />
          </div>
          <div>
            <label className="label">Message *</label>
            <textarea rows={5} className="input" value={form.message} onChange={set('message')} required />
          </div>
          <button type="submit" disabled={sending} className="btn-primary w-full sm:w-auto disabled:opacity-60">
            {sending ? 'Envoi en cours…' : 'Envoyer le message'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
