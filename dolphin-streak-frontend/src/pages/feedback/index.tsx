import { withAuth } from "@/core/components/hoc/withAuth";
import { FeedbackPage } from "@/core/pages/feedback";

function Feedback() {
    return (
        <FeedbackPage />
    )
}

export default withAuth(Feedback);