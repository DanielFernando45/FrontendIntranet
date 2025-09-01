import { useState } from "react";
import LayoutApp from '../../layout/LayoutApp';
import Noticias from '../../Components/Administrador/ConfigIntranet/Noticias';
import Tutoriales from '../../Components/Administrador/ConfigIntranet/Tutoriales';
import Guias from '../../Components/Administrador/ConfigIntranet/Guias';
import Herramientas from '../../Components/Administrador/ConfigIntranet/Herramientas';
import ViewTabs from '../../Components/Administrador/ConfigIntranet/ViewTabs';

const ConfigIntra = () => {
  const [vista, setVista] = useState("agregar-noticias");

  const renderVista = () => {
    switch (vista) {
      case "agregar-noticias":
        return <Noticias />;
      case "agregar-tutoriales":
        return <Tutoriales />;
      case "agregar-guias":
        return <Guias />;
      case "agregar-herramientas":
        return <Herramientas />;
      default:
        return null;
    }
  };

  return (
    <LayoutApp>
      <main className="flex flex-col xl:mx-32 items-start overflow-auto">
        <div className="flex flex-col gap-[10px]  px-[40px] xl:w-full py-5 w-[1200px] h-auto bg-white rounded-[10px]">
          <div className="flex flex-col gap-[12px]">
            <div className="mt-5 flex justify-between">
              <h2 className="text-2xl font-bold">Configuración Intranet</h2>
            </div>

            <ViewTabs vista={vista} setVista={setVista} />
          </div>

          <div className="mt-4 w-full">
            {renderVista()}
          </div>
        </div>
      </main>
    </LayoutApp>
  );
};

export default ConfigIntra;