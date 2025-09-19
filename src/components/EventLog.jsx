import React from "react";

export default function EventLog({ events = [] }) {
  return (
    <div className="w-full max-w-md mt-4 bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-2">Event Log</h2>
      <ul className="space-y-1 text-sm text-gray-800">
        {events.length === 0 && <li>No events yet</li>}

        {events.map((e, i) => {
          const time = new Date(e.time || Date.now()).toLocaleTimeString();
          if (e.type === "object") {
            const conf =
              e.confidence != null
                ? `${(e.confidence * 100).toFixed(1)}%`
                : "-";
            return (
              <li key={i}>
                <span className="text-gray-500 mr-2">{time} –</span>
                object-detected: {e.label || "unknown"} ({conf})
              </li>
            );
          }
          if (e.type === "focus") {
            return (
              <li key={i}>
                <span className="text-gray-500 mr-2">{time} –</span>
                {e.message}
              </li>
            );
          }
          // other / fallback
          return (
            <li key={i}>
              <span className="text-gray-500 mr-2">{time} –</span>
              {e.message ?? JSON.stringify(e)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
