import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoBlanco from "../assets/icons/Login/LogoAlejandria.svg";
import LogoUsuario from "../assets/icons/Login/user.svg";
import Candado from "../assets/icons/Login/passlock.svg";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/auth/authSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_PORT_ENV}/auth/login`,
        { username, password }
      );

      const { access_token, datos_usuario } = res.data;
      dispatch(loginSuccess({ datos_usuario, access_token }));

      switch (datos_usuario.role.nombre) {
        case "admin":
          navigate("/admin/gestionar-usuarios");
          break;
        case "asesor":
          navigate("/asesor/home");
          break;
        case "estudiante":
          navigate("/estudiante/home");
          break;
        case "jefe_operaciones":
          navigate("/jefe-operaciones/gestionar-usuarios");
          break;
        case "supervisor":
          navigate("/supervisor/asignaciones");
          break;
        case "contrato_pago":
          navigate("/cont-pago/contratos");
          break;
        case "marketing":
          navigate("/marketing/ConfigIntra");
          break;
        case "soporte":
          navigate("/soporte-ti");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrecta");
    }
  };

  return (
    <main className="h-screen w-screen flex items-center justify-center fondo_login overflow-hidden">
      <div className="w-full flex justify-center">
        <form
          className="flex w-[410px] px-[60px] flex-col justify-center items-center gap-[40px] bg-transparent"
          onSubmit={handleSubmit}
        >
          {/* Logo */}
          <img src={LogoBlanco} alt="Logo Alejandría" />

          {/* Inputs */}
          <div className="flex flex-col justify-center items-center gap-[25px] w-full bg-transparent">
            {/* Usuario */}
            <div className="w-full">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white mb-1"
              >
                Nombre de Usuario
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3">
                  <img src={LogoUsuario} alt="" />
                </span>
                <input
                  id="username"
                  type="text"
                  className="bg-transparent w-full pl-10 pr-4 py-3 text-white border border-white rounded-[10px] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Ingrese correo"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
             
            </div>

            {/* Contraseña */}
            <div className="w-full">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-1"
              >
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3">
                  <img src={Candado} alt="" />
                </span>
                <input
                  id="password"
                  type="password"
                  className="bg-transparent w-full pl-10 pr-4 py-3 text-white border border-white rounded-[10px] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            {/* Botón */}
            <button
              type="submit"
              className="w-full h-12 text-[#1C1C34] bg-white font-semibold rounded-md hover:opacity-90 transition"
            >
              INICIAR SESIÓN
            </button>

            {/* Recuperar contraseña */}
            <a
              href="/recuperarContraseña"
              className="text-white text-right text-sm hover:underline"
            >
              ¿OLVIDÓ SU CONTRASEÑA?
            </a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
