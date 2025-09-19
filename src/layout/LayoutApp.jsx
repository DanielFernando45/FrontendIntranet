
import EstudianteSidebar from "../Components/Sidebar/EstudianteSidebar";
import AsesorSidebar from "../Components/Sidebar/AsesorSidebar";
import JefeOperSidebar from "../Components/Sidebar/JefeOperSidebar";
import SupervisorSidebar from "../Components/Sidebar/SupervisorSidebar";
import MarketingSidebar from "../Components/Sidebar/MarketingSidebar";
import ContPagoSidebar from "../Components/Sidebar/ContPagoSidebar";
import SoporteSidebar from "../Components/Sidebar/SoporteSidebar";
import Navbar from "../Components/Navbar";
import { useSelector } from "react-redux";

const LayoutApp = ({ children }) => {
  // const { state } = useContext(AuthContext);
  // const user = state.user;
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <div className="text-center p-10">Cargando datos del usuario...</div>;
  }
  const renderSidebar = () => {
    switch (user.role.nombre) {
      case 'estudiante':
        return <EstudianteSidebar />;
      case 'asesor':
        return <AsesorSidebar />;
      case 'jefe_operaciones':
        return <JefeOperSidebar />;
      case 'supervisor':
        return <SupervisorSidebar />;   
      case 'contrato_pago':
        return <ContPagoSidebar />;
      case 'marketing':
        return <MarketingSidebar />;
      case 'soporte':
        return <SoporteSidebar />;          
      default:
        return null;
    }
  };

  return (
    <div className="">
      {renderSidebar()}
       <Navbar user={user} /> 
      <div className="mt-[50px] sm:mt-[65px] md:mt-[100px] p-4 md:p-4 xl:ml-[100px] xl:p-1"> {/* Ajuste de margen para layout */}
        {children}
      </div>
    </div>
  );
};

export default LayoutApp;
