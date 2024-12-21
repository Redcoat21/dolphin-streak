import { withAuth } from "@/core/components/hoc/withAuth";
// import DailyChallenge from "../daily-challenge";
import VoiceWrongPage from "@/core/pages/challenges/voice/voice-wrong/page";

function Wrong() {
  return <VoiceWrongPage />;
}

export default withAuth(Wrong);
