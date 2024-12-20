// import { ComprehensionsPage } from "@/core/pages/comprehensions/page";
import { withAuth } from "@/core/components/hoc/withAuth";
import ComprehensionsPage from "@/core/pages/comprehensions/page";

function Comprehension() {
  return <ComprehensionsPage />;
}

export default withAuth(Comprehension);
