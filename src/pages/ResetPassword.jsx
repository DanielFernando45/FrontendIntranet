import React, { useState } from "react";
import email from "../assets/icons/mail.svg";
import { useMutation } from "@tanstack/react-query";
import { mailService } from "../services/mailService";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [emailInput, setEmailInput] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const mutate = useMutation({
    mutationFn: (email) => mailService.sendResetPasswordEmail(email),

    // ✅ Muestra el mensaje del backend si todo salió bien
    onSuccess: (message) => {
      toast.success(message);
      setEmailInput("");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    },

    // ✅ Captura el mensaje exacto del backend en caso de error
    onError: (error) => {
      console.error("❌ Error desde el backend:", error);
      toast.error(
        error.message || "No se pudo enviar el correo, inténtalo más tarde."
      );
    },
  });

  const handleSendEmail = async () => {
    if (!emailInput || !/\S+@\S+\.\S+/.test(emailInput))
      return toast.error("Por favor, ingrese un correo electrónico válido.");

    mutate.mutate(emailInput);
  };

  return (
    <main className="min-h-screen w-screen flex items-center justify-center fondo_login text-white">
      <div className="flex flex-col gap-[52px] w-[531px] h-full">
        <h1 className="text-[40px]">Recuperación de Contraseña</h1>

        <p className="text-[20px]">Digite su correo:</p>

        <div className="border-white h-[55px] border-[3px] border-xy- px-[15px] py-2 rounded-md w-full flex justify-between">
          <input
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
            type="text"
            className="bg-transparent w-full outline-none"
          />
          <img src={email} alt="icono correo" />
        </div>

        <p className="text-[18px]">
          Se le enviará una URL a su correo para confirmar el cambio de
          contraseña. Si no le llega, presione enviar de nuevo luego de 3
          minutos.
        </p>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={mutate.isPending}
            className="w-[168px] h-[55px] flex justify-center items-center bg-[#16162A] rounded-md hover:bg-[#1d1d38] transition-colors"
          >
            {mutate.isPending ? "ENVIANDO..." : "ENVIAR"}
          </button>
        </div>

        {showMessage && (
          <p className="text-center text-green-400">
            Se ha enviado un correo de recuperación
          </p>
        )}
      </div>
    </main>
  );
};

export default ResetPassword;
