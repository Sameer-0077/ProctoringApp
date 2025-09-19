# 🎯 Focus & Object Detection in Video Interviews

A **video-proctoring web application** built with **React (Vite) +
Tailwind CSS** that detects:

- 👀 **Candidate Focus**\
  _Logs when a candidate looks away from the screen for more than 5
  seconds, is absent for more than 10 seconds, or when multiple faces
  appear._

- 🕵️ **Suspicious Items**\
  _Real-time detection of phones, books, and other electronic devices
  using TensorFlow.js (COCO-SSD)._

- 🎥 **Session Recording**\
  _Records and downloads the interview video directly from the
  browser._

- 📝 **Reporting**\
  _Generates downloadable **PDF/CSV** proctoring reports with event
  logs, session duration, and an integrity score._

---

## ✨ Features

---

Feature Details

---

**Live Video** Candidate video feed using the
browser camera

**Focus Detection** Logs: looking away \> 5 s, no face \>
10 s, multiple faces

**Object Detection** Logs suspicious objects (phone, book,
laptop, etc.) with confidence

**Event Log** Real-time UI list of all detections

**Recording** Start/stop video recording; downloads
as WebM

**Report Generation** PDF/CSV report with candidate name,
interview duration, counts of focus
loss and suspicious events

**Responsive UI** Tailwind CSS for a clean,
mobile-friendly layout

---

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/) +
  [Vite](https://vitejs.dev/) + [Tailwind
  CSS](https://tailwindcss.com/)
- **Focus Detection**: [MediaPipe Face
  Detection](https://developers.google.com/mediapipe)
- **Object Detection**: [TensorFlow.js
  COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
- **Reporting**: [jsPDF](https://github.com/parallax/jsPDF), CSV
  export
- **Video Recording**: Native `MediaRecorder` API

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**

### 1. Clone and Install

```bash
git clone https://github.com/<your-username>/video-proctoring.git
cd video-proctoring
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`) in
Chrome/Edge.

### 3. Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

    src/
     ├─ components/
     │   ├─ VideoFeed.jsx        # Camera preview & controls
     │   ├─ EventLog.jsx         # Real-time event list
     ├─ hooks/
     │   ├─ useFocusDetection.js # Face tracking & looking-away logic
     │   ├─ useObjectDetection.js# TensorFlow.js object detection
     │   └─ useRecorder.js      # MediaRecorder wrapper
     ├─ utils/
     │   └─ reportGenerator.js    # PDF/CSV report creation
     ├─ App.jsx
     └─ main.jsx

---

## 🧩 Usage

1.  **Allow camera access** when prompted.
2.  Click **Start Recording** to begin.
3.  Observe **real-time logs** of focus and object detection.
4.  Click **Stop & Save** to download the WebM video.
5.  Click **Generate Report** to download a PDF/CSV summary.

---

## 📝 Report Contents

The PDF/CSV report includes: \* **Candidate Name**\
\* **Interview Duration**\
\* **Focus Lost Count**\
\* **Suspicious Events Count**\
\* **Final Integrity Score** (100 -- deductions)\
\* **Detailed Event Log**: timestamp, event type, confidence (if
applicable)

---

## 🔒 Privacy & Security

- All detection and recording happen **entirely in the browser**.\
- No data leaves the user's machine unless you later connect a
  backend.

---

## 📌 Next Steps (Optional)

- **Backend Integration (MongoDB)**: store logs & recordings securely.
- **Role-Based Access Control**: limit who can view reports.
- **Email Notifications**: send reports to recruiters automatically.
- **Advanced Detection**: eye closure/drowsiness, audio analysis.

---

## 🖼️ Demo

- Live App: [Deployed Link](https://proc-toring.netlify.app/)

---

## 🧑‍💻 Author

**Sameer Yadav**

---

### License

This project is licensed under the MIT License -- see the
[LICENSE](LICENSE) file for details.
