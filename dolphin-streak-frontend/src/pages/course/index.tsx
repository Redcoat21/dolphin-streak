import { withAuth } from "@/core/components/hoc/withAuth";
import { CoursePage } from "@/core/pages/courses/page";

function Courses() {
  return <CoursePage />;
}

export default withAuth(Courses);
