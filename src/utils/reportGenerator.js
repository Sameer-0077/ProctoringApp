import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

function normalizeForReport(e) {
  if (!e) return { type: "other", message: "", time: Date.now() };

  // If event already has top-level fields
  if (e.type) {
    return {
      type: e.type,
      message: e.message ?? null,
      label: e.label ?? null,
      confidence:
        typeof e.confidence === "number"
          ? e.confidence
          : e.confidence
          ? Number(e.confidence)
          : null,
      time: e.time ?? e.timestamp ?? Date.now(),
    };
  }

  // If stored as wrapper { message: { ... }, timestamp }
  if (e.message && typeof e.message === "object") {
    const inner = e.message;
    const typeRaw = String(inner.type || "").toLowerCase();
    const type = typeRaw.includes("object")
      ? "object"
      : typeRaw.includes("focus")
      ? "focus"
      : "other";
    return {
      type,
      message: typeof inner.message === "string" ? inner.message : null,
      label: inner.label ?? inner.class ?? null,
      confidence: inner.confidence ?? inner.score ?? null,
      time: inner.time ?? e.timestamp ?? e.time ?? Date.now(),
    };
  }

  // If event is plain string stored with timestamp
  if (typeof e.message === "string" && (e.timestamp || e.time)) {
    return { type: "focus", message: e.message, time: e.timestamp ?? e.time };
  }

  // Fallback
  return {
    type: "other",
    message: e.message ?? JSON.stringify(e),
    time: e.time ?? e.timestamp ?? Date.now(),
  };
}

export function downloadPDF(candidate, startTime, eventsRaw) {
  const events = (eventsRaw || []).map(normalizeForReport);

  const doc = new jsPDF();
  const durationMin =
    ((Date.now() - (startTime || Date.now())) / 1000 / 60).toFixed(1) + " min";

  // Title & metadata
  doc.setFontSize(18);
  doc.text("Proctoring Report", 14, 20);
  doc.setFontSize(12);
  doc.text(`Candidate: ${candidate}`, 14, 32);
  doc.text(`Interview Duration: ${durationMin}`, 14, 40);

  // Summaries
  const focusLost = events.filter((e) => e.type === "focus").length;
  const suspicious = events.filter((e) => e.type === "object").length;
  const integrity = Math.max(0, 100 - focusLost * 5 - suspicious * 10);

  doc.text(`Focus Lost: ${focusLost}`, 14, 48);
  doc.text(`Suspicious Events: ${suspicious}`, 14, 56);
  doc.text(`Final Integrity Score: ${integrity}`, 14, 64);

  // Table rows
  const rows = events.map((e) => {
    const timeStr = new Date(e.time).toLocaleTimeString();
    let eventText = "-";
    let confText = "-";
    if (e.type === "object") {
      eventText = `Object: ${e.label ?? "unknown"}`;
      confText =
        e.confidence != null ? `${(e.confidence * 100).toFixed(1)}%` : "-";
    } else if (e.type === "focus") {
      eventText = e.message ?? "focus event";
    } else {
      eventText = e.message ?? JSON.stringify(e);
    }
    return [timeStr, eventText, confText];
  });

  autoTable(doc, {
    startY: 72,
    head: [["Time", "Event", "Confidence"]],
    body: rows,
  });

  doc.save(`${candidate}_Proctoring_Report.pdf`);
}

export function downloadCSV(candidate, startTime, eventsRaw) {
  const events = (eventsRaw || []).map(normalizeForReport);
  const durationMin =
    ((Date.now() - (startTime || Date.now())) / 1000 / 60).toFixed(1) + " min";

  // Header lines then event lines
  const header = [
    ["Candidate", candidate],
    ["Interview Duration", durationMin],
    [],
  ];
  const rows = events.map((e) => ({
    Time: new Date(e.time).toLocaleTimeString(),
    Type: e.type,
    Event: e.type === "object" ? `Object: ${e.label}` : e.message,
    Confidence:
      e.confidence != null ? `${(e.confidence * 100).toFixed(1)}%` : "",
  }));

  const csvHeader = Papa.unparse(header);
  const csvBody = Papa.unparse(rows);
  const csv = csvHeader + "\n" + csvBody;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${candidate}_Proctoring_Report.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
