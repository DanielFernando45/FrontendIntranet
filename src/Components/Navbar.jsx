// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";

import { logout } from "../store/auth/authSlice";

import logoaleja from "../assets/images/LogoAlejandriaSIN.png";
import flechaabajo from "../assets/icons/Flecha.svg";
import flechaarriba from "../assets/icons/arrow-up.svg";
import miperfil from "../assets/icons/miPerfil.svg";
import micontrato from "../assets/icons/miContrato.svg";
import miasesor from "../assets/icons/miAsesor.svg";
import candadoblack from "../assets/icons/candadoPass.svg";
import cerrarsesion from "../assets/icons/cerrarSesion.svg";

import {
  BellRing,
  BellOff,
  Circle,
  FileText,
  Paperclip,
  MessageCircle,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotificaciones] = useState([]);
  const [showNoti, setShowNoti] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleNoti = () => setShowNoti(!showNoti);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/");
  };

  // 🧠 Obtener usuario desde localStorage
  useEffect(() => {
    const usuario = localStorage.getItem("user");
    if (usuario) {
      try {
        const parsed = JSON.parse(usuario);
        setUser(parsed);
      } catch (err) {
        console.error("❌ Error al parsear usuario:", err);
      }
    }
  }, []);

  // ⚙️ Cargar notificaciones desde la API (REST)
  useEffect(() => {
    if (!user) return;

    const API_URL =
      import.meta.env.VITE_API_PORT_ENV || "http://localhost:3001";
    const idCliente = user.id_cliente;
    const idAsesor = user.id_asesor;

    const fetchNotificaciones = async () => {
      try {
        let res;
        if (idCliente) {
          // 🔸 Obtener notificaciones que el CLIENTE recibe (enviadas por el asesor)
          res = await axios.get(
            `${API_URL}/notificaciones/enviadas/cliente/${idCliente}`
          );
        } else if (idAsesor) {
          // 🔸 Obtener notificaciones que el ASESOR recibe (enviadas por el cliente)
          res = await axios.get(
            `${API_URL}/notificaciones/enviadas/asesor/${idAsesor}`
          );
        }

        if (res && Array.isArray(res.data)) {
          setNotificaciones(res.data);
        }
      } catch (error) {
        console.error("⚠️ Error al obtener notificaciones:", error);
      }
    };

    fetchNotificaciones();
  }, [user]);

  // ⚡ Conexión a WebSocket
  useEffect(() => {
    if (!user) return;

    const socket = io(
      import.meta.env.VITE_API_PORT_ENV || "http://localhost:3001",
      {
        transports: ["websocket"],
      }
    );

    // Detectar ID real del usuario
    const userId = user.id_cliente || user.id_asesor || user.id;
    if (!userId) {
      console.warn("⚠️ Usuario sin ID válido para socket:", user);
      return;
    }

    // Unirse a su canal personal
    const room = `user-${userId}`;
    socket.emit("joinUserRoom", { room });
    console.log(`✅ Usuario unido a sala: ${room}`);

    // Escuchar nuevas notificaciones
    socket.on("nuevaNotificacion", (noti) => {
      console.log("🔔 Nueva notificación recibida:", noti);
      if (
        noti.idUsuario === userId ||
        noti?.clienteReceptor?.id === userId ||
        noti?.asesorReceptor?.id === userId
      ) {
        setNotificaciones((prev) => [noti, ...prev]);
      }
    });

    return () => socket.disconnect();
  }, [user]);

  const marcarComoLeida = async (id) => {
    try {
      const API_URL =
        import.meta.env.VITE_API_PORT_ENV || "http://localhost:3001";
      await axios.patch(`${API_URL}/notificaciones/${id}/leida`);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    } catch (error) {
      console.error("⚠️ Error al marcar como leída:", error);
    }
  };
  const handleNavigation = (path) => {
    navigate(`/estudiante/${path}`);
    setIsMenuOpen(false);
  };
  // Agrupar notificaciones por fecha en formato "20 octubre 2025"
  const notificacionesAgrupadas = notifications
    .filter((n) => n.fecha_creacion && !isNaN(new Date(n.fecha_creacion))) // ✅ usar 'fecha_creacion'
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .reduce((acc, noti) => {
      const fecha = new Date(noti.fecha_creacion);
      const dia = fecha.getDate().toString().padStart(2, "0");
      const mes = fecha.toLocaleString("es-ES", { month: "long" }); // ej: octubre
      const año = fecha.getFullYear();
      const fechaClave = `${dia} ${mes} ${año}`;

      if (!acc[fechaClave]) acc[fechaClave] = [];
      acc[fechaClave].push(noti);
      return acc;
    }, {});

  return (
    <nav className="bg-white fixed top-0 left-[20px] w-full flex h-[56px] sm:h-[65px] md:h-[85px] px-7 md:px-10 md:pl-[65px] justify-between items-center shadow-md z-10">
      {/* Logo */}
      <img
        src={logoaleja}
        alt="Logo Aleja"
        className="w-24 h-16 object-cover sm:w-[170px]"
      />

      <div className="inline-flex items-center gap-4 relative">
        {/* 🔔 Campanita de notificaciones */}
        <div className="relative">
          <button onClick={toggleNoti} className="relative">
            <BellRing size={22} className="text-black" />
            {notifications.filter((n) => !n.leida).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold rounded-full px-[5px]">
                {notifications.filter((n) => !n.leida).length}
              </span>
            )}
          </button>

          {/* Dropdown de notificaciones */}
          {showNoti && (
            <>
              {/* Fondo semitransparente */}
              <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setShowNoti(false)}
              />

              {/* Panel lateral responsivo con animación */}
              <div
                className={`fixed top-0 right-0 h-full 
        w-[75%] sm:w-[400px] bg-white border-l shadow-lg 
        z-50 p-4 text-sm overflow-y-auto 
        transform transition-transform duration-300 ease-in-out 
        ${showNoti ? "translate-x-0" : "translate-x-full"}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold text-gray-800 text-lg">
                    Notificaciones
                  </p>
                  <button
                    onClick={() => setShowNoti(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Contenido */}
                {Object.keys(notificacionesAgrupadas).length > 0 ? (
                  Object.entries(notificacionesAgrupadas).map(
                    ([fecha, notisDelDia]) => (
                      <div key={fecha} className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2 border-b pb-1">
                          {fecha}
                        </p>

                        {notisDelDia.map((n, i) => (
                          <div
                            key={n.id || i}
                            onClick={() => marcarComoLeida(n.id)}
                            className={`flex items-start gap-2 p-2 border-b last:border-b-0 cursor-pointer rounded-md transition-all duration-200 ${
                              n.leida
                                ? "bg-gray-50 hover:bg-gray-100"
                                : "bg-white hover:bg-gray-50 border-l-4 border-blue-500"
                            }`}
                          >
                            {/* Estado de lectura */}
                            <div className="mt-1">
                              {n.leida ? (
                                <Circle size={8} className="text-gray-300" />
                              ) : (
                                <Circle size={8} className="text-blue-500" />
                              )}
                            </div>

                            {/* Icono */}
                            {n.tipo === "avance_actualizado" && (
                              <FileText
                                size={16}
                                className="text-gray-700 mt-1"
                              />
                            )}
                            {n.tipo === "avance_enviado" && (
                              <Paperclip
                                size={16}
                                className="text-gray-700 mt-1"
                              />
                            )}
                            {n.tipo === "nuevo_avance" && (
                              <MessageCircle
                                size={16}
                                className="text-gray-700 mt-1"
                              />
                            )}

                            {/* Mensaje */}
                            <span
                              className={`text-gray-700 break-words flex-1 ${
                                !n.leida ? "font-semibold" : ""
                              }`}
                            >
                              {n.mensaje}
                              {!n.leida && (
                                <span className="ml-2 inline-block bg-blue-100 text-blue-600 text-[10px] font-medium px-2 py-[2px] rounded-full">
                                  No leído
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )
                  )
                ) : (
                  // Si no hay notificaciones
                  <div className="flex flex-col justify-center items-center text-center h-[60vh] text-[#82777A]">
                    <BellOff size={48} className="text-gray-400 mb-4" />
                    <p className="text-sm sm:text-base font-medium">
                      No hay notificaciones por el momento
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* 👤 Usuario y menú */}
        <div className="flex items-center gap-2 relative">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black text-white font-bold">
            {user?.nombre
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex flex-col">
              <span className="font-medium text-[8px] sm:text-[10px]">
                {user?.nombre}
              </span>
              <span className="text-gray-500 capitalize text-[7px] sm:text-[9px]">
                {user?.role?.nombre}
              </span>
            </div>

            <button onClick={toggleMenu}>
              <img
                src={isMenuOpen ? flechaarriba : flechaabajo}
                alt="Toggle menú"
                className="w-4"
              />
            </button>
          </div>

          {isMenuOpen && (
            <div className="text-[#575051] absolute right-0 top-[60px] flex flex-col bg-white border rounded-lg shadow-md min-w-[230px] p-2 z-50">
              {user?.role?.nombre === "estudiante" && (
                <>
                  <button
                    onClick={() => handleNavigation("miperfil")}
                    className="flex justify-between text-left px-2 py-1 hover:bg-gray-100"
                  >
                    Mi perfil <img src={miperfil} alt="Icono" />
                  </button>
                  <button
                    onClick={() => handleNavigation("miasesor")}
                    className="flex justify-between text-left px-2 py-1 hover:bg-gray-100"
                  >
                    Mi asesor <img src={micontrato} alt="Icono" />
                  </button>
                  <button
                    onClick={() => handleNavigation("micontrato")}
                    className="flex justify-between text-left px-2 py-1 hover:bg-gray-100"
                  >
                    Mi contrato <img src={miasesor} alt="Icono" />
                  </button>
                  <button
                    onClick={() => handleNavigation("cambiarcontraseña")}
                    className="flex justify-between text-left px-2 py-1 hover:bg-gray-100"
                  >
                    Cambiar contraseña <img src={candadoblack} alt="Icono" />
                  </button>
                </>
              )}
              {user?.role?.nombre === "asesor" && (
                <div className="flex justify-between text-left px-2 py-1">
                  Intranet Asesor
                </div>
              )}
              {user?.role?.nombre === "admin" && (
                <>
                  <button className="text-left px-2 py-1 hover:bg-gray-100">
                    Panel de control
                  </button>
                  <button className="text-left px-2 py-1 hover:bg-gray-100">
                    Configuración
                  </button>
                </>
              )}
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="flex justify-between text-left px-2 py-1 hover:bg-gray-100 text-red-500"
              >
                Cerrar sesión <img src={cerrarsesion} alt="Icono" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
