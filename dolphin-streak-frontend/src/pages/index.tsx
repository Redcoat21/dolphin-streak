import { withAuth } from "@/core/components/hoc/withAuth";
import { Dashboard } from "@/core/pages/dasboard/page";

function HomePage() {
  return (
    <Dashboard />
  );
}
export default withAuth(HomePage);
