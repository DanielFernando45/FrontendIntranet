import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Menu from "../../assets/icons/IconEstudiante/BotonMenu.svg";
import LogoAleja from "../../assets/icons/IconEstudiante/LogoOscuro.svg";
import MenuRetraido from "../../assets/icons/menuRetra.svg";
import ConfIntranet from "../../assets/icons/IconAdmin/configurar.svg";

const LINKS = [
  {
    icono: ConfIntranet,
    path: "/marketing/ConfigIntra",
    title: "Configuración de Intranet",
  },
];

const MarketingSidebar = () => {
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
    setIsExpanded(false);
  };

  // Verifica si la ruta o alguna de sus subrutas está activa
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
                      ? "w-[266px] h-full"
                      : "w-[50px] h-[56px] md:w-[80px] sm:h-[65px] md:h-[85px] shadow-md"
                    : isExpanded
                    ? "w-[266px] h-full"
                    : "w-[100px] h-full"
                } flex-shrink-0 bg-white z-30 transition-[width] duration-500 ease-in-out overflow-hidden`}
          >
            {!isMobile || isExpanded ? (
              <div className="flex flex-col items-center  gap-[30px] py-5 px-5">
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
                  // Verifica si la ruta principal o alguna de sus subrutas está activa
                  const active = isActive(link.path);
                  return (
                    <div key={link.title}>
                      {/* Solo renderizamos la ruta principal */}
                      <Link to={link.path}>
                        <li
                          className={`flex items-center ${
                            isExpanded ? "w-[266px]" : "w-[100px]"
                          } h-[77px] px-[20px] py-[25px] cursor-pointer flex-shrink-0 bg-white z-30 transition-all duration-300 
                        hover:bg-[#F0EFEF] ${
                          active ? "bg-[#EFEFEE] border-l-[5px] border-[#000]" : ""
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
    
                      {/* Las subrutas ya no se renderizan en el sidebar */}
                    </div>
                  );
                })}
              </ul>
            )}
          </nav>
        </>
  )
}

export default MarketingSidebar