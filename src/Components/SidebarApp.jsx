import LogoAleja from "../assets/icons/IconEstudiante/LogoOscuro.svg";

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

import { NavLink } from "react-router-dom";
import { IoMenuSharp } from "react-icons/io5";

const SidebarApp = ({ activeSidebar, role, setActiveSidebar }) => {
  const rutasPorRoles = {
    admin: [
      {
        icono: Gestion,
        path: "/admin/gestionar-usuarios",
        title: "Gestionar Usuarios",
      },
      {
        icono: Asignaciones,
        path: "/admin/asignaciones",
        title: "Asignaciones",
      },
      { icono: Pagos, path: "/admin/pagos", title: "Pagos" },
      {
        icono: ConfIntranet,
        path: "/admin/confIntra",
        title: "Config. Intranet",
      },
      {
        icono: InduccionIconSideBar,
        path: "/admin/inducciones",
        title: "Inducciones",
      },
      {
        icono: GestionSoporte,
        path: "/admin/soporte",
        title: "Soporte Técnico",
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
        title: "Entrega / Revisión",
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
      { icono: EntreRev, path: "/asesor/entrega", title: "Entrega / Revisión" },
      { icono: Calendario, path: "/asesor/calendario", title: "Calendario" },
      {
        icono: Gestion,
        path: "/asesor/gestionarAlumno",
        title: "Gestionar Clientes",
      },
    ],
  };

  return (
    <>
      {/* Overlay para pantallas pequeñas */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity xl:hidden 
        ${activeSidebar ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setActiveSidebar(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r z-50 shadow-md transition-all duration-300
        ${activeSidebar ? "w-[260px]" : "w-[72px]"}
        ${
          activeSidebar ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        }`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <img src={LogoAleja} alt="logo" className="w-10 h-10" />
          <button
            className="text-gray-700 xl:hidden"
            onClick={() => setActiveSidebar(!activeSidebar)}
          >
            <IoMenuSharp size={24} />
          </button>
        </div>

        {/* Menú */}
        <nav className="mt-4">
          <ul className="flex flex-col gap-1">
            {rutasPorRoles[role]?.map((item) => (
              <li key={item.title} className="group relative">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 h-[50px] px-4 text-sm font-medium transition-colors
                    border-l-4 ${
                      isActive
                        ? "bg-gray-100 border-[#1C1C34] text-[#1C1C34]"
                        : "border-transparent text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <div className="min-w-[24px] flex justify-center">
                    <img
                      src={item.icono}
                      alt={item.title}
                      className="w-5 h-5"
                    />
                  </div>
                  <span
                    className={`whitespace-nowrap transition-all duration-200
                      ${
                        activeSidebar
                          ? "opacity-100"
                          : "opacity-0 xl:opacity-100"
                      }
                      ${
                        activeSidebar
                          ? "translate-x-0"
                          : "-translate-x-4 xl:translate-x-0"
                      }
                    `}
                  >
                    {item.title}
                  </span>
                </NavLink>

                {/* Tooltip en colapsado */}
                {!activeSidebar && (
                  <span
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 
                    bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg
                    opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                  >
                    {item.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SidebarApp;
