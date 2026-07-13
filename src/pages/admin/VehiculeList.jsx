import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { formatFCFA, mediaUrl } from '../../utils/format';
import { FiPlus, FiEdit2, FiTrash2, FiShare2 } from 'react-icons/fi';
import ShareModal from '../../components/ShareModal';

const STATUT_LABELS = {
  disponible: { label: 'Disponible', cls: 'bg-green-100 text-green-700' },
  vendu: { label: 'Vendu', cls: 'bg-gray-100 text-gray-500' },
  loue: { label: 'Loué', cls: 'bg-blue-100 text-blue-700' },
};

export default function VehiculeList({ type, titre, base }) {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(null);


  const load = () => {

    setLoading(true);

    api.get('/vehicules', {
      params: {
        type,
        all: 1
      }
    })

    .then(({ data }) => setList(data))

    .catch(() => toast.error('Chargement impossible'))

    .finally(() => setLoading(false));

  };


  useEffect(() => {

    load();

  }, [type]);



  const remove = async (id) => {

    if (!confirm(
      'Supprimer définitivement ce véhicule ? Préférez "Vendu" pour le conserver.'
    )) return;


    try {

      await api.delete(`/vehicules/${id}`);

      toast.success('Supprimé');

      load();

    } catch {

      toast.error('Erreur');

    }

  };



  const changeStatut = async (id, statut) => {

    try {

      await api.put(`/vehicules/${id}`, {
        statut
      });

      toast.success('Statut mis à jour');

      load();

    } catch {

      toast.error('Erreur mise à jour');

    }

  };



  return (

    <>

      <div className="space-y-4">


        <div className="flex items-center justify-between gap-3">

          <h1 className="text-xl md:text-2xl font-extrabold text-ink-900">
            {titre}
          </h1>


          <Link
            to={`${base}/nouveau`}
            className="btn-primary flex items-center gap-2"
          >

            <FiPlus />

            Ajouter

          </Link>


        </div>





        {/* ================= TABLEAU DESKTOP ================= */}

        <div className="hidden md:block card overflow-x-auto">

          <table className="w-full text-sm">


            <thead className="text-left text-ink-800/60 bg-cream-50">

              <tr>

                <th className="p-3">
                  Photo
                </th>

                <th>
                  Nom
                </th>

                <th>
                  Vues
                </th>


                {type === 'vente' && (
                  <>
                    <th>
                      Année
                    </th>

                    <th>
                      Carburant
                    </th>
                  </>
                )}


                <th>
                  Prix
                </th>


                <th>
                  Statut
                </th>


                <th>
                  Actions
                </th>


              </tr>

            </thead>



            <tbody>


              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="p-6 text-center"
                  >
                    Chargement…
                  </td>

                </tr>


              ) : list.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="p-6 text-center"
                  >
                    Aucun véhicule.
                  </td>

                </tr>


              ) : (

                list.map(v => {

                  const st =
                    STATUT_LABELS[v.statut] ||
                    STATUT_LABELS.disponible;


                  return (

                    <tr
                      key={v.id}
                      className="border-t border-cream-200 hover:bg-cream-50"
                    >


                      <td className="p-3">

                        <img
                          src={mediaUrl(v.photo1)}
                          alt=""
                          className="w-14 h-10 object-cover rounded"
                        />

                      </td>



                      <td className="font-medium">
                        {v.nom}
                      </td>



                      <td className="text-xs text-center">
                        {v.vues ?? 0} 👁
                      </td>




                      {type === 'vente' && (

                        <>
                          <td>
                            {v.annee || '—'}
                          </td>

                          <td>
                            {v.carburant || '—'}
                          </td>
                        </>

                      )}




                      <td className="font-semibold text-copper-700">
                        {formatFCFA(v.prix)}
                      </td>



                      <td>


                        <select
                          value={v.statut || 'disponible'}
                          onChange={(e) =>
                            changeStatut(v.id, e.target.value)
                          }
                          className={`text-xs px-2 py-1 rounded-full font-semibold border-0 ${st.cls}`}
                        >

                          <option value="disponible">
                            Disponible
                          </option>


                          {type === 'vente' ? (

                            <option value="vendu">
                              Vendu
                            </option>

                          ) : (

                            <option value="loue">
                              Loué
                            </option>

                          )}


                        </select>


                      </td>




                      <td className="text-right whitespace-nowrap">


                        <button
                          onClick={() => setSharing(v)}
                          className="p-2 text-copper-600"
                        >
                          <FiShare2 />
                        </button>



                        <Link
                          to={`${base}/${v.id}`}
                          className="p-2 inline-block"
                        >
                          <FiEdit2 />
                        </Link>



                        <button
                          onClick={() => remove(v.id)}
                          className="p-2 text-red-600"
                        >
                          <FiTrash2 />
                        </button>


                      </td>


                    </tr>

                  );

                })

              )}


            </tbody>


          </table>


        </div>





        {/* ================= MOBILE ================= */}


        <div className="md:hidden space-y-4">


          {loading ? (

            <div className="card p-5 text-center">
              Chargement…
            </div>


          ) : list.length === 0 ? (

            <div className="card p-5 text-center">
              Aucun véhicule.
            </div>


          ) : (


            list.map(v => {


              const st =
                STATUT_LABELS[v.statut] ||
                STATUT_LABELS.disponible;


              return (


                <div
                  key={v.id}
                  className="card p-4 space-y-4"
                >


                  <div className="flex gap-3">


                    <img
                      src={mediaUrl(v.photo1)}
                      alt=""
                      className="w-24 h-20 object-cover rounded"
                    />



                    <div>

                      <h3 className="font-bold">
                        {v.nom}
                      </h3>


                      <p className="font-semibold text-copper-700">
                        {formatFCFA(v.prix)}
                      </p>


                      <p className="text-xs text-ink-800/60">
                        {v.vues ?? 0} 👁 vues
                      </p>


                    </div>


                  </div>




                  <select
                    value={v.statut || 'disponible'}
                    onChange={(e) =>
                      changeStatut(v.id, e.target.value)
                    }
                    className={`w-full px-3 py-3 rounded-lg font-semibold ${st.cls}`}
                  >

                    <option value="disponible">
                      Disponible
                    </option>


                    {type === 'vente' ? (

                      <option value="vendu">
                        Vendu
                      </option>

                    ) : (

                      <option value="loue">
                        Loué
                      </option>

                    )}


                  </select>





                  <div className="grid grid-cols-3 gap-2">


                    <Link
                      to={`${base}/${v.id}`}
                      className="flex flex-col items-center justify-center py-3 rounded-lg bg-gray-100 text-xs"
                    >

                      <FiEdit2 />

                      Modifier

                    </Link>




                    <button
                      onClick={() => setSharing(v)}
                      className="flex flex-col items-center justify-center py-3 rounded-lg bg-copper-50 text-xs"
                    >

                      <FiShare2 />

                      Partager

                    </button>





                    <button
                      onClick={() => remove(v.id)}
                      className="flex flex-col items-center justify-center py-3 rounded-lg bg-red-50 text-red-600 text-xs"
                    >

                      <FiTrash2 />

                      Supprimer

                    </button>


                  </div>


                </div>


              );


            })


          )}


        </div>



      </div>





      {sharing && (

        <ShareModal
          vehicule={sharing}
          onClose={() => setSharing(null)}
        />

      )}



    </>

  );

}