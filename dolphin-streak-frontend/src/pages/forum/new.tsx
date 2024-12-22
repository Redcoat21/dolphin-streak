
import { withAuth } from "@/core/components/hoc/withAuth";
import NewThreadPage from "@/core/pages/forum/new/page";

export const NewThread = () => {
  return <NewThreadPage />
};

export default withAuth(NewThread);
