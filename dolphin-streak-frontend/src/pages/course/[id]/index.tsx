import { withAuth } from "@/core/components/hoc/withAuth";
import { CoursePageID } from "@/core/pages/courses/CourseID";

function CourseID() {
    return <CoursePageID />;
}

export default withAuth(CourseID);