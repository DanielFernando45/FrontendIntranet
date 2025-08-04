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

const SidebarApp = ({ expand, setExpand }) => {
  //   const [expand, setExpand] = useState(false);

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
    setExpand(!expand);
  };

  return (
    <div
      className={` ${
        expand ? "w-[300px]" : "w-[100px]"
      } transition-all duration-200 ease-linear h-full bg-white absolute  xl:translate-x-0 -translate-x-full top-0 z-50`}
    >
      <div className={`flex flex-col items-center h-full py-6 transition-all`}>
        <div className="flex flex-col items-center mb-10 gap-y-4">
          <img className="w-[60px] h-[60px]" src={LogoAleja} alt="Logo" />
          <button onClick={toggleMenu}>
            <img src={MenuRetraido} alt="Toggle Menu" />
          </button>
        </div>

        {/* PATHS */}
        <div className="space-y-10 w-full flex flex-col items-center px-4">
          {rutasPorRoles[rol].map((ruta, index) => (
            <Link
              className="flex justify-center items-center  relative overflow-hidden w-full"
              to={ruta.path}
              key={index}
              onClick={() => setExpand(false)}
            >
              <img
                className={`w-[30px] transition-all `}
                src={ruta.icono}
                alt="icono-ruta"
              />
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden transform ${
                  expand
                    ? "w-[160px] opacity-100 translate-x-0 ml-2"
                    : "w-0 opacity-0 translate-x-10 ml-0"
                } ease-linear`}
              >
                <p className="w-[160px]">{ruta.title}</p>
              </div>
            </Link>
          ))}
        </div>
        {/* PATHS */}
      </div>
    </div>
  );
};

export default SidebarApp;
