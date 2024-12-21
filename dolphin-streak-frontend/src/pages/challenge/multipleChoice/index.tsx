import { withAuth } from "@/core/components/hoc/withAuth";
// import DailyChallenge from "../daily-challenge";
import MultipleChoicePage from "@/core/pages/challenges/multipleChoice/page";

function MultipleChoice() {
  return <MultipleChoicePage />;
}

export default withAuth(MultipleChoice);
