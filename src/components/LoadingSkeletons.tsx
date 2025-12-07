import Skeleton from '@mui/material/Skeleton';

export function ProjectCardSkeleton() {

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2 }} />
        <Skeleton variant="text" width={80} />
      </div>
      <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 1, mb: 2 }} />
      <Skeleton variant="text" width="60%" />
    </div>
  );
}

export function ProjectListSkeleton() {

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-6 border-b border-gray-200 last:border-b-0">
          <Skeleton variant="circular" width={16} height={16} />
          <div className="flex-1">
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" />
          </div>
          <div className="w-48">
            <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 1 }} />
          </div>
          <Skeleton variant="text" width={80} />
        </div>
      ))}
    </div>
  );
}

export function TaskCardSkeleton() {

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <Skeleton variant="text" width="80%" height={24} sx={{ mb: 2 }} />
      <div className="flex items-center justify-between">
        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 2 }} />
        <Skeleton variant="text" width={70} />
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
    
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton variant="text" width={120} height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width={80} height={40} />
            </div>
            <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}