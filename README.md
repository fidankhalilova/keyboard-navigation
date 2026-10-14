# Custom Keyboard Navigation: Multi-level Menu

Next.js (App Router, TS) + Tailwind. No accessibility libraries or extra packages.
Implements the WAI-ARIA Authoring Practices **Menu Button** pattern with nested submenus.

## Usage
```tsx
<DropdownMenu label="File" items={items} onSelect={(item) => ...} />
// items: { id, label, disabled?, items?: [...] }  (items = submenu, any depth)
```

## Keyboard (follows APG, no invented bindings)
| Key | Behaviour |
|---|---|
| ↓ / ↑ on the button | Open, focus first / last item |
| ↓ / ↑ in a menu | Next / previous item, wrapping |
| Home / End | First / last item |
| → | Open submenu (focus its first item) |
| ← | Close submenu, focus returns to the parent item |
| Enter / Space | Open submenu or select item, then close the menu and focus the button |
| Escape | Close the current level; focus returns to its parent item or the button |
| Letters | Type-ahead; buffer clears after 500 ms |
| Tab / Shift+Tab | Closes the menu and moves on (the widget is a single tab stop) |

## Accessibility decisions
- **Roving tabindex with real DOM focus:** the active item has `tabIndex=0`, all others `-1`, and an effect focuses
  the active item. `aria-activedescendant` is not used, so the two techniques are never mixed.
- **Roles and state:** `role="menu"`, `role="menuitem"`, `role="none"` on the `<li>` wrappers, `aria-haspopup`,
  `aria-expanded`, `aria-controls`, `aria-labelledby` (the trigger or the parent item), and `aria-disabled`
  (disabled items stay focusable, as in APG).
- **Announcements:** a persistent `role="status"` live region reports open, close, submenu open/close and selection.
  It is cleared before each message so repeated messages are announced again. The demo also shows the text on screen.
- **Keys:** only handled keys call `preventDefault()` (so the page doesn't scroll), Tab is never swallowed, and
  Ctrl/Meta/Alt shortcuts are ignored. Keys from a submenu bubble up the DOM, so each menu only handles events
  whose target is its own item.
- **Focus indicator:** a filled background plus an inner outline on the focused item, and a `focus-visible` ring on
  buttons. Nothing uses `outline: none`.
- **Scroll follows focus:** `scrollIntoView({ block: "nearest" })`.
- **Semantic markup:** a real `<button>` trigger and `<ul>`/`<li>` structure. Menu items are `div`s with
  `role="menuitem"`: a `<button>` would also fire `click` on Space keyup in some browsers, causing double activation.

## When `role="menu"` is the wrong tool
APG warns that `role="menu"` is for application-style menus (actions), not for website navigation or option pickers.
For site navigation use a disclosure pattern (`<button aria-expanded>` + a list of links). For choosing a value,
use a native `<select>` or the listbox pattern. Native elements give correct keyboard and screen reader behaviour
for free, so a custom widget is only justified when they cannot express the interaction.

## Testing
- Keyboard only: Tab → File → ↓ → type "sh" → → → ↓ ↓ → Enter, then Tab through the page.
- Check that Escape from a submenu returns to its parent item and that Tab from a submenu skips to "After".
- VoiceOver (Cmd+F5) or NVDA: confirm roles, expanded state and the announcements.