// import { ReplyPage } from "@/core/pages/forum/id/reply";

import { withAuth } from "@/core/components/hoc/withAuth";
import ReplyPage from "@/core/pages/forum/id/reply";

const ForumReplyPage = () => {
  return <ReplyPage />;
};

export default withAuth(ForumReplyPage);
