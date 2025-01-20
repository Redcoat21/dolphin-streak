import { withAuth } from "@/core/components/hoc/withAuth";
import { ComprehensionSessionIDPage } from "@/core/pages/comprehensions/ComprehensionSessionIDPage";

function ComprehensionSessionId() {
    return <ComprehensionSessionIDPage />
};

export default withAuth(ComprehensionSessionId)