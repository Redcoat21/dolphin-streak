import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TUserData } from "@/server/types/auth";

interface ProfileDisplayProps {
    userData: TUserData | null | undefined;
    onEdit: () => void;
}

export function ProfileDisplay({ userData, onEdit }: ProfileDisplayProps) {
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
            </div>
        </div>
    );
}
