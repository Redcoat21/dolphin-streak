import { withAuth } from "@/core/components/hoc/withAuth";
// import DailyChallenge from "../daily-challenge";
import VoicePage from "@/core/pages/challenges/voice/page";

function Voice() {
  return <VoicePage />;
}

export default withAuth(Voice);
