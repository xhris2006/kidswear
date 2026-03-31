// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Navbar skeleton */}
      <div className="h-16 bg-white border-b border-gray-100 flex items-center px-6">
        <div className="skeleton h-8 w-32 rounded-xl" />
        <div className="ml-auto flex gap-3">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="skeleton h-[60vh] w-full" />

      {/* Product grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="skeleton h-8 w-64 rounded-xl mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="skeleton aspect-square rounded-3xl" />
              <div className="skeleton h-4 w-3/4 rounded-lg" />
              <div className="skeleton h-4 w-1/2 rounded-lg" />
              <div className="skeleton h-6 w-1/3 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
