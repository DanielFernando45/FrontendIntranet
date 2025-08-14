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
import { IoMenuSharp } from "react-icons/io5";
import { FaUserCog } from "react-icons/fa";

const SidebarApp = ({ activeSidebar, role, setActiveSidebar }) => {
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

  return (
    <div
      className={`bg-white h-screen ${
        activeSidebar ? "w-[300px]" : "w-[88px]"
      } py-4 space-y-6 absolute left-0 transition-all z-[51] xl:translate-x-0 -translate-x-full overflow-hidden`}
    >
      <img
        className="w-[50px] h-[50px] mx-auto"
        draggable="false"
        src={LogoAleja}
        alt="logo"
      />
      <button
        className="mx-auto block cursor-pointer border z-30"
        onClick={() => {
          setActiveSidebar(!activeSidebar);
        }}
      >
        <IoMenuSharp size={30} />
      </button>
      {/* ICONOS */}
      <div className="">
        <ul className="flex flex-col items-center gap-4">
          {rutasPorRoles[role].map((item) => (
            <li className="w-full relative ">
              <Link
                to={item.path}
                className="flex h-[70px] items-center border-l-4 border-transparent  hover:border-l-gray-500 group"
              >
                <div className=" flex min-w-[80px] justify-center ">
                  <img
                    src={item.icono}
                  />
                </div>
                <p
                  className={`text-[14px] min-w-[220px] flex-1 flex ${
                    activeSidebar
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10 "
                  } transition-all `}
                >
                  {item.title}
                </p>
              </Link>
              {/* <p
                className={`absolute left-full ${
                  activeSidebar ? "invisible" : "group-hover:visible"
                } ml-2  top-1/2 z-20 bg-indigo-600 text-white rounded-md px-3 py-1 group-hover:opacity-100 opacity-0 transition-all group-hover:-translate-y-1/2   -translate-y-1/5 whitespace-nowrap`}
              >
                {item.title}
              </p> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarApp;
