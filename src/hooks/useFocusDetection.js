import { useEffect, useRef } from "react";
import * as mpFaceDetection from "@mediapipe/face_detection";
import * as cam from "@mediapipe/camera_utils";

export default function useFocusDetection(videoRef, onEvent) {
  const timers = useRef({ lookAway: null, noFace: null });

  useEffect(() => {
    if (!videoRef.current) return;

    const fd = new mpFaceDetection.FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    fd.setOptions({ model: "short", minDetectionConfidence: 0.5 });

    fd.onResults((results) => {
      const faces = results.detections?.length || 0;
      //   console.log("Faces detected:", faces, results.detections);

      // Multiple faces
      if (faces > 1) onEvent("Multiple faces detected");

      // No face >10s
      if (faces === 0) {
        if (!timers.current.noFace) {
          timers.current.noFace = setTimeout(
            () => onEvent("No face detected >10s"),
            10_000
          );
        }
      } else {
        clearTimeout(timers.current.noFace);
        timers.current.noFace = null;
      }

      // Looking away >5s
      if (faces === 1) {
        const det = results.detections[0];
        const box =
          det?.locationData?.relativeBoundingBox ||
          det?.boundingBox || // fallback if MediaPipe returns 'boundingBox'
          null;

        if (!box) return; // skip if no bounding box

        const xCenter = box.xmin + box.width / 2;
        const yCenter = box.ymin + box.height / 2;

        const inside =
          xCenter > 0.3 && xCenter < 0.7 && yCenter > 0.3 && yCenter < 0.7;

        if (!inside) startTimer();
        else clearTimer();
      }
    });

    const startTimer = () => {
      if (!timers.current.lookAway) {
        timers.current.lookAway = setTimeout(() => {
          onEvent("User looking away >5s");
          timers.current.lookAway = null;
        }, 5000);
      }
    };

    const clearTimer = () => {
      if (timers.current.lookAway) {
        clearTimeout(timers.current.lookAway);
        timers.current.lookAway = null;
      }
    };

    const camera = new cam.Camera(videoRef.current, {
      onFrame: async () => {
        await fd.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start().then(() => console.log("Camera started"));

    return () => {
      camera.stop();
      clearTimeout(timers.current.lookAway);
      clearTimeout(timers.current.noFace);
    };
  }, [videoRef, onEvent]);
}
