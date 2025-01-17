import FeedbackIdPage from '@/core/pages/feedback/feedbackId';
import { withAuth } from '@/core/components/hoc/withAuth';

function FeedbackID() {
    return <FeedbackIdPage />;
}
export default withAuth(FeedbackID);
