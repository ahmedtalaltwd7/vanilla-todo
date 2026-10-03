# Ed's Todo List

A lightweight to-do app built with **pure vanilla JavaScript** — no frameworks,
no build step. Todos (and their completion state) persist in `localStorage`,
so your list survives page reloads.

## Features

- ➕ Add todos (empty/whitespace-only input is rejected)
- ✅ Mark todos as completed (state is saved and restored on reload)
- 🗑️ Delete todos with a fall-away animation (handles duplicate texts correctly)
- 🔍 Filter by All / Completed / Uncompleted
- 💾 Persistence via `localStorage` (stored as `{ text, completed }` objects)
- ♿ Accessible: proper labels, `aria-label`s, and `prefers-reduced-motion` support

## Getting started

No installation required. Either:

1. Open `index.html` directly in a browser, or
2. Serve the folder locally:

   ```bash
   # Python
   python3 -m http.server 8000
   # or Node
   npx serve .
   ```

   Then visit http://localhost:8000.

> Note: icons and fonts are loaded from CDNs (Font Awesome / Google Fonts),
> so an internet connection is needed for full styling.

## Project structure

```
.
├── index.html   # Markup
├── style.css    # Styles + animations
└── app.js       # State management + DOM logic
```

## How it works

- `app.js` keeps all state in `localStorage` under the `todos` key.
- A single `createTodoElement()` builder is used both when adding new items
  and when restoring them on load (no duplicated DOM code).
- Event delegation on the todo list handles complete/trash clicks.
- User text is always inserted with `innerText`, never `innerHTML`.

## Ideas for improvement

- Drag-and-drop reordering
- Due dates / priorities
- An "edit text" mode for existing todos
- Unit tests for the storage helpers (e.g. with Vitest + jsdom)

## Credits

Originally based on the FreeCodeCamp vanilla-JS todo tutorial, then refactored
to fix persistence bugs, remove code duplication, and improve accessibility.
