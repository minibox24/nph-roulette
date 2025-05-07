import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// `/effect.webm` video preload
const video = document.createElement("video");
video.src = "/effect.webm";
video.preload = "auto";
video.muted = true;
video.autoplay = true;
video.style.display = "none";
document.body.appendChild(video);

// `/button.webm` audio preload
const audio = document.createElement("audio");
audio.src = "/button.webm";
audio.preload = "auto";
audio.muted = true;
audio.autoplay = true;
audio.style.display = "none";
document.body.appendChild(audio);

createRoot(document.getElementById("root")!).render(<App />);
