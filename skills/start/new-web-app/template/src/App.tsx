import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Item } from "./db";
import { pages } from "./pages";
import { cleanTitle } from "./lib/itemTitle";
import { Icon } from "./ui/Icon";
import { useRoute } from "./ui/route";
import { Settings } from "./Settings";

/** True when a key press is meant for a text field, not a shortcut. */
function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

export function App() {
  const route = useRoute();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<Item | null>(null);
  const items = useLiveQuery(() => db.items.orderBy("createdAt").reverse().toArray(), []);

  const visible = items?.filter((item) => route !== "starred" || item.starred) ?? [];
  const selected = visible.find((item) => item.id === selectedId) ?? null;
  const title = route === "settings" ? "Settings" : pages.find((page) => page.id === route)!.title;

  // The tab title names the content, not only the app.
  useEffect(() => {
    document.title = `${title} - __APP_TITLE__`;
  }, [title]);

  async function addItem() {
    const item: Item = {
      id: crypto.randomUUID(),
      title: cleanTitle(""),
      notes: "",
      starred: route === "starred",
      createdAt: Date.now(),
    };
    await db.items.add(item);
    setSelectedId(item.id);
    setFocusId(item.id);
  }

  async function deleteItem(item: Item) {
    const index = visible.findIndex((row) => row.id === item.id);
    await db.items.delete(item.id);
    // Selection moves to the next row, or the one above at the end.
    const next = visible[index + 1] ?? visible[index - 1] ?? null;
    setSelectedId(next?.id ?? null);
    setDeleted(item);
  }

  async function undoDelete() {
    if (!deleted) return;
    await db.items.add(deleted);
    setSelectedId(deleted.id);
    setDeleted(null);
  }

  // Shortcuts: N adds an item. Browsers keep Ctrl+N, Ctrl+T, and Ctrl+W for
  // themselves, so app shortcuts use single keys outside text fields.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      if (event.key === "n" && route !== "settings") {
        event.preventDefault();
        void addItem();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!deleted) return;
    const timer = setTimeout(() => setDeleted(null), 5000);
    return () => clearTimeout(timer);
  }, [deleted]);

  return (
    <div className={route === "settings" ? "shell settings-open" : "shell"} data-ready={items ? "" : undefined}>
      <nav className="sidebar" aria-label="Pages">
        <p className="sidebar-title">__APP_TITLE__</p>
        {pages.map((page) => (
          <a key={page.id} className="nav-link" href={`#/${page.id}`} aria-current={route === page.id ? "page" : undefined}>
            <Icon name={page.icon} />
            {page.title}
            <span className="nav-count">{items?.filter((item) => page.id !== "starred" || item.starred).length ?? ""}</span>
          </a>
        ))}
        <div className="sidebar-footer">
          <a className="nav-link" href="#/settings" aria-current={route === "settings" ? "page" : undefined}>
            <Icon name="gear" />
            Settings
          </a>
        </div>
      </nav>

      {route === "settings" ? (
        <Settings />
      ) : (
        <>
          <section className="list" aria-labelledby="list-title">
            <header className="list-header">
              <h1 id="list-title">{title}</h1>
              <button className="icon-button" onClick={addItem} title="Add an item to this list (N)" aria-label="Add Item">
                <Icon name="plus" />
              </button>
            </header>
            {items && visible.length === 0 ? (
              <div className="empty">
                <h2>{route === "starred" ? "No Starred Items" : "No Items"}</h2>
                <p>{route === "starred" ? "Star an item to keep it here." : "Items you add appear here."}</p>
                <button className="button primary" onClick={addItem}>
                  Add Item
                </button>
              </div>
            ) : (
              <ul className="rows" role="listbox" aria-label={title}>
                {visible.map((item) => (
                  <li key={item.id}>
                    <button
                      className="row"
                      role="option"
                      aria-selected={item.id === selected?.id}
                      onClick={() => setSelectedId(item.id)}
                      title={item.title}
                    >
                      <span className="row-title">{item.title}</span>
                      {item.starred && <Icon name="star" filled />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <Detail item={selected} autoFocus={selected?.id === focusId} onDelete={deleteItem} />
        </>
      )}

      {deleted && (
        <div className="toast" role="status">
          Deleted "{deleted.title}"
          <button className="button" onClick={undoDelete}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

function Detail({ item, autoFocus, onDelete }: { item: Item | null; autoFocus: boolean; onDelete: (item: Item) => void }) {
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) titleRef.current?.select();
  }, [autoFocus, item?.id]);

  if (!item) {
    return (
      <main className="detail empty">
        <h2>No Item Selected</h2>
        <p>Pick an item to see its details.</p>
      </main>
    );
  }

  return (
    <main className="detail" data-grid-area="page" data-grid-inset="20">
      <div className="detail-body">
        <label className="field" data-grid-probe="title">
          <span className="field-label">Title</span>
          <input
            ref={titleRef}
            className="input input-title"
            value={item.title}
            onChange={(event) => db.items.update(item.id, { title: event.target.value })}
            onBlur={(event) => db.items.update(item.id, { title: cleanTitle(event.target.value) })}
            onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
          />
        </label>
        <label className="field" data-grid-probe="notes">
          <span className="field-label">Notes</span>
          <textarea
            className="input"
            value={item.notes}
            placeholder="Add details, links, or next steps"
            onChange={(event) => db.items.update(item.id, { notes: event.target.value })}
          />
        </label>
        <div className="actions" data-grid-probe="actions">
          <button className="button" onClick={() => db.items.update(item.id, { starred: !item.starred })}>
            <Icon name="star" filled={item.starred} />
            {item.starred ? "Unstar" : "Star"}
          </button>
          <button className="button danger" onClick={() => onDelete(item)}>
            <Icon name="trash" />
            Delete
          </button>
        </div>
      </div>
    </main>
  );
}
