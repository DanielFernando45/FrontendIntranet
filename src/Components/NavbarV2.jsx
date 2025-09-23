// src/components/Navbar.jsx
import { use, useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

import MenuRetraido from "../assets/icons/menuRetra.svg";
import logoaleja from "../assets/images/logo-nav.jpg";
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

const NavbarV2 = ({ user, showResponsive, setShowResponsive }) => {
  // const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMenuButtom, setShowMenuBottom] = useState(false);
  const dispatch = useDispatch();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(`/estudiante/${path}`);
    setIsMenuOpen(false); // opcional: cerrar menú al navegar
  };

  return (
    <nav className="bg-white flex justify-between items-center px-5 min-h-[80px]">
      <div className="flex gap-3">
        <button
          onClick={() => setShowResponsive(!showResponsive)}
          className="flex items-center"
        >
          <img className={`xl:hidden block`} src={MenuRetraido} alt="" />
        </button>
        {/* <p className="text-xl">Alejandria</p> */}
        <img src={logoaleja} alt="Logo Aleja" className="" />
      </div>

      <div className="inline-flex items-center gap-2 relative">
        <img src={perfil} alt="Icono de perfil" className="w-6 sm:w-9 " />

        <div className="flex gap-2 items-center">
          <div className="flex flex-col ">
            <span className="font-medium text-[8px] sm:text-[10px]">
              {user?.nombre}
            </span>
            <span className="  text-gray-500 capitalize text-[7px] sm:text-[9px]">
              {user?.role}
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
            {user?.role === "estudiante" && (
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
            {user?.role === "asesor" && (
              <>
                <div className="flex justify-between text-left px-2 py-1 ">
                  Intranet Asesor
                </div>
              </>
            )}
            {user?.role === "admin" && (
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
    </nav>
  );
};

export default NavbarV2;
