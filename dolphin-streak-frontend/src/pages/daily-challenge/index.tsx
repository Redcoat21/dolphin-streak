import { withAuth } from "@/core/components/hoc/withAuth";
import { Challenge } from "@/core/pages/daily-challenge/page";

function Challenges() {
  return <Challenge />;
}

export default withAuth(Challenges);
