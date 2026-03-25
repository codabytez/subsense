import { FadeIn } from "@/components/motion";
import {
  MonthlyBurn,
  UpcomingRenewals,
  StatsPanel,
  RecentActivity,
  InsightCard,
} from "@/components/dashboard/overview";

export default function OverviewPage() {
  return (
    <FadeIn className="flex flex-col gap-6">
      {/* Monthly burn + donut */}
      <MonthlyBurn />

      {/* Next 7 days */}
      <UpcomingRenewals />

      {/* Stats + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <StatsPanel />
          <InsightCard />
        </div>

        {/* Right column */}
        <RecentActivity />
      </div>
    </FadeIn>
  );
}
