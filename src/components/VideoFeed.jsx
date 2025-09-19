import { forwardRef, useEffect } from "react";

const VideoFeed = forwardRef(function VideoFeed(_, videoRef) {
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    startCamera();
  }, [videoRef]);

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        className="w-[640px] h-[480px] bg-black rounded-lg"
      />
    </div>
  );
});

export default VideoFeed;
