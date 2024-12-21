import { withAuth } from "@/core/components/hoc/withAuth";
// import DailyChallenge from "../daily-challenge";
import Challenge from "@/core/pages/challenges/page";

function Challenges() {
  return <Challenge />;
}

export default withAuth(Challenges);
