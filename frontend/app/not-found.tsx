import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-7xl font-bold text-slate-950">404</p>
      <h2 className="text-xl font-semibold text-slate-700">Page not found</h2>
      <p className="text-sm text-slate-500">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-slate-950 px-4 py-2 text-sm text-white hover:bg-slate-800 transition-colors"
      >
        Go home
      </Link>
    </main>
  );
}
