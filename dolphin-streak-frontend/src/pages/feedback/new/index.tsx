import { withAuth } from "@/core/components/hoc/withAuth";
import NewFeedbackPage from "@/core/pages/feedback/new";

function newFeedback() {
    return <NewFeedbackPage />
}
export default withAuth(newFeedback)