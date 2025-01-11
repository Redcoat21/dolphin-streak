import { withAuth } from "@/core/components/hoc/withAuth";
import { ProfilePage } from "@/core/pages/profile";

function Profile() {
    return <ProfilePage />
}
export default withAuth(Profile);