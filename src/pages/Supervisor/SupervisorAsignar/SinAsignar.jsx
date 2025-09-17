import React, { useState } from 'react'
import eliminar from "../../../assets/icons/delete.svg";

const SinAsignar = () => {
  // Estado para los clientes sin asignar
  const [clientes, setClientes] = useState([
    { id: 1, nombre: "Juan Mateo Pérez Vinlof", fecha: "25/07/24", carrera: "Administración de empresas", tipo: "sinAsignar" },
    { id: 2, nombre: "María López Martínez", fecha: "24/07/24", carrera: "Ingeniería de sistemas", tipo: "sinAsignar" },
    { id: 3, nombre: "Carlos Sánchez Ruiz", fecha: "23/07/24", carrera: "Derecho", tipo: "sinAsignar" },
    { id: 4, nombre: "Ana García Torres", fecha: "22/07/24", carrera: "Medicina", tipo: "sinAsignar" },
    { id: 5, nombre: "Juan Mateo Pérez Vinlof", fecha: "25/07/24", carrera: "Administración de empresas", tipo: "sinAsignar" },
    { id: 6, nombre: "María López Martínez", fecha: "24/07/24", carrera: "Ingeniería de sistemas", tipo: "sinAsignar" },
    { id: 7, nombre: "Carlos Sánchez Ruiz", fecha: "23/07/24", carrera: "Derecho", tipo: "sinAsignar" },
    { id: 8, nombre: "Ana García Torres", fecha: "22/07/24", carrera: "Medicina", tipo: "sinAsignar" }
  ]);

  // Estado para el delegado
  const [delegado, setDelegado] = useState(null);
  
  // Estado para los estudiantes normales seleccionados
  const [estudiantes, setEstudiantes] = useState([]);

  // Función para manejar la selección de un cliente
  const handleElegir = (cliente) => {
    // Si no hay delegado, asignar como delegado
    if (!delegado) {
      setDelegado(cliente);
    } else {
      // Si ya hay delegado, agregar a estudiantes normales
      setEstudiantes([...estudiantes, cliente]);
    }
    
    // Eliminar el cliente de la lista de sin asignar
    setClientes(clientes.filter(c => c.id !== cliente.id));
  };

  // Función para eliminar delegado
  const handleEliminarDelegado = () => {
    if (delegado) {
      // Regresar el delegado a la lista de sin asignar
      setClientes([...clientes, {...delegado, tipo: "sinAsignar"}]);
      setDelegado(null);
    }
  };

  // Función para eliminar estudiante normal
  const handleEliminarEstudiante = (id) => {
    const estudiante = estudiantes.find(e => e.id === id);
    if (estudiante) {
      // Regresar el estudiante a la lista de sin asignar
      setClientes([...clientes, {...estudiante, tipo: "sinAsignar"}]);
      setEstudiantes(estudiantes.filter(e => e.id !== id));
    }
  };

  return (
    <div>
      <h1 className='text-[20px] font-medium'>Clientes Sin Asignar</h1>
      <div className='mb-2'>
        {/* Sección de Delegado */}
        <div className="flex flex-row gap-1 mb-2 items-center">
          <p className="font-medium">Delegado:</p>
          {delegado ? (
            <div className="flex  items-center justify-between border gap-2 rounded px-2 py-[5px] bg-white shadow-sm">
              <span className="text-sm">{delegado.nombre}</span>
              <button onClick={handleEliminarDelegado}>
                <img src={eliminar} alt="Eliminar" />
              </button>
            </div>
          ) : (
            <div className="flex w-52 items-center justify-between border gap-1 rounded px-2 py-[5px] bg-white shadow-sm">
              <span className="text-sm text-gray-400">Sin delegado</span>
            </div>
          )}
        </div>

        {/* Sección de Estudiantes Normales */}
        {estudiantes.length > 0 && (
          <div className="mb-2">
            <p className="font-medium">Estudiantes:</p>
            <div className='flex gap-2'>
              {estudiantes.map(estudiante => (
              <div key={estudiante.id} className="flex  items-center justify-between border gap-1 rounded px-2 py-[5px] bg-white shadow-sm mt-1">
                <span className="text-sm">{estudiante.nombre}</span>
                <button onClick={() => handleEliminarEstudiante(estudiante.id)}>
                  <img src={eliminar} alt="Eliminar" />
                </button>
              </div>
            ))}
            </div>
            
          </div>
        )}
      </div>

      <div className='rounded-md bg-[#E4E2E2] p-1 mb-4'>
        <input className="bg-transparent w-full focus:outline-none text-black placeholder:text-[#888]" type="text" placeholder="Buscar por ID, DNI o nombre..." />
      </div>
      
      <div>
        <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
          <div className="w-[40px] flex justify-center">ID</div>
          <div className="w-[300px] flex justify-center">Alumno</div>
          <div className="w-[160px] flex justify-center">Fecha de Creacion</div>
          <div className="w-[360px] flex justify-center">Carrera</div>
          <div className="w-[180px] flex justify-center">Accion</div>
        </div>

        {/* Lista de clientes sin asignar */}
        {clientes.map((cliente, index) => (
          <div key={cliente.id} className={`flex justify-between text-[#2B2829] font-normal ${index % 2 === 0 ? 'bg-[#E9E7E7]' : ''} p-[6px] rounded-md`}>
            <div className="w-[40px] flex justify-center">{cliente.id}</div>
            <div className="w-[300px] flex justify-center">{cliente.nombre}</div>
            <div className="w-[160px] flex justify-center">{cliente.fecha}</div>
            <div className="w-[360px] flex justify-center">{cliente.carrera}</div>
            <button 
              className="w-[180px] rounded-md bg-[#1C1C34] flex justify-center text-white"
              onClick={() => handleElegir(cliente)}
            >
              Elegir
            </button>
          </div>
        ))}
      </div>

      <div className='flex justify-between xl:flex-row flex-col gap-4 mt-5'>
        <select className='border border-black rounded-md px-[14px] xl:w-[275px] h-9'>
          <option value="" disabled>Áreas</option>
          <option value={1}>Negocios</option>
          <option value={2}>Social</option>
          <option value={3}>Salud</option>
          <option value={4}>Ingeniería</option>
          <option value={5}>Legal</option>
        </select>

        <select className='border border-black rounded-md px-[14px] xl:w-[555px] h-9'>
          <option value="" disabled>Asesor</option>
          <option value={1}>Juan Ramirez Garcia</option>
          <option value={2}>Maria Lopez</option>
          <option value={3}>Carlos Perez</option>
        </select>
      </div>

      <div className='flex  gap-5 mt-4 items-center '>
        <p>Referencia: </p>
        <input className="rounded-md border border-black p-1  bg-transparent w-[350px] focus:outline-none text-black placeholder:text-[#888]" type="text" />
      </div>

      <div className='flex justify-end'>
        <button className='w-[200px] bg-[#1C1C34] text-white rounded-md py-2 mt-4'>Asignar</button>
      </div>
    </div>
  )
}

export default SinAsignar