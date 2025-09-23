import Menu from "../assets/icons/IconEstudiante/BotonMenu.svg";
import LogoAleja from "../assets/icons/IconEstudiante/LogoOscuro.svg";
import MenuRetraido from "../assets/icons/menuRetra.svg";
//Logos
import Asignaciones from "../assets/icons/IconAdmin/asignar.svg";
import ConfIntranet from "../assets/icons/IconAdmin/configurar.svg";
import GestionSoporte from "../assets/icons/IconAdmin/SoporteTecnico.svg";
import InduccionIconSideBar from "../assets/icons/IconAdmin/video-play.png";
import Pagos from "../assets/icons/IconEstudiante/PagosEstudiante.svg";

import HomeEstu from "../assets/icons/IconEstudiante/HomeEstudent.svg";
import Reuniones from "../assets/icons/IconEstudiante/ReunionEstudiante.svg";
import EntreRev from "../assets/icons/IconEstudiante/EnvioEstudiante.svg";
import Calendario from "../assets/icons/IconEstudiante/CalendarEstudiante.svg";
import Gestion from "../assets/icons/IconAsesor/gestionAlum.svg";

import Recursos from "../assets/icons/IconEstudiante/RecursosEstudiante.svg";
import { Link } from "react-router-dom";

const SidebarResponsive = ({ showResponsive, setShowResponsive }) => {
  const rol = JSON.parse(localStorage.getItem("user"))?.role || "estudiante";

  const rutasPorRoles = {
    admin: [
      {
        icono: Gestion,
        path: "/admin/gestionar-usuarios",
        title: "Gestionar Usuarios",
        // SubLinks ya no se renderizan en la barra lateral
        subLinks: [
          {
            path: "/admin/gestionar-usuarios/listar-estudiantes",
            title: "Listar Estudiantes",
          },
          {
            path: "/admin/gestionar-usuarios/listar-asesores",
            title: "Listar Asesores",
          },
        ],
      },
      {
        icono: Asignaciones,
        path: "/admin/asignaciones",
        title: "Asignaciones",
        subLinks: [
          {
            path: "/admin/asignaciones/listar-asignar",
            title: "Listar Sin Asignar",
          },
          {
            path: "/admin/asignaciones/listar-asignado",
            title: "Listar Asignados",
          },
        ],
      },
      { icono: Pagos, path: "/admin/pagos", title: "Pagos" },
      {
        icono: ConfIntranet,
        path: "/admin/confIntra",
        title: "Configuración de Intranet",
      },
      {
        icono: InduccionIconSideBar,
        path: "/admin/inducciones",
        title: "Inducciones",
      },
      {
        icono: GestionSoporte,
        path: "/admin/soporte",
        title: "Gestion Soporte Tecnico",
      },
    ],
    estudiante: [
      { icono: HomeEstu, path: "/estudiante/home", title: "Home" },
      {
        icono: Reuniones,
        path: "/estudiante/reuniones",
        title: "Zoom / Inducciones",
      },
      {
        icono: EntreRev,
        path: "/estudiante/entrega",
        title: "Entrega/Revisión",
        subLinks: [
          { path: "/estudiante/entrega/terminados" },
          { path: "/estudiante/entrega/pendientes" },
        ],
      },
      {
        icono: Calendario,
        path: "/estudiante/calendario",
        title: "Calendario",
      },
      { icono: Recursos, path: "/estudiante/recursos", title: "Recursos" },
      { icono: Pagos, path: "/estudiante/pagos", title: "Pagos" },
    ],
    asesor: [
      { icono: HomeEstu, path: "/asesor/home", title: "Home" },
      {
        icono: Reuniones,
        path: "/asesor/reuniones",
        title: "Zoom / Inducciones",
      },
      {
        icono: EntreRev,
        path: "/asesor/entrega",
        title: "Entrega/Revisión",
        subLinks: [
          { path: "/asesor/entrega/terminados" },
          { path: "/asesor/entrega/pendientes" },
        ],
      },
      { icono: Calendario, path: "/asesor/calendario", title: "Calendario" },
      {
        icono: Gestion,
        path: "/asesor/gestionarAlumno",
        title: "Gestionar Clientes",
      },
    ],
  };

  const toggleMenu = () => {
    console.log("Toggle menu clicked");
    setShowResponsive(!showResponsive);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full z-[60] bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${showResponsive ? "translate-x-0" : "-translate-x-full"}
        w-[260px] sm:w-[280px]
      `}
    >
      {/* Encabezado con logo y botón cerrar */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <img className="w-[50px] h-[50px]" src={LogoAleja} alt="Logo" />
        <button onClick={toggleMenu}>
          <img src={MenuRetraido} alt="Cerrar menú" className="w-6 h-6" />
        </button>
      </div>

      {/* Menú de navegación */}
      <div className="px-4 pt-6 pb-4 overflow-y-auto h-[calc(100vh-100px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <ul className="flex flex-col gap-4">
          {rutasPorRoles[rol]?.map((ruta, index) => (
            <li key={index}>
              <Link
                to={ruta.path}
                className="flex items-center gap-3 text-sm text-gray-800 hover:text-blue-600 transition-colors"
                onClick={toggleMenu}
              >
                <img
                  src={ruta.icono}
                  alt={`Icono de ${ruta.title}`}
                  className="w-5 h-5 object-contain"
                />
                <span>{ruta.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarResponsive;
