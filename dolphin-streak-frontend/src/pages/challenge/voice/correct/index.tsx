import { withAuth } from "@/core/components/hoc/withAuth";
// import DailyChallenge from "../daily-challenge";
import VoiceCorrectPage from "@/core/pages/challenges/voice/voice-correct/page";

function VoiceCorrect() {
  return <VoiceCorrectPage />;
}

export default withAuth(VoiceCorrect);
