import { withAuth } from "@/core/components/hoc/withAuth";
import { CourseSessionIDPage } from "@/core/pages/courses/CourseSessionID";

function CourseSessionId() {
    return <CourseSessionIDPage />
};

export default withAuth(CourseSessionId)