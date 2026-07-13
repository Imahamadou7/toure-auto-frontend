import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/client';
import ImageUploader from '../../components/ImageUploader';
import { rawPhotosOf } from '../../utils/format';

const CARBURANTS = ['Essence', 'Diesel', 'Hybride', 'Electrique'];

const currentYear = new Date().getFullYear();

const ANNEES = Array.from(
  { length: 30 },
  (_, i) => currentYear - i
);

export default function VehiculeForm({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const base =
    type === 'vente'
      ? '/admin/ventes'
      : '/admin/locations';

  const [photos, setPhotos] = useState([]);

  const [form, setForm] = useState({
    nom: '',
    prix: '',
    annee: currentYear,
    carburant: 'Essence',
    description: '',
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    let mounted = true;

    const loadVehicle = async () => {
      if (!isEdit) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/vehicules/${id}`);

        if (!mounted) return;

        setForm({
          nom: data?.nom || '',
          prix: data?.prix || '',
          annee: data?.annee || currentYear,
          carburant: data?.carburant || 'Essence',
          description: data?.description || '',
        });

        setPhotos(rawPhotosOf(data));
      } catch (err) {
        toast.error('Impossible de charger le véhicule');
        navigate(base, { replace: true });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadVehicle();

    return () => {
      mounted = false;
    };
  }, [id, isEdit, navigate, base]);

  const setField = (key) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (saving) return;

    const nom = form.nom.trim();

    if (!nom) {
      return toast.error('Nom du véhicule obligatoire');
    }

    const prix = Number(form.prix);

    if (!Number.isFinite(prix) || prix <= 0) {
      return toast.error('Prix invalide');
    }

    if (photos.length > 5) {
      return toast.error('Maximum 5 photos');
    }

    setSaving(true);

    try {
      const payload = {
        type,
        nom,
        prix,
        description: form.description?.trim() || '',
        photo1: photos[0] || null,
        photo2: photos[1] || null,
        photo3: photos[2] || null,
        photo4: photos[3] || null,
        photo5: photos[4] || null,
      };

      if (type === 'vente') {
        payload.annee = Number(form.annee);
        payload.carburant = form.carburant;
      }

      if (isEdit) {
        await api.put(`/vehicules/${id}`, payload);
      } else {
        await api.post('/vehicules', payload);
      }

      toast.success(
        isEdit
          ? 'Véhicule mis à jour'
          : 'Véhicule ajouté'
      );

      navigate(base, { replace: true });
    } catch (err) {
      toast.error(
        err?.response?.data?.error ||
          err?.message ||
          'Erreur serveur'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        Chargement...
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="card p-6 space-y-5 max-w-3xl"
    >
      <div>
        <h1 className="text-xl font-extrabold text-ink-900">
          {isEdit ? 'Modifier' : 'Ajouter'} un véhicule —{' '}
          {type === 'vente'
            ? 'Vente'
            : 'Location'}
        </h1>
      </div>

      <div>
        <label className="label">
          Nom du véhicule *
        </label>

        <input
          className="input"
          value={form.nom}
          onChange={setField('nom')}
          maxLength={150}
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">
            {type === 'vente'
              ? 'Prix de vente (FCFA) *'
              : 'Prix par jour (FCFA) *'}
          </label>

          <input
            type="number"
            min="0"
            step="1"
            className="input"
            value={form.prix}
            onChange={setField('prix')}
            required
          />
        </div>

        {type === 'vente' && (
          <>
            <div>
              <label className="label">
                Année
              </label>

              <select
                className="input"
                value={form.annee}
                onChange={setField('annee')}
              >
                {ANNEES.map((a) => (
                  <option
                    key={a}
                    value={a}
                  >
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="label">
                Carburant
              </label>

              <select
                className="input"
                value={form.carburant}
                onChange={setField('carburant')}
              >
                {CARBURANTS.map((c) => (
                  <option
                    key={c}
                    value={c}
                  >
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      <div>
        <label className="label">
          Détails du véhicule
        </label>

        <textarea
          rows={5}
          className="input"
          value={form.description}
          onChange={setField('description')}
          maxLength={5000}
        />
      </div>

      <div>
        <label className="label">
          Photos (jusqu'à 5)
        </label>

        <ImageUploader
          photos={photos}
          onChange={setPhotos}
          max={5}
        />
      </div>

      <div className="flex gap-3">
        <button
          disabled={saving}
          className="btn-primary disabled:opacity-60"
        >
          {saving
            ? 'Enregistrement...'
            : isEdit
            ? 'Mettre à jour'
            : 'Publier'}
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(base)
          }
          className="btn-ghost"
          disabled={saving}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}