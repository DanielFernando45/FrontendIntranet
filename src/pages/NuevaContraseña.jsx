import { useState } from "react";
import Candado from "../assets/icons/Login/passlock.svg";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { mailService } from "../services/mailService";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const NuevaContraseña = () => {
  const token = useParams().token;
  const navigate = useNavigate();

  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mutate = useMutation({
    mutationFn: (data) => mailService.changePassword(data),
    onSuccess: (message) => {
      toast.success(message || "Contraseña actualizada correctamente.");
      setTimeout(() => navigate("/"), 2500);
    },
    onError: (error) => {
      toast.error(
        error.message || "Error al cambiar la contraseña. Intenta más tarde."
      );
    },
  });

  const handleChangePassword = () => {
    if (nuevaContrasenia !== confirmarContrasenia) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (nuevaContrasenia.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    mutate.mutate({ newPassword: nuevaContrasenia, token });
  };

  return (
    <main className="min-h-screen w-screen flex items-center justify-center fondo_login text-white px-4 py-10 sm:py-0">
      <div className="flex flex-col gap-10 sm:gap-[52px] w-full max-w-[531px] bg-transparent sm:bg-transparent rounded-lg sm:rounded-none">
        <h1 className="text-[28px] sm:text-[35px] text-center font-semibold">
          CAMBIAR LA CONTRASEÑA
        </h1>

        {/* NUEVA CONTRASEÑA */}
        <div className="flex flex-col gap-2">
          <p className="text-[18px] sm:text-[20px]">Nueva Contraseña</p>
          <div className="relative border-white h-[50px] sm:h-[55px] border-[2px] sm:border-[3px] border-xy- rounded-md w-full flex items-center bg-transparent">
            {/* Icono candado */}
            <img
              src={Candado}
              alt="candado"
              className="absolute left-3 w-[20px] sm:w-[22px] opacity-90"
            />

            {/* Input */}
            <input
              onChange={(event) => setNuevaContrasenia(event.target.value)}
              value={nuevaContrasenia}
              type={showPassword ? "text" : "password"}
              className="text-[16px] sm:text-md outline-none bg-transparent w-full pl-[40px] pr-[40px]"
              placeholder="Ingrese nueva contraseña"
            />

            {/* Botón ojo */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-300" />
              ) : (
                <Eye className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* CONFIRMAR CONTRASEÑA */}
        <div className="flex flex-col gap-2">
          <p className="text-[18px] sm:text-[20px]">Confirmar Contraseña</p>
          <div className="relative border-white h-[50px] sm:h-[55px] border-[2px] sm:border-[3px] border-xy- rounded-md w-full flex items-center bg-transparent">
            {/* Icono candado */}
            <img
              src={Candado}
              alt="candado"
              className="absolute left-3 w-[20px] sm:w-[22px] opacity-90"
            />

            {/* Input */}
            <input
              onChange={(event) => setConfirmarContrasenia(event.target.value)}
              value={confirmarContrasenia}
              type={showConfirmPassword ? "text" : "password"}
              className="text-[16px] sm:text-md outline-none bg-transparent w-full pl-[40px] pr-[40px]"
              placeholder="Confirme su contraseña"
            />

            {/* Botón ojo */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-300" />
              ) : (
                <Eye className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Recomendación */}
        <p className="text-[16px] sm:text-[18px] font-normal text-center leading-6 px-2">
          Se recomienda incluir letras mayúsculas y minúsculas, caracteres
          especiales y números.
        </p>

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-[45px] mt-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-medium text-black w-full sm:w-[168px] h-[50px] sm:h-[55px] flex justify-center items-center bg-white rounded-md hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleChangePassword}
            disabled={mutate.isPending}
            className={`font-medium w-full sm:w-[168px] h-[50px] sm:h-[55px] flex justify-center items-center rounded-md transition-all ${
              mutate.isPending
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#16162A] hover:bg-[#1d1d38]"
            }`}
          >
            {mutate.isPending ? "Actualizando..." : "Cambiar"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default NuevaContraseña;
