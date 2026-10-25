import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LucideProvider } from "lucide-react";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <LucideProvider>
    <App />
  </LucideProvider>,
);
