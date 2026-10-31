import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { applyAccent, loadAccent } from "./ui/theme";
import { seedIfRequested } from "./seed";
import "./ui/tokens.css";
import "./ui/app.css";

applyAccent(loadAccent());

// Seed data only fills an empty test store (?store=<name>&seed=1). Render
// after it, so snapshots never catch a half-filled list.
seedIfRequested().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
