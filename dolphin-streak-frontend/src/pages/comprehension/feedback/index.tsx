import { withAuth } from "@/core/components/hoc/withAuth";
import ComprehensionFeedbackPage from "@/core/pages/comprehensions/comprehensions-feedback/page";

function Comprehension() {
  return <ComprehensionFeedbackPage />;
}

export default withAuth(Comprehension);
