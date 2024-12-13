import { CoursePage } from "@/core/pages/course/page";
import { withAuth } from "@/core/components/hoc/withAuth";

function Course() {
  return <CoursePage />;
}

export default withAuth(Course);
