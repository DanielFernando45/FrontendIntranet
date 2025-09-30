import React, { useState, useEffect } from "react";
import LayoutApp from "../../layout/LayoutApp";
import Zoom from "../../assets/images/zoom.svg";
import {
  CalendarCheck2,
  Clock,
  Video,
  FileText,
  NotepadText,
  ClipboardX,
} from "lucide-react";

const CalendarioEstudiante = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [calendarDays, setCalendarDays] = useState([]);
  const [monthName, setMonthName] = useState("");
  const [dayName, setDayName] = useState("");
  const [asesorias, setAsesorias] = useState([]);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);
  const [eventosDia, setEventosDia] = useState([]);
  const [eventos, setEventos] = useState({
    reuniones: [],
    contratos: [],
    asuntos: [],
  });
  useEffect(() => {
    const usuario = localStorage.getItem("user");
    if (usuario) {
      const user = JSON.parse(usuario);
      const id = user.id_cliente;

      fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/cliente/miAsesoramiento/${id}`
      )
        .then((res) => res.json())
        .then((data) => {
          const asesoriasArray = Object.values(data).map((item) => ({
            id: item.id,
            profesion: item.profesion_asesoria,
          }));
          setAsesorias(asesoriasArray);

          if (asesoriasArray.length > 0) {
            const primeraAsesoriaId = asesoriasArray[0].id;
            setSelectedAsesoriaId(primeraAsesoriaId);
          }
        })
        .catch((error) => console.error("Error al obtener asesorías:", error));
    }
  }, []);

  useEffect(() => {
    if (selectedAsesoriaId) {
      fetchEventosDia();
    }
  }, [selectedAsesoriaId, selectedYear, selectedMonth, selectedDay]);

  const fetchEventosDia = () => {
    fetch(
      `${
        import.meta.env.VITE_API_PORT_ENV
      }/common/calendario_estudiante/${selectedAsesoriaId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const reuniones = data.reuniones || [];
          const contratos = data.contratos || [];
          const asuntos = data.asuntos || [];
          setEventos({ reuniones, contratos, asuntos });
          const eventosDelDia = [
            ...reuniones.filter(
              (evento) =>
                new Date(evento.fecha).getDate() === selectedDay &&
                new Date(evento.fecha).getMonth() === selectedMonth &&
                new Date(evento.fecha).getFullYear() === selectedYear
            ),
            ...contratos.filter(
              (evento) =>
                (new Date(evento.fecha_inicio).getDate() === selectedDay &&
                  new Date(evento.fecha_inicio).getMonth() === selectedMonth &&
                  new Date(evento.fecha_inicio).getFullYear() ===
                    selectedYear) ||
                (evento.fecha_fin &&
                  new Date(evento.fecha_fin).getDate() === selectedDay &&
                  new Date(evento.fecha_fin).getMonth() === selectedMonth &&
                  new Date(evento.fecha_fin).getFullYear() === selectedYear)
            ),
            ...asuntos.filter(
              (evento) =>
                (evento.fecha_entregado &&
                  new Date(evento.fecha_entregado).getDate() === selectedDay &&
                  new Date(evento.fecha_entregado).getMonth() ===
                    selectedMonth &&
                  new Date(evento.fecha_entregado).getFullYear() ===
                    selectedYear) ||
                (evento.fecha_revision &&
                  new Date(evento.fecha_revision).getDate() === selectedDay &&
                  new Date(evento.fecha_revision).getMonth() ===
                    selectedMonth &&
                  new Date(evento.fecha_revision).getFullYear() ===
                    selectedYear) ||
                (evento.fecha_terminado &&
                  new Date(evento.fecha_terminado).getDate() === selectedDay &&
                  new Date(evento.fecha_terminado).getMonth() ===
                    selectedMonth &&
                  new Date(evento.fecha_terminado).getFullYear() ===
                    selectedYear) ||
                (evento.fecha_estimada &&
                  new Date(evento.fecha_estimada).getDate() === selectedDay &&
                  new Date(evento.fecha_estimada).getMonth() ===
                    selectedMonth &&
                  new Date(evento.fecha_estimada).getFullYear() ===
                    selectedYear)
            ),
          ];
          setEventosDia(eventosDelDia);
        }
      })
      .catch((error) =>
        console.error("Error al obtener eventos del día:", error)
      );
  };
  const handleChange = (e) => {
    const idSeleccionado = parseInt(e.target.value); // asegura que sea número
    setSelectedAsesoriaId(idSeleccionado);
  };

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const daysOfWeek = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  useEffect(() => {
    generateCalendar();
  }, [selectedMonth, selectedYear]);

  const generateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7; // Convierte domingo (0) en 6, lunes (1) en 0, etc.
    const totalDays = lastDay.getDate();
    const prevMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();

    const today = new Date();

    let days = [];

    // Días del mes anterior (relleno)
    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push({
        day,
        currentMonth: false,
        isToday:
          day === today.getDate() &&
          selectedMonth - 1 === today.getMonth() &&
          selectedYear === today.getFullYear(),
      });
    }

    // Días del mes actual
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        currentMonth: true,
        isToday:
          i === today.getDate() &&
          selectedMonth === today.getMonth() &&
          selectedYear === today.getFullYear(),
      });
    }

    // Días del mes siguiente (relleno)
    const totalFilled = days.length;
    for (let i = 1; i <= 35 - totalFilled; i++) {
      days.push({
        day: i,
        currentMonth: false,
        isToday:
          i === today.getDate() &&
          selectedMonth + 1 === today.getMonth() &&
          selectedYear === today.getFullYear(),
      });
    }

    setCalendarDays(days);
    setMonthName(months[selectedMonth]);
    updateSelectedDayInfo(selectedDay);
  };

  const updateSelectedDayInfo = (day) => {
    const date = new Date(selectedYear, selectedMonth, day);
    const options = { weekday: "long" };
    const dayName = new Intl.DateTimeFormat("es-ES", options).format(date);
    setDayName(dayName.charAt(0).toUpperCase() + dayName.slice(1));
  };

  const handleDayClick = (day, isCurrentMonth) => {
    if (isCurrentMonth) {
      setSelectedDay(day);
      updateSelectedDayInfo(day);
    }
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
      date.getUTCMinutes()
    ).padStart(2, "0")}`;
  };

  const renderCalendarDays = (eventos) => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7)
      weeks.push(calendarDays.slice(i, i + 7));

    return weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="grid grid-cols-7 gap-[6px] w-full">
        {week.map((dayData, dayIndex) => {
          const isSelected =
            dayData.currentMonth && dayData.day === selectedDay;
          const isToday = dayData.isToday;

          const eventosEnElDia = eventos.reuniones.filter(
            (evento) =>
              new Date(evento.fecha).getDate() === dayData.day &&
              new Date(evento.fecha).getMonth() === selectedMonth &&
              new Date(evento.fecha).getFullYear() === selectedYear
          );

          const eventosDeContrato = eventos.contratos.filter(
            (evento) =>
              (new Date(evento.fecha_inicio).getDate() === dayData.day &&
                new Date(evento.fecha_inicio).getMonth() === selectedMonth &&
                new Date(evento.fecha_inicio).getFullYear() === selectedYear) ||
              (evento.fecha_fin &&
                new Date(evento.fecha_fin).getDate() === dayData.day &&
                new Date(evento.fecha_fin).getMonth() === selectedMonth &&
                new Date(evento.fecha_fin).getFullYear() === selectedYear)
          );

          const eventosDeAsunto = eventos.asuntos.filter(
            (evento) =>
              (evento.fecha_entregado &&
                new Date(evento.fecha_entregado).getDate() === dayData.day &&
                new Date(evento.fecha_entregado).getMonth() === selectedMonth &&
                new Date(evento.fecha_entregado).getFullYear() ===
                  selectedYear) ||
              (evento.fecha_revision &&
                new Date(evento.fecha_revision).getDate() === dayData.day &&
                new Date(evento.fecha_revision).getMonth() === selectedMonth &&
                new Date(evento.fecha_revision).getFullYear() ===
                  selectedYear) ||
              (evento.fecha_terminado &&
                new Date(evento.fecha_terminado).getDate() === dayData.day &&
                new Date(evento.fecha_terminado).getMonth() === selectedMonth &&
                new Date(evento.fecha_terminado).getFullYear() ===
                  selectedYear) ||
              (evento.fecha_estimada &&
                new Date(evento.fecha_estimada).getDate() === dayData.day &&
                new Date(evento.fecha_estimada).getMonth() === selectedMonth &&
                new Date(evento.fecha_estimada).getFullYear() === selectedYear)
          );

          const tieneEventos =
            eventosEnElDia.length > 0 ||
            eventosDeContrato.length > 0 ||
            eventosDeAsunto.length > 0;

          let eventIcons = new Set();
          let dayBgClass = "bg-[#E9E7E7]";
          let dayTextColor = dayData.currentMonth
            ? "text-gray-800"
            : "text-gray-400";

          const esFinDeContrato = eventosDeContrato.some(
            (evento) =>
              evento.fecha_fin &&
              new Date(evento.fecha_fin).getDate() === dayData.day &&
              new Date(evento.fecha_fin).getMonth() === selectedMonth &&
              new Date(evento.fecha_fin).getFullYear() === selectedYear
          );

          if (esFinDeContrato) {
            dayBgClass = "bg-red-100";
            dayTextColor = "text-red-600";
          } else if (
            eventosDeContrato.some(
              (e) =>
                new Date(e.fecha_inicio).getDate() === dayData.day &&
                new Date(e.fecha_inicio).getMonth() === selectedMonth &&
                new Date(e.fecha_inicio).getFullYear() === selectedYear
            )
          ) {
            dayBgClass = "bg-green-100";
          }

          if (!esFinDeContrato) {
            if (eventosEnElDia.length > 0)
              eventIcons.add(<Video className="text-blue-500" />);
            if (eventosDeAsunto.length > 0) {
              for (let evento of eventosDeAsunto) {
                let icon = null;
                if (evento.estado === "terminado" && evento.fecha_terminado)
                  icon = <CalendarCheck2 size={18} className="text-gray-500" />;
                else if (
                  evento.estado === "en proceso" &&
                  evento.fecha_revision
                )
                  icon = <Clock size={18} className="text-gray-500" />;
                else if (
                  evento.estado === "en proceso" &&
                  evento.fecha_estimada
                )
                  icon = <Clock size={18} className="text-gray-500" />;
                else if (
                  evento.estado === "entregado" &&
                  evento.fecha_entregado
                )
                  icon = <NotepadText size={18} className="text-gray-500" />;

                if (icon) {
                  eventIcons.add(icon);
                  break;
                }
              }
            }
          }

          const isActive = isToday || isSelected;
          const activeBg = isToday
            ? "bg-[#4BD7F5]"
            : isSelected
            ? "bg-gray-400"
            : dayBgClass;
          const activeText =
            isToday || isSelected ? "text-white" : dayTextColor;

          return (
            <div
              key={dayIndex}
              onClick={() => handleDayClick(dayData.day, dayData.currentMonth)}
              className="flex flex-col items-center justify-center aspect-square min-w-[36px] sm:min-w-[48px] md:min-w-[60px] xl:min-w-[70px] transition cursor-pointer"
            >
              {tieneEventos || isActive ? (
                <div
                  className={`aspect-square w-full max-w-[50px] sm:max-w-[60px] md:max-w-[70px] rounded-full flex items-center justify-center 
                  text-[18px] sm:text-[20px] md:text-[22px] font-bold ${activeBg} ${activeText}`}
                >
                  {dayData.day}
                </div>
              ) : (
                <div
                  className={`text-[22px] sm:text-[16px] md:text-[28px] font-medium ${dayTextColor}`}
                >
                  {dayData.day}
                </div>
              )}

              {eventIcons.size > 0 && (
                <>
                  {/* Vista móvil: puntos de colores */}
                  <div className="flex gap-[3px] mt-1 sm:hidden">
                    {eventosEnElDia.length > 0 && (
                      <div className="w-[6px] h-[6px] rounded-full bg-blue-500"></div>
                    )}
                    {eventosDeContrato.length > 0 && !esFinDeContrato && (
                      <div className="w-[6px] h-[6px] rounded-full bg-green-500"></div>
                    )}
                    {eventosDeAsunto.length > 0 && (
                      <div className="w-[6px] h-[6px] rounded-full bg-gray-500"></div>
                    )}
                  </div>

                  {/* Vista escritorio: íconos */}
                  <div className="hidden sm:flex justify-center items-center gap-[6px] mt-1">
                    {[...eventIcons].map((icon, index) => (
                      <div
                        key={index}
                        className="text-[8px] md:text-[12px] xl:text-[14px]"
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {esFinDeContrato && (
                <div className="text-[8px] text-center leading-tight mt-[2px] font-medium text-red-500">
                  Fin
                  <br />
                  Contrato
                </div>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <LayoutApp>
      <main className="px-4 sm:px-5 py-5 flex flex-col lg:flex-row gap-6 xl:gap-[60px]">
        {/* Panel Izquierdo: Calendario */}
        <div className="flex flex-col flex-1 lg:w-[60%] items-center">
          <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col gap-4 w-full shadow">
            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center rounded-full text-[11px] sm:text-[14px] md:text-[16px] font-bold text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Días del calendario */}
            {renderCalendarDays(eventos)}
          </div>
        </div>

        {/* Panel Derecho: Detalles */}
        <div className="flex flex-col gap-6 flex-1 xl:w-[40%] bg-white rounded-xl shadow-lg p-4 sm:p-6">
          {/* Encabezado y selects */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
            <p className="font-semibold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] text-gray-800 text-center md:text-left">
              Calendario de actividades
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
              <select
                className="bg-gray-900 text-white font-semibold rounded-md p-2 text-sm sm:text-base w-full sm:w-[120px] h-[35px]"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                className="bg-gray-900 text-white font-semibold rounded-md p-2 text-sm sm:text-base w-full sm:w-[120px] h-[35px]"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {Array.from({ length: 6 }, (_, i) => 2030 - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                onChange={handleChange}
                value={selectedAsesoriaId || ""}
                className="border border-[#b4a6aa] rounded-md p-2 text-sm sm:text-base w-full sm:w-[150px] h-[35px]"
              >
                {asesorias.map((asesoria, index) => (
                  <option key={index} value={asesoria.id}>
                    {asesoria.profesion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha seleccionada */}
          <div className="text-center">
            <p className="text-gray-400 font-medium text-[14px] sm:text-[16px]">
              {dayName}
            </p>
            <h2 className="text-[38px] sm:text-[45px] font-bold text-gray-800">
              {selectedDay}
            </h2>
            <h1 className="text-gray-700 text-[18px] sm:text-[22px] font-semibold">
              {monthName}
            </h1>
          </div>

          {/* Lista de eventos */}
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            {eventosDia.map((evento, index) => {
              let eventColor = "";
              let eventDetails = "";

              if (evento.fecha) {
                eventColor = "";
                eventDetails = (
                  <>
                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                      {new Date(evento.fecha).toLocaleDateString("es-ES")} -{" "}
                      {formatTime(evento.fecha)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      <a
                        href={evento.enlace_zoom}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        Enlace Zoom
                      </a>
                    </p>
                  </>
                );
              } else if (evento.fecha_inicio) {
                eventColor = "bg-green-500";
                eventDetails = (
                  <>
                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                      {new Date(evento.fecha_inicio).toLocaleDateString(
                        "es-ES"
                      )}{" "}
                      - {formatTime(evento.fecha_inicio)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Servicio: {evento.servicio}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Modalidad: {evento.modalidad}
                    </p>
                  </>
                );
              } else {
                eventColor = "bg-red-500";
                eventDetails = (
                  <>
                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                      {evento.fecha_entregado
                        ? new Date(evento.fecha_entregado).toLocaleDateString(
                            "es-ES"
                          )
                        : "Sin fecha"}{" "}
                      -{" "}
                      {evento.fecha_terminado
                        ? formatTime(evento.fecha_terminado)
                        : "Sin hora"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Estado: {evento.estado}
                    </p>
                  </>
                );
              }

              return (
                <div
                  key={index}
                  className={`bg-white flex w-full min-h-[100px] sm:min-h-[121px] gap-4 p-4 sm:p-5 border border-[#E5E7EB] rounded-xl shadow hover:shadow-md transition ${eventColor}`}
                >
                  <div className="flex items-start pt-1">
                    <div className="w-[12px] h-[12px] sm:w-[15px] sm:h-[15px] rounded-full bg-indigo-500 shadow-md"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[18px] sm:text-[20px] font-bold text-gray-800">
                      {evento.titulo}
                    </h2>
                    {eventDetails}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </LayoutApp>
  );
};
export default CalendarioEstudiante;
