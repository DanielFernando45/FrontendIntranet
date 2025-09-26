import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Menu from "../../assets/icons/IconEstudiante/BotonMenu.svg";
import LogoAleja from "../../assets/icons/IconEstudiante/LogoOscuro.svg";
import MenuRetraido from "../../assets/icons/menuRetra.svg";

// Logos
import Gestion from "../../assets/icons/IconAsesor/gestionAlum.svg";
import Asignaciones from "../../assets/icons/IconAdmin/asignar.svg";

const LINKS = [
  {
    icono: Gestion,
    path: "/jefe-operaciones/gestionar-usuarios",
    title: "Gestionar Usuarios",
  },
  {
    icono: Asignaciones,
    path: "/jefe-operaciones/supervisor-asig",
    title: "Asignados",
  },
];

const JefeOperSidebar = () => {
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

  const toggleMenu = () => setIsExpanded(!isExpanded);
  const handleItemClick = () => setIsExpanded(false);
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <nav
        className={`fixed left-0 top-0
          ${
            isMobile
              ? isExpanded
                ? "w-[266px]"
                : "w-[50px] md:w-[80px] shadow-md"
              : isExpanded
              ? "w-[266px]"
              : "w-[100px]"
          }
          h-screen  /* 👈 ocupa exactamente el alto de la pantalla */
          flex-shrink-0 bg-white z-30 transition-[width] duration-500 ease-in-out
          overflow-y-auto /* 👈 solo aparece scroll si de verdad hay muchos links */
        `}
      >
        {!isMobile || isExpanded ? (
          <div className="flex flex-col items-center gap-[30px] py-5 px-5">
            <img src={LogoAleja} alt="Logo" />
            <button onClick={toggleMenu}>
              <img src={isExpanded ? Menu : MenuRetraido} alt="Toggle Menu" />
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

        {(!isMobile || isExpanded) && (
          <ul className="flex flex-col gap-1 items-start">
            {LINKS.map((link) => {
              const active = isActive(link.path);
              return (
                <div key={link.title}>
                  <Link to={link.path}>
                    <li
                      className={`flex items-center ${
                        isExpanded ? "w-[266px]" : "w-[100px]"
                      } px-[20px] py-[15px] cursor-pointer flex-shrink-0 transition-all duration-300 
                        hover:bg-[#F0EFEF] ${
                          active
                            ? "bg-[#EFEFEE] border-l-[5px] border-[#000]"
                            : ""
                        }`}
                      onClick={handleItemClick}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <img src={link.icono} className="w-6 h-6" />
                        {isExpanded && (
                          <span className="text-[17px] font-medium text-gray-800">
                            {link.title}
                          </span>
                        )}
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

export default JefeOperSidebar;
