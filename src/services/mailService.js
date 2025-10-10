import api from "./api";

const sendResetPasswordEmail = async (email) => {
  try {
    const response = await api.post("/mail/reset-password", { email });
    console.log("✅ Respuesta backend:", response.data);
    // Retorna el mensaje exacto del backend
    return response.data.message;
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    // Captura el mensaje exacto si existe
    const backendMessage =
      error.response?.data?.message ||
      "Error al enviar el correo de recuperación de contraseña.";
    // Lanza un error con el texto limpio
    throw new Error(backendMessage);
  }
};

const changePassword = async ({ newPassword, token }) => {
  try {
    console.log(
      "Enviando nueva contraseña para:",
      newPassword,
      "con token:",
      token
    );
    const response = await api.post("/mail/new-password", {
      newPassword,
      token,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response
        ? error.response.data
        : "Error al enviar el correo de recuperación de contraseña"
    );
  }
};

export const mailService = {
  sendResetPasswordEmail,
  changePassword,
};
