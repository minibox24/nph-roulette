import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// `/effect.webm` preload
const video = document.createElement("video");
video.src = "/effect.webm";
video.preload = "auto";
video.muted = true;
video.autoplay = true;
video.style.display = "none";
document.body.appendChild(video);

createRoot(document.getElementById("root")!).render(<App />);
