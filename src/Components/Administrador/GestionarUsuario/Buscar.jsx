import React, { useState, useEffect } from 'react';
import busqueda from "../../../assets/icons/busqueda.svg";

const Buscar = ({ onBuscar, onReset }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.trim() === "") {
      onReset();
    } else {
      onBuscar(query);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleReset = () => {
    setQuery("");
    onReset();
  };

  return (
    <div className="flex gap-3 items-center">
      <div className="flex w-full h-8 rounded-md px-[10px] py-[6px] justify-between bg-[#E4E2E2]">
        <input
          className="bg-transparent w-full focus:outline-none text-black placeholder:text-[#888]"
          type="text"
          placeholder="Buscar por ID, DNI o nombre..."
          value={query}
          onChange={handleInputChange}
        />
        {query === "" && <img src={busqueda} alt="Buscar" />}
      </div>
      {query.trim() !== "" && (
        <button
          onClick={handleReset}
          className="flex justify-center text-white w-[90px] h-8 rounded font-semibold bg-[#888] px-4 py-1"
        >
          Atrás
        </button>
      )}
    </div>
  );
};

export default Buscar;