import ReactPlayer from "react-player";

const VideoPlayer = ({ urlVideo }) => {
  return (
    <iframe
      src={`${urlVideo}`}
      allow="autoplay; fullscreen; picture-in-picture"
      className="block w-full h-full"
    //   allowFullScreen
      style={{
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // width: '100%',
        // height: '100%',
      }}
      title="Vimeo video"
    />
  );
};

export default VideoPlayer;
