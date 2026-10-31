---
name: web-integrations
description: Browser integrations for a web app that reach outside the tab, such as install as an app (PWA), offline with a service worker, persistent storage, export and import, files, clipboard, notifications, share, and the permission each one needs. Use when an app must work offline, install to the home screen or Dock, save or open files, or talk to the operating system.
---

# Web integrations

A web app feels like a real app when it installs, works offline, keeps its
data, and opens and saves files. Each integration below says what it
needs, where it works, and how to check it.

Check support before you build on an API: [MDN](https://developer.mozilla.org)
and [caniuse](https://caniuse.com). Every feature that Safari or Firefox
lacks gets a fallback, or the brief says "Chrome only".

## Rules for every integration

- Ask for a permission at the moment people use the feature, after a click.
  Never on page load. Browsers block or quiet prompts that come with no
  click.
- Show why first: one line in the app ("Notifications tell you when a task
  is due"), then the browser prompt.
- Handle "denied" without nagging. Show how to turn it on in the browser,
  once, and keep the app working without it.
- Most of these APIs need a secure context: `https://` or `localhost`.

## Install as an app (PWA)

The template has `public/manifest.webmanifest` and an icon. To install:

1. Add PNG icons: call the Skill tool with `app-icon`.
2. Add a service worker (next section). Chrome needs one to offer install.
3. Check: `npm run build && npm run preview`, open the page in Chrome, and
   the install button shows in the address bar.

## Offline

Cache the app shell with a service worker, so the app opens with no
network. Data is already local in IndexedDB.

- The simplest way: the `vite-plugin-pwa` package with `registerType:
  "autoUpdate"`. It writes the service worker and the precache list from
  the build.
- Tell people when a new version is ready, with a "Reload" button. Never
  reload under them while they type.
- Check: in the Playwright self-test, load the page, then
  `context.setOffline(true)`, reload, and expect the shell to render.

## Keep the data

Browsers can clear IndexedDB when the disk runs low. Ask to keep it:

```ts
const kept = await navigator.storage.persist();
```

Call it after the person saves their first item. Chrome grants it to
installed and often used sites without a prompt. Show the result in
Settings ("Data is kept on this device" or "The browser may clear data
when space runs low").

Export and import are the real backup. Every app with data gets both in
Settings: export writes all tables as one JSON file with a version number;
import checks the version and the shape before it writes anything.

## Files

| Need | API | Support |
| --- | --- | --- |
| Save a file | An `<a download>` link with a `Blob` URL | Everywhere |
| Open a file | `<input type="file">` | Everywhere |
| Save again to the same file, open a folder | File System Access (`showSaveFilePicker`, `showDirectoryPicker`) | Chrome and Edge only |
| Drop a file on the page | `dragover` and `drop` events, `event.dataTransfer.files` | Everywhere |

Build on the "everywhere" row first. Add File System Access on top where
it exists.

## Clipboard

- Copy: `navigator.clipboard.writeText(text)` in a click handler. Show
  "Copied" for a second.
- Paste: listen for the `paste` event on the field or the page. Reading the
  clipboard without a paste (`readText`) asks for a permission. Avoid it.

## Notifications

Local notifications while the app is open: `Notification.requestPermission()`
after a click, then `new Notification(title, { body })`. Reminders while
the app is closed need push from a server, which a local-first app does
not have. Say so in the brief, or schedule nothing the app cannot keep.

## Share

`navigator.share({ title, text, url })` opens the system share sheet on
phones, Safari, and Windows. Hide the Share button where
`navigator.share` is missing, and offer Copy Link there.

## Keyboard and the OS

- `navigator.keyboard`, global shortcuts outside the browser, and the
  menu bar are not available to a web app. A shortcut works only while the
  tab has focus.
- Installed PWAs can add `shortcuts` to the manifest: right-click menu
  entries on the Dock or taskbar icon.

Done when each integration the brief lists works in Chrome, has a fallback
or a "Chrome only" note for Safari and Firefox, asks for its permission
after a click, and has a self-test or a named manual check.
