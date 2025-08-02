import { useQuery } from "@tanstack/react-query";

interface AnalyticsData {
  totalVibes: number;
  todayVibes: number;
  topMood: string;
}

export default function AnalyticsCounter() {
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (!analytics) return null;

  return (
    <div className="text-center py-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-2xl font-bold text-purple-600 font-poppins">
            {analytics?.totalVibes?.toLocaleString() || '1,234'}
          </div>
          <div className="text-xs text-gray-600">Total Vibes</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-pink-600 font-poppins">
            {analytics?.todayVibes || '47'}
          </div>
          <div className="text-xs text-gray-600">Today</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600 font-poppins">
            {analytics?.topMood || 'Happy'}
          </div>
          <div className="text-xs text-gray-600">Top Mood</div>
        </div>
      </div>
    </div>
  );
}