import { useMutation } from "@tanstack/react-query";
import { induccionesService } from "../../services/induccionesService";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const ModalSubirInduccion = ({
  openModal,
  setOpenModal,
  idSeleccionado,
  setIdSeleccionado,
}) => {
  const [capitulo, setCapitulo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [isUploading, setIsUploading] = useState(false); // 🚫 Bloquea clics múltiples

  const file = useRef();
  console.log("🪣 Bucket:", import.meta.env.VITE_BUCKET_NAME);

  const clearState = () => {
    setCapitulo("");
    setTitulo("");
    file.current.value = null;
    setOpenModal(false);
    setIdSeleccionado(null);
  };

  const mutate = useMutation({
    mutationFn: (body) => induccionesService.registrarInduccion(body),
    onSuccess: () => {
      toast.success("✅ Inducción registrada correctamente");
      setTimeout(() => clearState(), 2000);
    },
    onError: (error) => {
      console.error(error);
      toast.error("❌ Error al registrar la inducción");
    },
  });

  const handleSubmitInduccion = async () => {
    // 🚫 Evita múltiples clics
    if (isUploading || mutate.isLoading) return;

    if ([capitulo.trim(), titulo.trim()].some((f) => f === "")) {
      return toast.error("⚠️ Ingrese todos los campos requeridos");
    }

    const selectedFile = file.current?.files?.[0];
    if (!selectedFile) return toast.error("📂 Debe seleccionar un archivo");
    if (selectedFile.type !== "video/mp4")
      return toast.error("🎥 Solo se permiten archivos .mp4");

    setIsUploading(true); // 🔒 Bloquear todo el proceso
    const uploadToast = toast.loading("⏫ Solicitando URL de subida...");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/backblaze/upload-url?refresh=true`
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Error al obtener upload-url:", res.status, text);
        toast.dismiss(uploadToast);
        setIsUploading(false);
        return toast.error(
          `Error ${res.status}: No se pudo obtener la URL de subida`
        );
      }

      const { uploadUrl, authorizationToken } = await res.json();
      toast.dismiss(uploadToast);

      // 📁 Nombre del archivo con carpeta fija 'inducciones/'
      const timestamp = Date.now();
      const filename = `inducciones/${timestamp}-${selectedFile.name}`;

      // 🎯 Subida con XMLHttpRequest (barra de progreso)
      const progressToastId = toast.loading("🚀 Subiendo video... 0%");
      const startTime = performance.now();

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);

        xhr.setRequestHeader("Authorization", authorizationToken);
        xhr.setRequestHeader("X-Bz-File-Name", encodeURIComponent(filename));
        xhr.setRequestHeader("Content-Type", selectedFile.type);
        xhr.setRequestHeader("X-Bz-Content-Sha1", "do_not_verify");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            toast.loading(`🚀 Subiendo video... ${percent}%`, {
              id: progressToastId,
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(`❌ Error al subir: ${xhr.status}`);
          }
        };

        xhr.onerror = () => reject("❌ Error de red al subir el video");

        xhr.send(selectedFile);
      });

      // ⏱️ Terminar conteo de tiempo
      const endTime = performance.now();
      const durationSec = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`⏱️ Tiempo de subida del video: ${durationSec} segundos`);
      toast.success(`⏱️ Subida completada en ${durationSec} segundos`);
      toast.dismiss(progressToastId);
      toast.success("🎬 Video subido correctamente a Backblaze");

      // ✅ Verificación del bucket
      const bucketName = import.meta.env.VITE_BUCKET_NAME;
      if (!bucketName) {
        console.error("❌ VITE_BUCKET_NAME no está definido");
        setIsUploading(false);
        return toast.error("❌ Configuración del bucket inválida");
      }

      // 3️⃣ Construir la URL pública
      const videoUrl = `https://f004.backblazeb2.com/file/${bucketName}/${filename}`;
      console.log("✅ URL pública:", videoUrl);

      // 4️⃣ Enviar datos al backend
      toast.loading("🗂️ Guardando registro en base de datos...");
      await mutate.mutateAsync({
        titulo,
        capitulo,
        asesoramiento: String(idSeleccionado),
        url: videoUrl,
      });

      toast.dismiss();
      toast.success("✅ Inducción registrada correctamente");
      clearState();
    } catch (error) {
      toast.dismiss();
      console.error("💥 Error al subir inducción:", error);
      toast.error("❌ Ocurrió un error durante la subida del video");
      setIsUploading(false);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <>
      <div
        onClick={() => setOpenModal(false)}
        className={`${
          openModal ? "flex" : "hidden"
        } fixed inset-0 bg-black/50 z-[99] items-center justify-center px-3 sm:px-0`}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="bg-[#f8f7f7] w-full sm:w-[90%] max-w-[600px] rounded-lg p-5 sm:p-6 space-y-5 shadow-lg overflow-y-auto max-h-[90vh]"
        >
          {/* Título */}
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
            Agregar Inducción
          </h2>

          {/* Formulario */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Labels */}
            <div className="flex flex-col gap-3 sm:w-1/3 text-sm sm:text-base text-gray-700 font-medium">
              <label>Capítulo:</label>
              <label>Inducción:</label>
              <label>Archivo Video:</label>
            </div>

            {/* Inputs */}
            <div className="flex flex-1 flex-col gap-3 text-sm sm:text-base">
              <input
                value={capitulo}
                onChange={(e) => setCapitulo(e.target.value)}
                type="text"
                placeholder="Ingrese el capítulo"
                className="border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                type="text"
                placeholder="Ingrese el título"
                className="border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="border border-gray-300 rounded-md p-2 bg-white">
                <input
                  disabled={mutate.isPending}
                  type="file"
                  ref={file}
                  accept="video/mp4"
                  className="w-full text-gray-600 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-center">
            <button
              disabled={mutate.isPending}
              onClick={handleSubmitInduccion}
              className={`bg-[#007bff] text-white font-medium py-2 px-8 rounded-md transition-transform duration-200 hover:scale-105 ${
                mutate.isPending && "opacity-60 cursor-not-allowed"
              }`}
            >
              {mutate.isPending ? "Subiendo..." : "Subir Video"}
            </button>
          </div>

          {/* Spinner de carga */}
          {mutate.isPending && (
            <div
              className="flex justify-center items-center w-full pt-2"
              role="status"
            >
              <svg
                aria-hidden="true"
                className="w-7 h-7 sm:w-8 sm:h-8 text-gray-200 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 
                  50 100.591C22.3858 100.591 0 78.2051 
                  0 50.5908C0 22.9766 22.3858 0.59082 
                  50 0.59082C77.6142 0.59082 100 22.9766 
                  100 50.5908ZM9.08144 50.5908C9.08144 
                  73.1895 27.4013 91.5094 50 91.5094C72.5987 
                  91.5094 90.9186 73.1895 90.9186 
                  50.5908C90.9186 27.9921 72.5987 9.67226 
                  50 9.67226C27.4013 9.67226 9.08144 
                  27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 
                  97.8624 35.9116 97.0079 33.5539C95.2932 
                  28.8227 92.871 24.3692 89.8167 20.348C85.8452 
                  15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 
                  4.10194 63.2754 1.94025 56.7698 
                  1.05124C51.7666 0.367541 46.6976 
                  0.446843 41.7345 1.27873C39.2613 
                  1.69328 37.813 4.19778 38.4501 
                  6.62326C39.0873 9.04874 41.5694 
                  10.4717 44.0505 10.1071C47.8511 
                  9.54855 51.7191 9.52689 55.5402 
                  10.0491C60.8642 10.7766 65.9928 
                  12.5457 70.6331 15.2552C75.2735 
                  17.9648 79.3347 21.5619 82.5849 
                  25.841C84.9175 28.9121 86.7997 
                  32.2913 88.1811 35.8758C89.083 
                  38.2158 91.5421 39.6781 93.9676 
                  39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Cargando...</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalSubirInduccion;
