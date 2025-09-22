import { useSearchParams } from "react-router-dom";
import LayoutApp from "../../layout/LayoutApp";
import Noticias from "../../Components/Administrador/ConfigIntranet/Noticias";
import Tutoriales from "../../Components/Administrador/ConfigIntranet/Tutoriales";
import Guias from "../../Components/Administrador/ConfigIntranet/Guias";
import Herramientas from "../../Components/Administrador/ConfigIntranet/Herramientas";

const ConfigIntra = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const vista = searchParams.get("tab") || "noticias"; // valor por defecto

  const renderVista = () => {
    switch (vista) {
      case "noticias":
        return <Noticias />;
      case "tutoriales":
        return <Tutoriales />;
      case "guias":
        return <Guias />;
      case "herramientas":
        return <Herramientas />;
      default:
        return <Noticias />;
    }
  };

  return (
    <LayoutApp>
      <main className="flex flex-col xl:mx-32 items-start overflow-auto">
        <div className="flex flex-col gap-[10px] px-[40px] xl:w-full py-5 w-[1200px] h-auto bg-white rounded-[10px]">
          <div className="flex flex-col gap-[12px]">
            <div className="mt-5 flex justify-between">
              <h2 className="text-2xl font-bold">Configuración Intranet</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
              {["noticias", "tutoriales", "guias", "herramientas"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setSearchParams({ tab })}
                    className={`px-4 py-2 text-sm font-medium ${
                      vista === tab
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mt-4 w-full">{renderVista()}</div>
        </div>
      </main>
    </LayoutApp>
  );
};

export default ConfigIntra;
