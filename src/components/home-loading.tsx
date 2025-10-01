const SkeletonCard = () => (
  <div className="p-4 rounded-xl shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
      <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
    </div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
  </div>
);

const SkeletonSummary = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
      </div>
    </div>
  </div>
);

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto animate-pulse"></div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <SkeletonSummary />
          <SkeletonSummary />
          <SkeletonSummary />
        </div>

        {/* Customer Management Button Skeleton */}
        <div className="mb-4">
          <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
        </div>

        {/* Customer Cards Skeleton */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>

        {/* Reports Button Skeleton */}
        <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}
