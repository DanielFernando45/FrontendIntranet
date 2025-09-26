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

const CalendarioAsesor = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [calendarDays, setCalendarDays] = useState([]);
  const [monthName, setMonthName] = useState("");
  const [dayName, setDayName] = useState("");
  const [asesorias, setAsesorias] = useState([]);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);
  const [eventosDia, setEventosDia] = useState([]);
  const [fechaVencimiento, setFechaVencimiento] = useState(null);
  const [eventos, setEventos] = useState({
    reuniones: [],
    contratos: [],
    asuntos: [],
  });

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      const id = user.id_asesor;
      fetch(
        `${
          import.meta.env.VITE_API_PORT_ENV
        }/asesor/asesoramientosYDelegado/${id}`
      )
        .then((res) => res.json())
        .then((data) => {
          const asesoriasArray = Object.values(data).map((item) => ({
            id: item.id_asesoramiento,
            profesion: item.profesion_asesoria,
            delegado: item.delegado,
          }));
          setAsesorias(asesoriasArray);
          if (asesoriasArray.length > 0) {
            setSelectedAsesoriaId(asesoriasArray[0].id);
          }
        })
        .catch((error) => console.error("Error al obtener asesorías:", error));
    }
  }, []);

  useEffect(() => {
    if (selectedAsesoriaId) {
      fetchEventosDia();
      fetchFechaVencimiento();
    }
  }, [selectedAsesoriaId, selectedYear, selectedMonth, selectedDay]);

  const fetchFechaVencimiento = () => {
    fetch(
      `${
        import.meta.env.VITE_API_PORT_ENV
      }/asesoramiento/vencimiento/${selectedAsesoriaId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.fecha_fin) {
          const fecha = new Date(data.fecha_fin);
          setFechaVencimiento({
            day: fecha.getUTCDate(),
            month: fecha.getUTCMonth(),
            year: fecha.getUTCFullYear(),
          });
        }
      })
      .catch((error) =>
        console.error("Error al obtener fecha de vencimiento:", error)
      );
  };

  const fetchEventosDia = () => {
    fetch(
      `${
        import.meta.env.VITE_API_PORT_ENV
      }/common/calendario_asesor/${selectedAsesoriaId}`
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

  const handleChange = (e) => setSelectedAsesoriaId(e.target.value);

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
  const daysOfWeek = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

  useEffect(() => {
    generateCalendar();
  }, [selectedMonth, selectedYear, fechaVencimiento]);

  const generateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const prevMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();
    let days = [];
    for (let i = startDay - 1; i >= 0; i--)
      days.push({ day: prevMonthDays - i, currentMonth: false });
    for (let i = 1; i <= totalDays; i++) {
      const isVencimiento =
        fechaVencimiento &&
        i === fechaVencimiento.day &&
        selectedMonth === fechaVencimiento.month &&
        selectedYear === fechaVencimiento.year;
      days.push({
        day: i,
        currentMonth: true,
        isToday:
          i === new Date().getDate() &&
          selectedMonth === new Date().getMonth() &&
          selectedYear === new Date().getFullYear(),
        isVencimiento,
      });
    }
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++)
      days.push({ day: i, currentMonth: false });
    setCalendarDays(days);
    setMonthName(months[selectedMonth]);
    updateSelectedDayInfo(selectedDay);
  };

  const updateSelectedDayInfo = (day) => {
    const date = new Date(selectedYear, selectedMonth, day);
    const dayName = new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
    }).format(date);
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

  const renderCalendarDays = () => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7)
      weeks.push(calendarDays.slice(i, i + 7));
    return weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="flex gap-2 w-full">
        {week.map((dayData, dayIndex) => {
          const isSelected =
            dayData.currentMonth && dayData.day === selectedDay;

          const isToday = dayData.isToday;
          const isVencimiento = dayData.isVencimiento;
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
          const hasEventos =
            eventosEnElDia.length > 0 || eventosDeAsunto.length > 0;
          let eventIcons = new Set();
          let dayColor = "";
          let dayText = "";
          eventosDeContrato.forEach((evento) => {
            if (
              evento.fecha_fin &&
              new Date(evento.fecha_fin).getDate() === dayData.day &&
              new Date(evento.fecha_fin).getMonth() === selectedMonth &&
              new Date(evento.fecha_fin).getFullYear() === selectedYear
            ) {
              dayColor = "bg-[#E9E7E7] text-red-500"; // cambia fondo y texto
              dayText = { label: "Fin contrato", textColor: "text-red-500" };
            } else if (
              new Date(evento.fecha_inicio).getDate() === dayData.day &&
              new Date(evento.fecha_inicio).getMonth() === selectedMonth &&
              new Date(evento.fecha_inicio).getFullYear() === selectedYear &&
              dayColor !== "text-red-500"
            ) {
              dayColor = "bg-[#E9E7E7] text-green-500";
              dayText = {
                label: "Inicio contrato",
                textColor: "text-green-500",
              };
            }
          });
          if (eventosEnElDia.length > 0)
            eventIcons.add(<Video className="text-blue-500" />);
          if (eventosDeAsunto.length > 0) {
            for (let evento of eventosDeAsunto) {
              let icon = null;
              if (
                evento.estado === "terminado" &&
                evento.fecha_terminado &&
                !icon
              )
                icon = <CalendarCheck2 className="text-gray-500" />;
              else if (
                evento.estado === "en proceso" &&
                evento.fecha_revision &&
                !icon
              )
                icon = <Clock className="text-gray-500" />;
              else if (
                evento.estado === "en proceso" &&
                evento.fecha_estimada &&
                !icon
              )
                icon = <Clock className="text-gray-500" />;
              else if (
                evento.estado === "entregado" &&
                evento.fecha_entregado &&
                !icon
              )
                icon = <NotepadText className="text-gray-500" />;
              if (icon) {
                eventIcons.add(icon);
                break;
              }
            }
          }
          return (
            <div
              key={dayIndex}
              onClick={() => handleDayClick(dayData.day, dayData.currentMonth)}
              className={`flex justify-center items-center rounded-full flex-1 lg:w-[60px] lg:h-[60px] xl:w-[85px] xl:h-[85px] xl:text-[22px] cursor-pointer transition ${
                dayData.currentMonth ? "bg-white" : "text-gray-300"
              } relative`}
            >
              <div
                className={`text-[16px] font-semibold text-black rounded-full w-[40px] h-[40px] flex justify-center items-center
                  ${isToday ? "bg-[#4BD7F5]" : ""}
                  ${isSelected ? "bg-gray-300" : ""}
                  ${!isToday && !isSelected && hasEventos ? "bg-[#E9E7E7]" : ""}
                  ${!isToday && !isSelected && !hasEventos ? dayColor : ""}
                `}
              >
                {dayData.day}
              </div>
              {dayText && (
                <div
                  className={`absolute bottom-0 text-sm font-semibold ${
                    dayText.textColor || "text-gray-600"
                  }`}
                >
                  {dayText.label}
                </div>
              )}
              {eventIcons.size > 0 && (
                <div className="absolute mt-12 flex gap-1 left-1/2 transform -translate-x-1/2">
                  {[...eventIcons].map((icon, index) => (
                    <div key={index} className="w-[20px] h-[20px]">
                      {icon}
                    </div>
                  ))}
                </div>
              )}
              {isVencimiento && (
                <div className="absolute mt-12 text-[10px] font-semibold text-red-500">
                  Contrato Finalizado
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
      <main className="sm:m-5 flex flex-col lg:flex-row gap-10 xl:gap-[60px]">
        <div className="flex flex-col flex-1 lg:w-[60%] justify-center items-center">
        
          <div className="bg-white rounded-xl p-4 flex flex-col gap-4 w-full shadow">
            <div className="flex gap-2">
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center rounded-full flex-1 lg:w-[60px] xl:w-[85px] xl:h-[35px] xl:text-[16px] font-semibold text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>
            {renderCalendarDays()}
          </div>
        </div>
        <div className="flex flex-col h-full justify-center p-5 gap-8 flex-1 xl:w-[40%] bg-white rounded-xl shadow-lg">
            <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row w-full justify-between mb-10 items-center shadow">
            <p className="font-semibold text-[20px] text-gray-800">
              Calendario de actividades
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="bg-gray-900 w-full p-[5px] rounded-lg text-white sm:w-[120px] h-[35px] font-semibold"
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
                className="bg-gray-900 p-[5px] w-full rounded-lg text-white sm:w-[120px] h-[35px] font-semibold"
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
                className="border-2 rounded-md px-2 border-gray-700 font-medium"
                onChange={handleChange}
                value={selectedAsesoriaId || ""}
              >
                {asesorias.map((asesoria, index) => (
                  <option key={index} value={asesoria.id}>
                    {asesoria.delegado}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 font-medium text-[18px]">{dayName}</p>
            <h2 className="text-[45px] font-bold text-gray-800">
              {selectedDay}
            </h2>
            <h1 className="text-gray-700 text-[22px] font-semibold">
              {monthName}
            </h1>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[330px]">
            {eventosDia.map((evento, index) => {
              let eventColor = "";
              let eventDetails = "";
              if (evento.fecha) {
                eventColor = "bg-blue-500";
                eventDetails = (
                  <>
                    <p className="text-gray-600 font-medium">
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
                    <p className="text-gray-600 font-medium">
                      {new Date(evento.fecha_inicio).toLocaleDateString(
                        "es-ES"
                      )}{" "}
                      - {formatTime(evento.fecha_inicio)}
                    </p>
                    <p className="text-gray-500">Servicio: {evento.servicio}</p>
                    <p className="text-gray-500">
                      Modalidad: {evento.modalidad}
                    </p>
                  </>
                );
              } else {
                eventColor = "bg-red-500";
                eventDetails = (
                  <>
                    <p className="text-gray-600 font-medium">
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
                    <p className="text-gray-400">Estado: {evento.estado}</p>
                  </>
                );
              }
              return (
                <div
                  key={index}
                  className={`bg-white flex w-full min-h-[121px] gap-4 p-5 border border-[#E5E7EB] rounded-xl shadow hover:shadow-md transition ${eventColor}`}
                >
                  <div className="flex items-start pt-1">
                    <div className="w-[15px] h-[15px] rounded-full bg-indigo-500 shadow-md"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[22px] font-bold text-gray-800">
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

export default CalendarioAsesor;
