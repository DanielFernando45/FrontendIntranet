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
    <main className="h-screen w-screen flex items-center justify-center overflow-hidden fondo_login px-2 mn:px-3">
      
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* 🔹 DESCRIPCIÓN (lado izquierdo) */}
        <section className="text-white space-y-4 max-md:hidden">
          <h1 className="text-4xl font-bold leading-tight text-center">
            Intranet de Alejandría Centro de Investigación
          </h1>

          <p className="text-white/90 text-lg leading-relaxed text-center">
            Plataforma interna para clientes de Alejandría Centro de Investigación
            donde se gestionan proyectos, recursos y la comunicación profesional.
          </p>
        </section>

        {/* 🔹 FORMULARIO DE LOGIN (lado derecho) */}
        <section className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-[325px] mn:w-[350px] sm:w-[380px] bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg flex flex-col items-center gap-6 border border-white/20"
          >
            {/* Logo */}
            <img src={LogoBlanco} alt="Logo Alejandría" className="w-40" />

            {/* INPUTS */}
            <div className="flex flex-col w-full gap-5">

              {/* Usuario */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm text-white mb-1"
                >
                  Nombre de Usuario
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-3">
                    <img src={LogoUsuario} alt="user" />
                  </span>
                  <input
                    id="username"
                    type="text"
                    placeholder="Ingrese su correo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm text-white mb-1"
                >
                  Contraseña
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-3">
                    <img src={Candado} alt="password" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full h-11 text-[#1C1C34] bg-white font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                INICIAR SESIÓN
              </button>

              {/* Recuperar contraseña */}
              <a
                href="/recuperarContraseña"
                className="text-white text-sm text-right hover:underline"
              >
                ¿Olvidó su contraseña?
              </a>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
