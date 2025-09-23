import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import Menu from "../../assets/icons/IconEstudiante/BotonMenu.svg";
import LogoAleja from "../../assets/icons/IconEstudiante/LogoOscuro.svg";
import MenuRetraido from "../../assets/icons/menuRetra.svg";
//Logos
import HomeEstu from "../../assets/icons/IconEstudiante/HomeEstudent.svg";
import Reuniones from "../../assets/icons/IconEstudiante/ReunionEstudiante.svg";
import EntreRev from "../../assets/icons/IconEstudiante/EnvioEstudiante.svg";
import Calendario from "../../assets/icons/IconEstudiante/CalendarEstudiante.svg";
import Recursos from "../../assets/icons/IconEstudiante/RecursosEstudiante.svg";
import Pagos from "../../assets/icons/IconEstudiante/PagosEstudiante.svg";
import Soporte from "../../assets/icons/IconEstudiante/SoporteEstudiante.svg";

const LINKS = [
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
  { icono: Calendario, path: "/estudiante/calendario", title: "Calendario" },
  { icono: Recursos, path: "/estudiante/recursos", title: "Recursos" },
  { icono: Pagos, path: "/estudiante/pagos", title: "Pagos" },
  { icono: Soporte, path: "/estudiante/soporte", title: "Soporte" },
];

const EstudianteSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
      if (window.innerWidth >= 1280) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = () => {
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {isExpanded && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <nav
        className={`fixed left-0 top-0 flex-shrink-0 bg-white z-30 transition-all duration-300 ease-in-out overflow-hidden
          ${
            isMobile
              ? isExpanded
                ? "w-[220px] h-full"
                : "w-[60px] h-[56px] md:w-[80px] sm:h-[65px] md:h-[85px]"
              : isExpanded
              ? "w-[266px] h-full"
              : "w-[100px] h-full"
          }
        `}
      >
        {/* Header */}
        {!isMobile || isExpanded ? (
          <div className="flex flex-col items-center gap-[24px] py-5 px-4">
            <img
              src={LogoAleja}
              alt="Logo"
              className="w-[40px] h-[40px] xl:w-[50px] xl:h-[50px]"
            />
            <button onClick={toggleMenu}>
              <img
                src={isExpanded ? Menu : MenuRetraido}
                alt="Toggle Menu"
                className="w-6 h-6"
              />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-2 sm:pt-3 md:pt-[20px]">
            <button onClick={toggleMenu} className="p-2">
              <img
                src={MenuRetraido}
                alt="Toggle Menu"
                className="w-5 md:w-6"
              />
            </button>
          </div>
        )}

        {/* Lista de navegación */}
        {(!isMobile || isExpanded) && (
          <ul className="flex flex-col gap-1 ">
            {LINKS.map((link) => {
              const active = isActive(link.path);
              return (
                <div key={link.title}>
                  <Link to={link.path}>
                    <li
                      className={`flex items-center cursor-pointer transition-all duration-300 ease-in-out
                        ${
                          isMobile
                            ? "w-full px-3 py-3"
                            : isExpanded
                            ? "w-[266px] px-[20px] py-[25px]"
                            : "w-[100px] px-[20px] py-[25px]"
                        }
                        h-[60px] xl:h-[77px]
                        hover:bg-[#F0EFEE] ${
                          active
                            ? "bg-[#f0efee] border-l-[5px] border-[#000]"
                            : ""
                        }
                      `}
                      onClick={handleItemClick}
                    >
                      <div className="flex items-center justify-stretch gap-4 w-full">
                        <img
                          src={link.icono}  
                          className="w-5 h-5 xl:w-6 xl:h-6"
                          alt={link.title}
                        />
                        <span
                          className={`text-[15px] xl:text-[17px] font-normal text-black whitespace-nowrap transition-all duration-300
    ${isExpanded ? "opacity-100 ml-1" : "opacity-0 ml-[-12px]"}
  `}
                        >
                          {link.title}
                        </span>
                      </div>
                    </li>
                  </Link>
                </div>
              );
            })}
          </ul>
        )}
      </nav>
    </>
  );
};

export default EstudianteSidebar;
