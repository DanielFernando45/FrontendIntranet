// src/components/Navbar.jsx
import { useContext, useState } from "react";
// import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

import logoaleja from "../assets/images/LogoAlejandriaSIN.png";
import perfil from "../assets/icons/PerfilIcon.svg";
import flechaabajo from "../assets/icons/Flecha.svg";
import flechaarriba from "../assets/icons/arrow-up.svg";

import miperfil from "../assets/icons/miPerfil.svg";
import micontrato from "../assets/icons/miContrato.svg";
import miasesor from "../assets/icons/miAsesor.svg";
import candadoblack from "../assets/icons/candadoPass.svg";
import cerrarsesion from "../assets/icons/cerrarSesion.svg";
import { useDispatch } from "react-redux";
import { logout } from "../store/auth/authSlice";

const Navbar = ({ user }) => {
  // const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    dispatch(logout())
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(`/estudiante/${path}`);
    setIsMenuOpen(false); // opcional: cerrar menú al navegar
  };

  return (
    <nav className="bg-white fixed top-0 left-[20px]  w-full flex h-[56px] sm:h-[65px] md:h-[85px] px-7 md:px-10 md:pl-[65px] justify-between items-center shadow-md z-10">
    
      <img src={logoaleja} alt="Logo Aleja" className="w-24 h-16 mn:h-auto sm:w-[170px]" />

      <div className="inline-flex items-center gap-2 relative">
        <img src={perfil} alt="Icono de perfil" className="w-6 sm:w-9 " />

        <div className="flex gap-2 items-center">
          <div className="flex flex-col ">
            <span className="font-medium text-[8px] sm:text-[10px]">{user?.nombre}</span>
            <span className="  text-gray-500 capitalize text-[7px] sm:text-[9px]">{user?.role.nombre}</span>
          </div>

          <button onClick={toggleMenu}>
            <img src={isMenuOpen ? flechaarriba : flechaabajo} alt="Toggle menú" className="w-4" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="text-[#575051] absolute right-0 top-[60px] flex flex-col bg-white border rounded-lg shadow-md min-w-[230px] p-2 z-50">
            {user?.role.nombre === 'estudiante' && (
              <>
                <button onClick={() => handleNavigation('miperfil')} className="flex justify-between text-left px-2 py-1 hover:bg-gray-100">
                  Mi perfil <img src={miperfil} alt="Icono" />
                </button>
                <button onClick={() => handleNavigation('miasesor')} className="flex justify-between text-left px-2 py-1 hover:bg-gray-100">
                  Mi asesor <img src={micontrato} alt="Icono" />
                </button>
                <button onClick={() => handleNavigation('micontrato')} className="flex justify-between text-left px-2 py-1 hover:bg-gray-100">
                  Mi contrato <img src={miasesor} alt="Icono" />
                </button>
                <button onClick={() => handleNavigation('cambiarcontraseña')} className="flex justify-between text-left px-2 py-1 hover:bg-gray-100">
                  Cambiar contraseña <img src={candadoblack} alt="Icono" />
                </button>
              </>
            )}
            {user?.role.nombre === 'asesor' && (
              <>
                <div className="flex justify-between text-left px-2 py-1 ">
                  Intranet Asesor 
                </div>
              </>
            )}
            {user?.role.nombre === 'admin' && (
              <>
                <button className="text-left px-2 py-1 hover:bg-gray-100">Panel de control</button>
                <button className="text-left px-2 py-1 hover:bg-gray-100">Configuración</button>
              </>
            )}
            <hr className="my-1" />
            <button onClick={handleLogout} className="flex justify-between text-left px-2 py-1 hover:bg-gray-100 text-red-500">
              Cerrar sesión <img src={cerrarsesion} alt="Icono" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
