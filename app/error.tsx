"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] Unhandled render error", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            Server Error
          </p>
          <h1 className="mt-3 text-3xl font-playfair font-bold">
            Something went wrong while loading this page
          </h1>
          <p className="mt-3 text-gray-600">
            We hit a server-side issue. You can retry now or go back to the store.
          </p>
          {error.digest && (
            <p className="mt-4 text-xs text-gray-400">Digest: {error.digest}</p>
          )}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="px-5 py-3 rounded-2xl text-white font-bold"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-5 py-3 rounded-2xl border-2 border-gray-200 font-bold text-gray-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
