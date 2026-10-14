import { Demo } from "@/components/Demo";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Keyboard-navigable menu</h1>
      <p className="mb-6 mt-2 text-zinc-600 dark:text-zinc-400">
        Put the mouse aside. Tab to the File button, press ↓, and use the keys
        below.
      </p>
      <Demo />
    </main>
  );
}
