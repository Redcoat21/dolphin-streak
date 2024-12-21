import { withAuth } from "@/core/components/hoc/withAuth";
// import DailyChallenge from "../daily-challenge";
import MultipleChoiceWrongPage from "@/core/pages/challenges/multipleChoice/multipleChoice-wrong/page";

function MultipleChoiceWrong() {
  return <MultipleChoiceWrongPage />;
}

export default withAuth(MultipleChoiceWrong);
