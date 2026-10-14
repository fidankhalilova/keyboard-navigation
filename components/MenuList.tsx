"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { MenuItemData } from "./types";

const TYPEAHEAD_RESET_MS = 500;

const itemClass = [
  "flex cursor-pointer select-none items-center justify-between gap-6 px-3 py-1.5 text-sm",
  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
  "aria-expanded:bg-zinc-100 dark:aria-expanded:bg-zinc-800",
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
  "focus:bg-indigo-600 focus:text-white focus:outline-2 focus:-outline-offset-2 focus:outline-white",
].join(" ");

interface MenuListProps {
  items: MenuItemData[];
  labelledBy: string;
  id?: string;
  nested?: boolean;
  initialFocus?: "first" | "last";
  announce: (message: string) => void;
  onSelect: (item: MenuItemData) => void;
  onClose: () => void;
  onDismiss: () => void;
}

export function MenuList({
  items,
  labelledBy,
  id,
  nested = false,
  initialFocus = "first",
  announce,
  onSelect,
  onClose,
  onDismiss,
}: MenuListProps) {
  const baseId = useId();
  const [active, setActive] = useState(initialFocus === "last" ? items.length - 1 : 0);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buffer = useRef("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (openSub !== null) return;
    const el = itemRefs.current[active];
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ block: "nearest" });
  }, [active, openSub]);

  const move = (to: number) => setActive((to + items.length) % items.length);

  function typeAhead(char: string) {
    window.clearTimeout(timer.current);
    buffer.current += char.toLowerCase();
    timer.current = window.setTimeout(() => {
      buffer.current = "";
    }, TYPEAHEAD_RESET_MS);

    const start = buffer.current.length === 1 ? active + 1 : active;
    for (let i = 0; i < items.length; i++) {
      const index = (start + i) % items.length;
      if (items[index].label.toLowerCase().startsWith(buffer.current)) {
        setActive(index);
        return;
      }
    }
  }

  function openSubmenu(index: number) {
    const item = items[index];
    if (!item.items || item.disabled) return;
    setActive(index);
    setOpenSub(index);
    announce(`${item.label} submenu opened, ${item.items.length} items`);
  }

  function closeSubmenu() {
    if (openSub === null) return;
    announce(`${items[openSub].label} submenu closed`);
    setOpenSub(null);
  }

  function activate(index: number) {
    const item = items[index];
    if (item.disabled) return;
    if (item.items) openSubmenu(index);
    else onSelect(item);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    if ((e.target as HTMLElement).closest('[role="menu"]') !== e.currentTarget) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    switch (e.key) {
      case "ArrowDown":
        move(active + 1);
        break;
      case "ArrowUp":
        move(active - 1);
        break;
      case "Home":
        move(0);
        break;
      case "End":
        move(items.length - 1);
        break;
      case "ArrowRight":
        openSubmenu(active);
        break;
      case "ArrowLeft":
        if (!nested) return;
        onClose();
        break;
      case "Enter":
        activate(active);
        break;
      case " ":
        if (buffer.current) typeAhead(" ");
        else activate(active);
        break;
      case "Escape":
        onClose();
        break;
      case "Tab":
        onDismiss();
        return;
      default:
        if (e.key.length !== 1) return;
        typeAhead(e.key);
    }
    e.preventDefault();
  }

  return (
    <ul
      id={id}
      role="menu"
      aria-labelledby={labelledBy}
      onKeyDown={handleKeyDown}
      className={`z-10 min-w-48 rounded-lg border border-zinc-200 bg-white py-1 text-zinc-900 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 ${
        nested ? "absolute -top-1 left-full ml-1" : "absolute left-0 top-full mt-1"
      }`}
    >
      {items.map((item, i) => {
        const itemId = `${baseId}-${item.id}`;
        const hasSub = Boolean(item.items);
        const isOpen = openSub === i;

        return (
          <li key={item.id} role="none" className="relative">
            <div
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              id={itemId}
              role="menuitem"
              tabIndex={i === active ? 0 : -1}
              aria-haspopup={hasSub ? "menu" : undefined}
              aria-expanded={hasSub ? isOpen : undefined}
              aria-controls={isOpen ? `${itemId}-menu` : undefined}
              aria-disabled={item.disabled || undefined}
              onClick={() => {
                setActive(i);
                activate(i);
              }}
              className={itemClass}
            >
              <span>{item.label}</span>
              {hasSub && <span aria-hidden="true">›</span>}
            </div>

            {item.items && isOpen && (
              <MenuList
                nested
                id={`${itemId}-menu`}
                labelledBy={itemId}
                items={item.items}
                announce={announce}
                onSelect={onSelect}
                onClose={closeSubmenu}
                onDismiss={onDismiss}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}