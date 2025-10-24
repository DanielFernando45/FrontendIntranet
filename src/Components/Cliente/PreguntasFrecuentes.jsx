// 📁 src/components/cliente/PreguntasFrecuentes.jsx
import PreguntaItem from "./PreguntaItem";

const dataPreguntas = [
  {
    pregunta: "¿Qué pasa si no entrego a tiempo un trabajo o avance?",
    respuesta:
      "Podrás reprogramar la entrega con previa coordinación. Sin embargo, es importante ajustarse al cronograma acordado para evitar retrasos en tu proyecto.",
  },
  {
    pregunta: "¿Puedo actualizar mis datos personales después del registro?",
    respuesta:
      "Sí, puedes modificar tus datos desde tu perfil dentro del plazo de edición establecido. Fuera de ese plazo, debes solicitar el cambio al área administrativa.",
  },
  {
    pregunta: "¿Ofrecen apoyo para todos los grados académicos?",
    respuesta:
      "Sí, brindamos consultoría para tesis y trabajos académicos de pregrado, maestría y doctorado, adaptándonos a los requisitos de cada nivel.",
  },
  {
    pregunta: "¿También realizan trabajos académicos puntuales?",
    respuesta:
      "Sí, además de tesis completas, ofrecemos servicios por entregables específicos, como capítulos, análisis estadístico, correcciones y más.",
  },
  {
    pregunta: "¿Puedo solicitar solo la revisión o corrección de mi tesis?",
    respuesta:
      "Sí, ofrecemos servicios de revisión de estilo, redacción académica, normas APA, así como corrección de fondo y forma.",
  },
  {
    pregunta: "¿Cuánto tiempo tarda el desarrollo de una tesis?",
    respuesta:
      "El tiempo varía según el grado académico y el alcance del proyecto. ",
  },
  {
    pregunta: "¿Cómo se asigna el asesor que me apoyará?",
    respuesta:
      "El asesor es asignado según tu carrera, el tipo de trabajo requerido y tu disponibilidad de horarios, asegurando afinidad temática y metodológica.",
  },
  {
    pregunta: "¿Ofrecen acompañamiento hasta la sustentación?",
    respuesta:
      "Sí, brindamos asesoría completa que incluye preparación para la defensa, simulacros de sustentación y elaboración de diapositivas.",
  },
];

export default function PreguntasFrecuentes() {
  return (
    <div className="flex flex-col overflow-auto">
      {dataPreguntas.map((item, index) => (
        <PreguntaItem
          key={index}
          pregunta={item.pregunta}
          respuesta={item.respuesta}
        />
      ))}
    </div>
  );
}
