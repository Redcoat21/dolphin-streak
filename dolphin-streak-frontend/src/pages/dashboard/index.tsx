import { DashboardPage } from "@/core/pages/dashboard/page";
import { withAuth } from "@/core/components/hoc/withAuth";

function Dashboard() {
  return <DashboardPage />;
}

export default withAuth(Dashboard);
