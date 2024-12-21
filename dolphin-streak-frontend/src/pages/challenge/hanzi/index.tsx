import { withAuth } from "@/core/components/hoc/withAuth";
// import DailyChallenge from "../daily-challenge";
import HanziPage from "@/core/pages/challenges/hanzi/page";

function Hanzi() {
  return <HanziPage />;
}

export default withAuth(Hanzi);
