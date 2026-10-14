"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { LiveRegion, useAnnouncer } from "./announcer";
import { MenuList } from "./MenuList";
import type { MenuItemData } from "./types";

interface DropdownMenuProps {
  label: string;
  items: MenuItemData[];
  onSelect: (item: MenuItemData) => void;
  showAnnouncements?: boolean;
}

export function DropdownMenu({ label, items, onSelect, showAnnouncements = false }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [initialFocus, setInitialFocus] = useState<"first" | "last">("first");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const { message, announce } = useAnnouncer();

  const openMenu = (focus: "first" | "last") => {
    setInitialFocus(focus);
    setOpen(true);
    announce(`${label} menu opened, ${items.length} items`);
  };

  const closeMenu = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      if (returnFocus) buttonRef.current?.focus();
      announce(`${label} menu closed`);
    },
    [label, announce],
  );

  const handleSelect = (item: MenuItemData) => {
    onSelect(item);
    setOpen(false);
    buttonRef.current?.focus();
    announce(`${item.label} selected. Menu closed.`);
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) closeMenu(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, closeMenu]);

  function handleButtonKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    openMenu(e.key === "ArrowDown" ? "first" : "last");
  }

  return (
    <div>
      <div ref={containerRef} className="relative inline-block">
        <button
          ref={buttonRef}
          id={buttonId}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={() => (open ? closeMenu() : openMenu("first"))}
          onKeyDown={handleButtonKeyDown}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 aria-expanded:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:aria-expanded:bg-zinc-800"
        >
          {label}
          <span aria-hidden="true">▾</span>
        </button>

        {open && (
          <MenuList
            id={menuId}
            labelledBy={buttonId}
            items={items}
            initialFocus={initialFocus}
            announce={announce}
            onSelect={handleSelect}
            onClose={() => closeMenu()}
            onDismiss={() => closeMenu()}
          />
        )}
      </div>

      <LiveRegion message={message} visible={showAnnouncements} />
    </div>
  );
}