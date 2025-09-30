import React, { useEffect, useState } from "react";
import LayoutApp from "../../../layout/LayoutApp";

const CambiarContraseña = () => {
  const [userId, setUserId] = useState(null);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // 👁 Estados para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const cliente = localStorage.getItem("user");
    if (cliente) {
      const user = JSON.parse(cliente);
      setUserId(user.id_usuario); // 👈 usamos id_usuario
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Validaciones de frontend
  const validarCampos = () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return "Todos los campos son obligatorios.";
    }

    if (newPassword.length < 6 || newPassword.length > 30) {
      return "La nueva contraseña debe tener entre 6 y 30 caracteres.";
    }

    if (confirmPassword.length < 6 || confirmPassword.length > 30) {
      return "La confirmación debe tener entre 6 y 30 caracteres.";
    }

    if (newPassword !== confirmPassword) {
      return "Las nuevas contraseñas no coinciden.";
    }

    if (oldPassword === newPassword) {
      return "La nueva contraseña no puede ser igual a la anterior.";
    }

    return null; // ✅ todo OK
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorValidacion = validarCampos();
    if (errorValidacion) {
      alert(errorValidacion);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/auth/change-password/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
            repeatPassword: passwords.confirmPassword, // ✅ enviado igual que en el backend
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cambiar la contraseña");
      }

      alert("¡Contraseña cambiada exitosamente!");
      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert(error.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Toggle para mostrar/ocultar
  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <LayoutApp>
      {/* Contenedor de pantalla completa */}
      <main className="flex justify-center items-center h-screen ">
        {/* Formulario centrado con scroll interno si es necesario */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto 
                     bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200"
        >
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Cambiar Contraseña
          </h1>

          {/* Contraseña actual */}
          <div className="mb-5 relative">
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Contraseña Actual
            </label>
            <input
              type={showPassword.old ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-2"
              required
            />
            <button
              type="button"
              onClick={() => togglePassword("old")}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword.old ? "🙈" : "👁"}
            </button>
          </div>

          {/* Nueva contraseña */}
          <div className="mb-5 relative">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Nueva Contraseña
            </label>
            <input
              type={showPassword.new ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-2 "
              required
            />
            <button
              type="button"
              onClick={() => togglePassword("new")}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword.new ? "🙈" : "👁"}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-6 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Confirmar Contraseña
            </label>
            <input
              type={showPassword.confirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-2 "
              required
            />
            <button
              type="button"
              onClick={() => togglePassword("confirm")}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword.confirm ? "🙈" : "👁"}
            </button>
          </div>

          {/* Botones */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              className="w-1/2 py-2 px-4 rounded-lg border border-gray-400 text-gray-700 
                         hover:bg-gray-100 transition-colors"
              onClick={() =>
                setPasswords({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                })
              }
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 px-4 rounded-lg text-white font-medium 
                         bg-gradient-to-r from-[#0CB2D6] to-[#1C1C34] 
                         hover:opacity-90 focus:ring-2 focus:ring-[#0CB2D6] transition-colors"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Cambiar"}
            </button>
          </div>
        </form>
      </main>
    </LayoutApp>
  );
};

export default CambiarContraseña;
