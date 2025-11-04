import EstudianteSidebar from "../Components/Sidebar/EstudianteSidebar";
import AsesorSidebar from "../Components/Sidebar/AsesorSidebar";
import JefeOperSidebar from "../Components/Sidebar/JefeOperSidebar";
import SupervisorSidebar from "../Components/Sidebar/SupervisorSidebar";
import MarketingSidebar from "../Components/Sidebar/MarketingSidebar";
import ContPagoSidebar from "../Components/Sidebar/ContPagoSidebar";
import SoporteSidebar from "../Components/Sidebar/SoporteSidebar";
import Navbar from "../Components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuth } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirigir
import { jwtDecode } from "jwt-decode"; // Corregir la importación aquí

const LayoutApp = ({ children }) => {
  const user = useSelector((state) => state.auth.user); // Estado global del usuario
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Usar useNavigate para la redirección

  const [timeRemaining, setTimeRemaining] = useState(null); // Estado para almacenar el tiempo restante

  // Función para calcular el tiempo restante hasta la expiración del token
  const calculateTimeRemaining = (expirationTime) => {
    const currentTime = Date.now();
    const timeLeft = expirationTime - currentTime;
    return timeLeft;
  };

  // Función para formatear el tiempo restante en minutos y segundos
  const formatTime = (timeInMillis) => {
    if (timeInMillis === null) return "Cargando...";

    const seconds = Math.floor((timeInMillis / 1000) % 60);
    const minutes = Math.floor((timeInMillis / (1000 * 60)) % 60);
    const hours = Math.floor((timeInMillis / (1000 * 60 * 60)) % 24);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Verificar la validez del token al cargar el componente
  useEffect(() => {
    dispatch(checkAuth()); // Llama a checkAuth al montar el componente

    // Si el token no es válido, redirigir al login
    if (!user) {
      navigate("/login"); // Redirige a la página de login
    }

    // Obtener el token y calcular el tiempo restante
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token); // Decodificamos el JWT
      const expirationTime = decodedToken.exp * 1000; // `exp` en segundos, lo convertimos a milisegundos
      const timeLeft = calculateTimeRemaining(expirationTime); // Calculamos el tiempo restante

      // Si el tiempo restante es mayor que cero, iniciamos un cronómetro
      if (timeLeft > 0) {
        setTimeRemaining(timeLeft);

        const timer = setInterval(() => {
          setTimeRemaining((prevTime) => {
            if (prevTime <= 1000) {
              clearInterval(timer); // Detener el cronómetro cuando el tiempo se acaba
              return 0;
            }
            return prevTime - 1000; // Reducir el tiempo restante cada segundo
          });
        }, 1000);

        return () => clearInterval(timer); // Limpiar el intervalo cuando el componente se desmonte
      } else {
        setTimeRemaining(0); // Si el token ya expiró, establecer el tiempo restante a 0
        navigate("/login"); // Redirigir al login si el token expiró
      }
    }
  }, [dispatch, user, navigate]);

  // Si no hay usuario o no está autenticado, mostramos el mensaje de "Cargando datos..."
  if (!user) {
    return (
      <div className="text-center p-10">Cargando datos del usuario...</div>
    );
  }

  // Función que renderiza el sidebar dependiendo del rol del usuario
  const renderSidebar = () => {
    switch (user.role.nombre) {
      case "estudiante":
        return <EstudianteSidebar />;
      case "asesor":
        return <AsesorSidebar />;
      case "jefe_operaciones":
        return <JefeOperSidebar />;
      case "supervisor":
        return <SupervisorSidebar />;
      case "contrato_pago":
        return <ContPagoSidebar />;
      case "marketing":
        return <MarketingSidebar />;
      case "soporte":
        return <SoporteSidebar />;
      default:
        return null; // Si no se encuentra un rol, no renderizamos nada
    }
  };

  return (
    <div className="layout-container">
      {/* Mostrar cronómetro de expiración */}
      <div className="text-center p-5">
        <p>
          Tiempo restante para la expiración del token:{" "}
          {formatTime(timeRemaining)}
        </p>
      </div>

      {/* Renderiza el Sidebar dependiendo del rol */}
      {renderSidebar()}
      <Navbar user={user} />
      <div className="mt-[50px] sm:mt-[65px] md:mt-[100px] p-4 md:p-4 xl:ml-[100px] xl:p-1">
        {/* Contenido principal */}
        {children}
      </div>
    </div>
  );
};

export default LayoutApp;
