import React from 'react';

const ViewTabs = ({ vista, setVista }) => {
  const views = [
    "agregar-noticias",
    "agregar-tutoriales",
    "agregar-guias",
    "agregar-herramientas"
  ];

  return (
    <div className="flex w-full border-b-2 gap-3 border-black font-normal">
      {views.map((opcion) => (
        <button
          key={opcion}
          className={`px-3 rounded-t-[5px] w-[210px] h-10 ${
            vista === opcion ? "bg-[#17162E] text-white" : ""
          }`}
          onClick={() => setVista(opcion)}
        >
          {opcion
            .replace("-", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </button>
      ))}
    </div>
  );
};

export default ViewTabs;