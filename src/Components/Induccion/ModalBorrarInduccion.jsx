import { useMutation } from "@tanstack/react-query";
import { induccionesService } from "../../services/induccionesService";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ModalBorrarInduccion = ({ id, openModalDelete, setOpenModalDelete }) => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (id) => induccionesService.borrarInduccionById(id),
    onSuccess: () => {
      toast.success(" Inducción eliminada correctamente");
      setOpenModalDelete(false);
      queryClient.invalidateQueries(["induccionesByIdAsesoramiento"]);
    },
    onError: (error) => {
      toast.error("❌ Error al eliminar la inducción");
      console.error(error);
    },
  });

  const handleDelete = () => {
    mutate.mutateAsync(id);
  };

  return (
    <div
      onClick={() => {
        setOpenModalDelete(false);
      }}
      className={`${
        openModalDelete ? "block" : "hidden"
      } fixed inset-0 bg-black bg-opacity-50 z-[99] flex items-center justify-center`}
    >
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        className="space-y-4 p-6 rounded-lg w-[90%] max-w-[600px] bg-[#f8f7f7]"
      >
        <h2 className="text-2xl font-semibold text-center">
          ¿Estás seguro de borrar el video?
        </h2>
        <div className="flex gap-4 justify-center">
          <button
            disabled={mutate.isPending}
            className={`${
              mutate.isPending && "opacity-50"
            } outline-none bg-[#E14434] text-white py-2 px-4 rounded-md`}
            onClick={handleDelete}
          >
            Borrar
          </button>
          <button
            disabled={mutate.isPending}
            className={`${
              mutate.isPending && "opacity-50"
            } outline-none bg-gray-400 text-white py-2 px-4 rounded-md`}
            onClick={() => setOpenModalDelete(false)}
          >
            Cancelar
          </button>
        </div>
        {mutate.isPending && (
          <div className="flex justify-center w-full" role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 
                100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 
                50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 
                38.4038 97.8624 35.9116 97.0079 
                33.5539C95.2932 28.8227 92.871 
                24.3692 89.8167 20.348C85.8452 
                15.1192 80.8826 10.7238 75.2124 
                7.41289C69.5422 4.10194 63.2754 
                1.94025 56.7698 1.05124C51.7666 
                0.367541 46.6976 0.446843 41.7345 
                1.27873C39.2613 1.69328 37.813 
                4.19778 38.4501 6.62326C39.0873 
                9.04874 41.5694 10.4717 44.0505 
                10.1071C47.8511 9.54855 51.7191 
                9.52689 55.5402 10.0491C60.8642 
                10.7766 65.9928 12.5457 70.6331 
                15.2552C75.2735 17.9648 79.3347 
                21.5619 82.5849 25.841C84.9175 
                28.9121 86.7997 32.2913 88.1811 
                35.8758C89.083 38.2158 91.5421 
                39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalBorrarInduccion;
