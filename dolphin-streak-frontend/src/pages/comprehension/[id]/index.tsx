import { withAuth } from "@/core/components/hoc/withAuth";
import { ComprehensionPageID } from "@/core/pages/comprehensions/ComprehensionID";

function ComprehensionID() {
    return <ComprehensionPageID />;
}

export default withAuth(ComprehensionID);