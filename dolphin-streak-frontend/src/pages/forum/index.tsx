import { withAuth } from '@/core/components/hoc/withAuth';
import { ForumPage } from '@/core/pages/forum/index';

function Forum() {
  return <ForumPage />;
}
export default withAuth(Forum);


