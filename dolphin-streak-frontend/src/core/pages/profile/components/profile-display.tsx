import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TUserProfileData } from "@/server/types/auth";

interface ProfileDisplayProps {
    userData: TUserProfileData | null | undefined;
    onEdit: () => void;
    onProfilePictureChange: () => void;
}

export function ProfileDisplay({ userData, onEdit, onProfilePictureChange }: ProfileDisplayProps) {
    return (
        <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
                {userData?.firstName} {userData?.lastName}
            </h2>
            <p className="text-gray-500">{userData?.email}</p>
            <div className="flex gap-2">
                <Button onClick={onEdit} variant="outline" className="mt-2">
                    Edit Profile
                </Button>
                <Button onClick={onProfilePictureChange} variant="outline" className="mt-2">
                    Change Profile Picture
                </Button>
            </div>
        </div>
    );
}
