"use client";

import { useState } from "react";
import { DropdownMenu } from "./DropdownMenu";
import type { MenuItemData } from "./types";

const ITEMS: MenuItemData[] = [
  { id: "new", label: "New file" },
  {
    id: "recent",
    label: "Open recent",
    items: [
      { id: "alpha", label: "Project Alpha" },
      { id: "beta", label: "Project Beta" },
      { id: "gamma", label: "Project Gamma" },
    ],
  },
  {
    id: "share",
    label: "Share",
    items: [
      { id: "email", label: "Email" },
      { id: "link", label: "Copy link" },
      {
        id: "social",
        label: "Social",
        items: [
          { id: "mastodon", label: "Mastodon" },
          { id: "bluesky", label: "Bluesky" },
        ],
      },
    ],
  },
  { id: "save", label: "Save" },
  { id: "export", label: "Export as PDF", disabled: true },
  { id: "print", label: "Print" },
];

const KEYS: [string, string][] = [
  ["↓ / ↑", "Move between items (wraps around). On the button: open the menu."],
  ["Home / End", "Jump to the first / last item"],
  ["→, Enter or Space", "Open a submenu, or activate the item"],
  ["←", "Close the submenu and return to its parent item"],
  ["Escape", "Close the submenu or menu; focus returns"],
  ["A–Z", "Type-ahead: jump to the next item starting with the typed text (resets after 0.5 s)"],
  ["Tab / Shift+Tab", "Close the menu and continue to the next / previous control"],
];

const plainButton =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800";

export function Demo() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start gap-3">
        <button type="button" className={plainButton}>
          Before
        </button>
        <DropdownMenu label="File" items={ITEMS} onSelect={(item) => setLast(item.label)} showAnnouncements />
        <button type="button" className={plainButton}>
          After
        </button>
      </div>

      <p className="text-sm">
        Last selected: <strong>{last ?? "nothing yet"}</strong>
      </p>

      <section aria-labelledby="keys-heading">
        <h2 id="keys-heading" className="mb-2 text-lg font-semibold">
          Keyboard reference
        </h2>
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[11rem_1fr]">
          {KEYS.map(([key, action]) => (
            <div key={key} className="contents">
              <dt className="font-mono font-medium">{key}</dt>
              <dd className="text-zinc-600 dark:text-zinc-400">{action}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}