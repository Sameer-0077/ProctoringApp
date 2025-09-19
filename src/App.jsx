import { useRef, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import EventLog from "./components/EventLog";
import useFocusDetection from "./hooks/useFocusDetection";
import useObjectDetection from "./hooks/useObjectDetection";
import useRecorder from "./hooks/useRecorder";
import { downloadPDF, downloadCSV } from "./utils/reportGenerator";

/**
 * Normalizes incoming messages (string or objects) into a uniform event:
 * { type: "focus" | "object" | "other",
 *   message?: string,
 *   label?: string,
 *   confidence?: number,    // 0..1
 *   time: <ms-timestamp>
 * }
 */
function normalizeEvent(msg) {
  // string -> focus event
  if (typeof msg === "string") {
    return { type: "focus", message: msg, time: Date.now() };
  }

  // already normalized (best case)
  if (
    msg &&
    typeof msg === "object" &&
    (msg.type || msg.label || msg.message)
  ) {
    const typeRaw = String(msg.type || "").toLowerCase();
    let type = "other";
    if (
      typeRaw.includes("object") ||
      typeRaw.includes("detected") ||
      typeRaw.includes("phone") ||
      typeRaw.includes("book")
    )
      type = "object";
    if (
      typeRaw.includes("focus") ||
      typeRaw.includes("looking") ||
      typeRaw.includes("no face") ||
      typeRaw.includes("absent")
    )
      type = "focus";

    // try to extract label/confidence/time from multiple possible keys
    const label =
      msg.label ||
      msg.class ||
      (msg.message && typeof msg.message === "object" && msg.message.label) ||
      null;
    const confidence =
      msg.confidence ??
      msg.score ??
      (msg.message && msg.message.confidence) ??
      null;
    const message =
      typeof msg.message === "string" ? msg.message : msg.msg || null;
    const time = msg.time ?? msg.timestamp ?? Date.now();

    return { type, label, confidence, message, time };
  }

  // fallback - unknown shape
  return { type: "other", message: JSON.stringify(msg), time: Date.now() };
}

export default function App() {
  const videoRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [candidate, setCandidate] = useState("");
  const [startTime] = useState(Date.now());
  const { isRecording, recordedUrl, startRecording, stopRecording } =
    useRecorder();

  const logEvent = (msg) => {
    const ev = normalizeEvent(msg);
    console.log("LOGGED EVENT:", ev);
    setEvents((prev) => [...prev, ev]);
  };

  // Pass the ref to the video feed and the same logger to both hooks
  useFocusDetection(videoRef, logEvent);
  useObjectDetection(videoRef, logEvent);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold my-4">Video Interview Proctoring</h1>

      <input
        className="border p-2 mb-4 rounded"
        value={candidate}
        onChange={(e) => setCandidate(e.target.value)}
        placeholder="Enter Your Name"
      />

      <div className="flex justify-center items-center gap-2">
        <VideoFeed ref={videoRef} />
        <div className="mt-4 space-x-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded text-white ${
              isRecording ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>

          {recordedUrl && (
            <div>
              <video
                src={recordedUrl}
                controls
                style={{ width: "400px", marginTop: "1rem" }}
              />
              <br />
              <a
                className="px-4 py-2 bg-green-600 text-white rounded"
                href={recordedUrl}
                download="recording.webm"
              >
                Download Video
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex space-x-3 items-center">
        <p className="text-gray-700 font-semibold text-2xl">Reports {"-->"}</p>
        <button
          onClick={() => downloadPDF(candidate, startTime, events)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
        <button
          onClick={() => downloadCSV(candidate, startTime, events)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download CSV
        </button>
      </div>
      <EventLog events={events} />
    </div>
  );
}
