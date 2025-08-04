export default function ErrorScreen() {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80"
          alt="error background"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
        />
  
        <div className="relative z-10 text-center px-6 animate-fade-in-up">
          <h1 className="text-6xl font-bold text-white mb-4">¡Oops! Página no encontrada</h1>
          <p className="text-xl text-gray-200 mb-6">
            Parece que te perdiste en el ciberespacio. Pero no te preocupes, ¡te ayudamos a volver!
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="text-white text-lg px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300"
          >
            Volver al inicio
          </button>
        </div>
  
        <div className="absolute bottom-4 text-white text-sm z-10">
          Imagen de fondo por Unsplash
        </div>
  
        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
  
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }
  