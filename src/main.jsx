import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/instrument-serif/400.css";
import '@fontsource/space-grotesk/300.css'
import '@fontsource/space-grotesk/700.css'
import "@fontsource/instrument-serif/400-italic.css";
import { createRoot } from "react-dom/client";
import { LucideProvider } from "lucide-react";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <LucideProvider>
    <App />
  </LucideProvider>,
);
