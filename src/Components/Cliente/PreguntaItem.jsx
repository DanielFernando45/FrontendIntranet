// 📁 src/components/cliente/PreguntaItem.jsx
import { useState, useRef, useEffect } from 'react';
import desplegar from '../../assets/icons/pluss.svg';
import menos from '../../assets/icons/menos.svg';


export default function PreguntaItem({ pregunta, respuesta }) {
  const [abierto, setAbierto] = useState(false);
  const [altura, setAltura] = useState('0px');
  const contenidoRef = useRef(null);

  const toggleDespliegue = () => {
    setAbierto(!abierto);
  };

  useEffect(() => {
    if (contenidoRef.current) {
      setAltura(abierto ? `${contenidoRef.current.scrollHeight}px` : '0px');
    }
  }, [abierto]);

  return (
    <div className='p-3 border '>
      <div className='flex gap-[15px] items-center'>
        <button
          onClick={toggleDespliegue}
          className='transition-transform duration-300 ease-in-out'
        >
          <img
            className={`w-6 transition-transform duration-300 ${abierto ? 'rotate-180' : 'rotate-0'}`}
            src={abierto ? menos : desplegar}
            alt="icono"
          />
        </button>
        <h1 className='font-semibold text-sm lg:text-base'>{pregunta}</h1>
      </div>

      <div
        ref={contenidoRef}
        style={{ maxHeight: altura }}
        className='overflow-hidden transition-all duration-500 ease-in-out'
      >
        <p className='mt-2'>{respuesta}</p>
      </div>
    </div>
  );
}
