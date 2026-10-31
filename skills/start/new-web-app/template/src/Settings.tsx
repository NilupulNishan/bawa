import { useState } from "react";
import { accents, loadAccent, saveAccent, type AccentId } from "./ui/theme";

// Settings: one card per topic. Add a card for a new topic, not a new page.
export function Settings() {
  const [accent, setAccent] = useState<AccentId>(loadAccent);

  function choose(id: AccentId) {
    setAccent(id);
    saveAccent(id);
  }

  return (
    <main className="page" data-grid-area="page" data-grid-inset="20">
      <div className="page-body">
        <h1 data-grid-probe="title">Settings</h1>
        <section className="card" aria-labelledby="appearance" data-grid-probe="appearance">
          <h2 id="appearance">Appearance</h2>
          <div className="swatches" role="radiogroup" aria-label="Accent color">
            {accents.map((option) => (
              <button
                key={option.id}
                className="swatch"
                role="radio"
                aria-checked={accent === option.id}
                data-accent={option.id}
                onClick={() => choose(option.id)}
              >
                <span className="swatch-dot" />
                {option.name}
              </button>
            ))}
          </div>
          <p className="hint">Light and dark mode follow your system setting.</p>
        </section>
      </div>
    </main>
  );
}
