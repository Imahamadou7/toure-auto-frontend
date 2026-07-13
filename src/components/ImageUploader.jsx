import { FiUpload, FiX, FiLoader } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

import api from '../api/client';
import { mediaUrl } from '../utils/format';


const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];


const ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.heic',
  '.heif',
];



async function compressImage(file) {

  // TEST : on garde l'image originale
  // Pas de compression pour diagnostiquer

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `Image trop grande (${(file.size / 1024 / 1024).toFixed(2)} Mo). Maximum 10 Mo`
    );
  }

  return file;
}





export default function ImageUploader({
  photos = [],
  onChange,
  max = 5,
}) {


  const [urlInput, setUrlInput] =
    useState('');


  const [uploading, setUploading] =
    useState(false);




  const items =
    Array.isArray(photos)
      ? photos.slice(0, max)
      : [];





  const handleFile = async (e) => {


    const files =
      Array.from(
        e.target.files || []
      );


    e.target.value = '';



    if (!files.length)
      return;




    const available =
      max - items.length;



    if (available <= 0) {

      toast.error(
        `Maximum ${max} photos autorisées`
      );

      return;

    }





    const toUpload =
      files.slice(
        0,
        available
      );



    setUploading(true);



    try {


      const uploaded = [];



      for (const originalFile of toUpload) {



        const extension =
          originalFile.name
            .toLowerCase()
            .substring(
              originalFile.name.lastIndexOf('.')
            );




        const validType =
          ALLOWED_TYPES.includes(
            originalFile.type
          )
          ||
          ALLOWED_EXTENSIONS.includes(
            extension
          );



        if (!validType) {


          toast.error(
            `${originalFile.name} : format non supporté`
          );


          continue;

        }




        try {


          const toastId =
            toast.loading(
              `Compression ${originalFile.name}...`
            );



          const file =
            await compressImage(
              originalFile
            );



          toast.dismiss(
            toastId
          );





          const formData =
            new FormData();



          formData.append(
            'photo',
            file
          );




          const { data } =
            await api.post(
              '/upload/photo',
              formData,
              {
                headers: {
                  'Content-Type':
                    'multipart/form-data'
                }
              }
            );





          if (!data?.url) {

            throw new Error(
              "URL image manquante"
            );

          }



          uploaded.push(
            data.url
          );



        } catch (err) {


          console.error(
            "ERREUR UPLOAD:",
            err
          );


          toast.error(
            err.message
            ||
            err?.response?.data?.error
            ||
            `Échec de l'envoi de ${originalFile.name}`
          );


        }



      }




      if (uploaded.length) {


        const uniquePhotos =
          [
            ...new Set([
              ...items,
              ...uploaded
            ])
          ];



        onChange(
          uniquePhotos
        );

      }



    } finally {


      setUploading(false);


    }


  };






  const addUrl = () => {


    const url =
      urlInput.trim();



    if (!url)
      return;




    if (items.length >= max) {

      toast.error(
        `Maximum ${max} photos`
      );

      return;

    }




    try {

      new URL(url);

    } catch {


      toast.error(
        'URL invalide'
      );

      return;

    }



    onChange([
      ...items,
      url
    ]);



    setUrlInput('');

  };






  const remove = (index) => {


    onChange(
      items.filter(
        (_, i) => i !== index
      )
    );


  };







  return (

    <div>


      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">



        {items.map((photo, index) => (


          <div
            key={`${photo}-${index}`}
            className="relative aspect-square rounded-lg overflow-hidden border"
          >


            <img
              src={mediaUrl(photo)}
              alt={`Photo véhicule ${index + 1}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />



            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
            >

              <FiX size={14} />

            </button>


          </div>


        ))}





        {items.length < max && (


          <label
            className={`aspect-square rounded-lg border-2 border-dashed grid place-items-center cursor-pointer ${uploading
              ? 'opacity-50 pointer-events-none'
              : ''
              }`}
          >



            <input
              type="file"
              multiple
              accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif"
              className="hidden"
              onChange={handleFile}
              disabled={uploading}
            />



            <div className="text-center">


              {
                uploading
                  ?
                  <FiLoader className="mx-auto animate-spin" />
                  :
                  <FiUpload className="mx-auto" />
              }



              <div className="text-xs mt-1">

                {
                  uploading
                    ?
                    'Traitement...'
                    :
                    'Ajouter'
                }

              </div>


            </div>


          </label>


        )}


      </div>





      {items.length < max && (


        <div className="mt-3 flex gap-2">


          <input
            value={urlInput}
            onChange={
              e => setUrlInput(e.target.value)
            }
            placeholder="...ou collez un lien d'image"
            className="input flex-1"
          />



          <button
            type="button"
            onClick={addUrl}
            className="btn-ghost"
          >

            Ajouter

          </button>



        </div>


      )}





      <p className="text-xs mt-2">

        {items.length}/{max} photos  JPG PNG WebP HEIC · Maximum 10 Mo

      </p>



    </div>

  );


}