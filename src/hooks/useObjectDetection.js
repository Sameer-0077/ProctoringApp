import { useEffect } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export default function useObjectDetection(videoRef, addLog) {
  useEffect(() => {
    let model;
    let interval;

    const load = async () => {
      model = await cocoSsd.load();
      interval = setInterval(async () => {
        if (!videoRef.current) return;
        const preds = await model.detect(videoRef.current);

        preds.forEach((p) => {
          const label = p.class.toLowerCase();
          const score = p.score;
          if (
            score > 0.6 &&
            ["cell phone", "book", "laptop", "tv", "remote"].includes(label)
          ) {
            addLog({
              type: "object-detected",
              label,
              confidence: score.toFixed(2),
              time: new Date().toISOString(),
            });
          }
        });
      }, 1000);
    };

    load();
    return () => clearInterval(interval);
  }, [videoRef, addLog]);
}
