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
      className={`${
        showResponsive ? "translate-x-0" : "-translate-x-full"
      } w-full sm:w-[300px] transition-all duration-100 ease-linear h-full bg-white absolute top-0 z-[60]`}
    >
      <div
        className={`border flex flex-col items-center h-full py-6 transition-all`}
      >
        <div className="flex flex-col items-center mb-10 gap-y-4">
          <img className="w-[60px] h-[60px]" src={LogoAleja} alt="Logo" />
          <button onClick={toggleMenu}>
            <img src={MenuRetraido} alt="Toggle Menu" />
          </button>
        </div>

        {/* PATHS */}
        <div className="space-y-10">
          {rutasPorRoles[rol].map((ruta, index) => (
            <Link
              className="flex items-center gap-2 relative overflow-hidden"
              to={ruta.path}
              key={index}
              onClick={() => setExpand(!expand)}
            >
              <img className={`w-[30px]`} src={ruta.icono} alt="icono-ruta" />
              <p>{ruta.title}</p>
            </Link>
          ))}
        </div>
        {/* PATHS */}
      </div>
    </div>
  );
};

export default SidebarResponsive;
