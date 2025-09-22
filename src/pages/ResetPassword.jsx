import React, { useState } from "react";
import email from "../assets/icons/mail.svg";
import { useMutation } from "@tanstack/react-query";
import { mailService } from "../services/mailService";

const ResetPassword = () => {
  const [emailInput, setEmailInput] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const mutate = useMutation({
    mutationFn: (email) => mailService.sendResetPasswordEmail(email),
  });

  const handleSendEmail = async () => {
    if (
      !emailInput ||
      !/\S+@\S+\.\S+/.test(emailInput) ||
      emailInput.length == 0
    )
      return alert("Por favor, ingrese un correo electrónico válido.");

    mutate.mutate(emailInput);
    setEmailInput("");
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen w-screen flex  items-center justify-center fondo_login text-white">
      <div className="flex flex-col gap-[52px] w-[531px] h-full">
        <h1 className="text-[40px]">Recuperacion Contraseña</h1>
        <p className="text-[20px]">Digite su correo:</p>
        <div className="border-white h-[55px]  border-[3px] border-xy- px-[15px] py-2 rounded-md w-full flex justify-between">
          <input
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
            type="text"
            className="bg-transparent w-full outline-none"
          />{" "}
          <img src={email} alt="" />
        </div>
        <p className="text-[18px]">
          Se le enviara una url a su correo para confirmar el cambio de
          contraseña si no le llega presione enviar de nuevo luego de 3 minutos.
        </p>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSendEmail}
            className="w-[168px] h-[55px] flex justify-center items-center bg-[#16162A] rounded-md"
          >
            ENVIAR
          </button>
        </div>
        {showMessage && (
          <p className="text-center">Se ha enviado un correo de recuperación</p>
        )}
      </div>
    </main>
  );
};

export default ResetPassword;
