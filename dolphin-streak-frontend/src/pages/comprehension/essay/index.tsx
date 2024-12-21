// import { ComprehensionsPage } from "@/core/pages/comprehensions/page";
import { withAuth } from "@/core/components/hoc/withAuth";
import ComprehensionEssayPage from "@/core/pages/comprehensions/comprehensions-essay/pages";

function Comprehension() {
  return <ComprehensionEssayPage />;
}

export default withAuth(Comprehension);
