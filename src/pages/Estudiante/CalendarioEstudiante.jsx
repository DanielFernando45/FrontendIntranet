import React, { useState, useEffect } from 'react';
import LayoutApp from '../../layout/LayoutApp'
import Zoom from "../../assets/images/zoom.svg"

const CalendarioEstudiante = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [calendarDays, setCalendarDays] = useState([]);
  const [monthName, setMonthName] = useState('');
  const [dayName, setDayName] = useState('');
  const [asesorias, setAsesorias] = useState([]);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);
  const [eventosDia, setEventosDia] = useState([]);

  useEffect(() => {
    const usuario = localStorage.getItem('user');
    if (usuario) {
      const user = JSON.parse(usuario);
      const id = user.id;

      fetch(`${import.meta.env.VITE_API_PORT_ENV}/cliente/miAsesoramiento/${id}`)
        .then(res => res.json())
        .then(data => {
          const asesoriasArray = Object.values(data).map(item => ({
            id: item.id,
            profesion: item.profesion_asesoria
          }));
          setAsesorias(asesoriasArray);

          if (asesoriasArray.length > 0) {
            const primeraAsesoriaId = asesoriasArray[0].id;
            setSelectedAsesoriaId(primeraAsesoriaId);
          }
        })
        .catch(error => console.error('Error al obtener asesorías:', error));
    }
  }, []);

  useEffect(() => {
    if (selectedAsesoriaId) {
      fetchEventosDia();
    }
  }, [selectedAsesoriaId, selectedYear, selectedMonth, selectedDay]);

  const fetchEventosDia = () => {
    const fechaSeleccionada = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    fetch(`${import.meta.env.VITE_API_PORT_ENV}/common/calendario_estudiante/${selectedAsesoriaId}/${fechaSeleccionada}`)
      .then(res => res.json())
      .then(data => {
        setEventosDia(data);
      })
      .catch(error => console.error('Error al obtener eventos del día:', error));
  };

  const handleChange = (e) => {
    const asesoriaId = e.target.value;
    setSelectedAsesoriaId(asesoriaId);
  }

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysOfWeek = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

  useEffect(() => {
    generateCalendar();
  }, [selectedMonth, selectedYear]);

  const generateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);

    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const prevMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();

    let days = [];

    // Días del mes anterior
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        currentMonth: false,
        date: new Date(selectedYear, selectedMonth - 1, prevMonthDays - i)
      });
    }

    // Días del mes actual
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(selectedYear, selectedMonth, i);
      days.push({
        day: i,
        currentMonth: true,
        date: date,
        isToday: i === new Date().getDate() &&
          selectedMonth === new Date().getMonth() &&
          selectedYear === new Date().getFullYear()
      });
    }

    // Días del siguiente mes
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        currentMonth: false,
        date: new Date(selectedYear, selectedMonth + 1, i)
      });
    }

    setCalendarDays(days);
    setMonthName(months[selectedMonth]);
    updateSelectedDayInfo(selectedDay);
  };

  const updateSelectedDayInfo = (day) => {
    const date = new Date(selectedYear, selectedMonth, day);
    const options = { weekday: 'long' };
    const dayName = new Intl.DateTimeFormat('es-ES', options).format(date);
    setDayName(dayName.charAt(0).toUpperCase() + dayName.slice(1));
  };

  const handleDayClick = (day, isCurrentMonth) => {
    if (isCurrentMonth) {
      setSelectedDay(day);
      updateSelectedDayInfo(day);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };

  const addOneHour = (dateTimeString) => {
    const date = new Date(dateTimeString);
    date.setUTCHours(date.getUTCHours() + 1);
    return date.toISOString();
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')}${ampm}`;
  };

  const renderEventos = () => {
    if (eventosDia.length === 0) {
      return (
        <div className='bg-white flex w-full min-h-[121px] gap-2 p-4 border-2 border-[#E9E7E7] rounded-lg'>
          <div className='flex flex-col gap-1 w-full'>
            <h2 className='text-center sm:text-[25px] font-bold text-[#575051]'>No hay eventos programados</h2>
          </div>
        </div>
      );
    }

    return eventosDia.map((evento, index) => {
      if (evento.fecha) {
        // Evento de reunión
        return (
          <div key={index} className='bg-white flex w-full min-h-[121px] gap-2 p-4 border-2 border-[#E9E7E7] rounded-lg'>
            <div className='flex items-start pt-1'>
              <div className='w-[15px] h-[15px] rounded-full bg-[#4E4E91]'></div>
            </div>
            <div className='flex flex-col justify-between'>
              <p className='text-[#575051] font-medium'>
                {formatTime(evento.fecha)} - {formatTime(addOneHour(evento.fecha))}
              </p>

              <div className='flex flex-col gap-2  text-[20px]'>
                <h2 className='text-[25px] font-bold text-[#575051] '>Asesor(a): {evento.asesor_nombre}</h2>
                <div className='flex items-center gap-5'>
                  {evento.enlace && (
                    <a href={evento.enlace_zoom} target="_blank" rel="noopener noreferrer">
                      <img src={Zoom} alt="Zoom" className='w-10' />
                    </a>
                  )}
                  <p className='text-[#82777A]'>{evento.titulo}</p>
                </div>

              </div>
            </div>
          </div>
        );
      } else {
        // Evento de mensaje
        return (
          <div key={index} className='bg-white flex w-full min-h-[121px] gap-2 p-4 border-2 border-[#E9E7E7] rounded-lg'>
            <div className='flex items-start pt-1'>
              <div className='w-[15px] h-[15px] rounded-full bg-[#4E4E91]'></div>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-[#575051] font-medium'>
                {formatTime(evento.fecha_terminado)}
              </p>
              <h2 className='text-[25px] font-bold text-[#575051]'>{evento.titulo}</h2>
              <p className='text-[#82777A]'>Fecha limite: {formatDate(evento.fecha_terminado)}</p>
            </div>
          </div>
        );
      }
    });
  };

  const renderCalendarDays = () => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    return weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="flex gap-2 w-full">
        {week.map((dayData, dayIndex) => {
          const isSelected = dayData.currentMonth && dayData.day === selectedDay;
          const isToday = dayData.isToday;

          return (
            <div
              key={dayIndex}
              onClick={() => handleDayClick(dayData.day, dayData.currentMonth)}
              className={`
                flex justify-center items-center rounded-full flex-1 lg:w-[60px] lg:h-[60px] xl:w-[85px] xl:h-[85px] xl:text-[25px] 
                cursor-pointer transition-colors duration-200
                ${dayData.currentMonth ?
                  isSelected ? 'bg-[#4BD7F5] text-white' :
                    isToday ? 'border-2 border-[#4BD7F5] text-[#4BD7F5]' :
                      'text-[#575051] hover:bg-[#E9E7E7] hover:text-[#4BD7F5]' :
                  'text-[#D2CECF] hover:bg-[#E9E7E7]'}
              `}
            >
              {dayData.day}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <LayoutApp>
      <main className='sm:m-5 flex flex-col lg:flex-row gap-10 xl:gap-[60px]'>
        <div className='bg-white rounded-xl p-4 flex flex-col flex-1 lg:w-[60%] justify-center items-center'>
          <div className='flex flex-col  w-full justify-between mb-10 gap-3'>
            <p className='font-semibold text-[20px] text-[#575051]'>Calendario de actividades</p>
            <div className='flex flex-col sm:flex-row gap-3'>
              <select
                className='bg-[#1C1C34] w-full p-[5px] rounded-lg text-white sm:w-[120px] h-[35px] font-semibold'
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>

              <select
                className='bg-[#1C1C34] p-[5px] w-full rounded-lg text-white sm:w-[120px] h-[35px] font-semibold'
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {Array.from({ length: 6 }, (_, i) => 2030 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <select
                onChange={handleChange}
                value={selectedAsesoriaId || ''}
                className='border rounded-t-md border-[#b4a6aa]'
              >
                {asesorias.map((asesoria, index) => (
                  <option key={index} value={asesoria.id}>{asesoria.profesion}</option>
                ))}
              </select>

            </div>
          </div>

          <div className='flex flex-col gap-4 w-full'>
            <div className='flex gap-2'>
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className='flex justify-center items-center rounded-full flex-1 lg:w-[60px] xl:w-[85px] xl:h-[35px] xl:text-[18px] font-semibold text-[#575051]'
                >
                  {day}
                </div>
              ))}
            </div>

            {renderCalendarDays()}
          </div>
        </div>

        <div className='flex flex-col h-full justify-center p-5 gap-8 flex-1 xl:w-[40%] bg-white rounded-xl shadow-md'>
          <div className='text-center'>
            <p className='text-[#b1afb0] font-medium text-[20px]'>{dayName}</p>
            <h2 className='text-[50px] font-semibold text-[#575051]'>{selectedDay}</h2>
            <h1 className='text-[#575051] text-[25px] font-semibold'>{monthName}</h1>
          </div>

          <div className='flex flex-1 flex-col gap-4 overflow-y-auto max-h-[500px]'>
            {renderEventos()}
          </div>
        </div>
      </main>
    </LayoutApp>
  );
}

export default CalendarioEstudiante;