import { withAuth } from "@/core/components/hoc/withAuth";
// import DailyChallenge from "../daily-challenge";
import MultipleChoiceCorrectPage from "@/core/pages/challenges/multipleChoice/multipleChoice-correct/page";

function MultipleChoiceCorrect() {
  return <MultipleChoiceCorrectPage />;
}

export default withAuth(MultipleChoiceCorrect);
