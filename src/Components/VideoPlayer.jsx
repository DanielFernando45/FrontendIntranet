import ReactPlayer from "react-player";

const VideoPlayer = ({ urlVideo }) => {
  return (
    <iframe
      src={`${urlVideo}`}
      allow="autoplay; fullscreen; picture-in-picture"
      className="block w-full h-full"
      style={{
        border: "none", // Eliminar borde
        borderRadius: "8px", // Bordes redondeados
      }}
      title="Video"
    />
  );
};

export default VideoPlayer;
