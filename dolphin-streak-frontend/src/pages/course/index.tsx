import CoursePage from "@/core/pages/courses/page";
import { withAuth } from "@/core/components/hoc/withAuth";

function Courses() {
  return <CoursePage />;
}

export default withAuth(Courses);
