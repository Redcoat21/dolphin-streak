import { useAuthStore } from "@/core/stores/authStore"
import { trpc } from "@/utils/trpc"
import { useParams } from "next/navigation";

export function CourseSessionIDPage() {
    const { getAccessToken } = useAuthStore();
    const accessToken = getAccessToken();
    const params = useParams();
    const courseSessionId = params?.courseSessionId as string;
    const { data: courseSessionData } = trpc.course.getCourseSessionId.useQuery({
        accessToken: accessToken || "",
        courseSessionId: courseSessionId as string
    })
    console.log({ courseSessionData })
    return <></>
}