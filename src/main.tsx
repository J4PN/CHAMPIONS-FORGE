import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LangProvider } from "@/lib/i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangProvider>
        <App />
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// Auto-reload when a lazy chunk fails to load (happens after deploys
// when the browser has cached old HTML pointing to deleted JS chunks).
window.addEventListener("error", (e) => {
  const msg = e.message ?? "";
  if (
    msg.includes("dynamically imported module") ||
    msg.includes("Loading chunk") ||
    msg.includes("Failed to fetch")
  ) {
    // Only reload once to avoid infinite loops
    const key = "pokecounter.chunkReload";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      window.location.reload();
    }
  }
});

// Clear the reload guard on successful load
sessionStorage.removeItem("pokecounter.chunkReload");

// Register service worker (self-unregistering — cleans up old caches)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* noop */
    });
  });
}
