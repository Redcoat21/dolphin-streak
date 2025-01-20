import { Container } from "@/core/components/container";
import { useAuthStore } from "@/core/stores/authStore";
import { Card, CardContent, } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, ShieldCheck, CheckCircle } from "lucide-react";
import { TUpdateProfileInput } from "@/server/types/auth";
import { LogoutButton } from "./components/logout";
import { ChangeProfilePicture } from "./components/change-profile-picture";
import { ProfileEdit } from "./components/profile-edit";
import { ProfileDisplay } from "./components/profile-display";
import { Header } from "../dasboard/components/Header";
import { SubscriptionForm } from "@/core/components/subscription/SubscriptionForm";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ProfilePage() {
  const { getAccessToken, getUserData, setUserData } = useAuthStore();
  const router = useRouter();
  const accessToken = getAccessToken();
  const userData = getUserData();
  console.log({ userData })
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState(userData?.profilePicture);


  const { mutate: updateProfile } = trpc.auth.updateProfile.useMutation({
    onSuccess(data, variables, context) {
      setUserData({
        ...userData!,
        firstName: data.data?.firstName || "",
        lastName: data.data?.lastName || "",
      });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError(error, variables, context) {
      toast({
        title: error.message,
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const { mutate: updateProfilePicture } = trpc.auth.updateProfilePicture.useMutation({
    onSuccess(data, variables, context) {
      setUserData({
        ...userData!,
        profilePicture: data.data?.imageUrl || ""
      });
      setUserProfilePicture(data.data?.imageUrl || "");
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    },
    onError(error, variables, context) {
      toast({
        title: error.message,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (values: TUpdateProfileInput) => {
    await updateProfile({
      accessToken: accessToken || "",
      ...values,
    });
  };

  const handleProfilePictureChange = () => {
    setIsDialogOpen(true);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };


  const handleFileAccepted = async (file: File) => {
    try {
      const base64String = await fileToBase64(file);
      updateProfilePicture({
        profilePicture: base64String,
        accessToken: accessToken || "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
    }
  };


  const handleNotificationChange = (type: 'email' | 'push') => {
    setNotificationSettings(prev => ({
      ...prev,
      [type === 'email' ? 'emailNotifications' : 'pushNotifications']:
        !prev[type === 'email' ? 'emailNotifications' : 'pushNotifications']
    }));
    toast({
      title: "Success",
      description: "Notification preferences updated",
    });
  };

  useEffect(() => {
    if (userData) {
      setUserProfilePicture(userData.profilePicture);
    }
  }, [userData]);

  return (
    <Container>
      <Header currentPath="/profile" />
      <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        {/* Main Profile Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
            {/* Profile Section */}
            <div className="col-span-1 flex flex-col items-center md:items-start space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/10 shadow-md hover:shadow-lg transition-shadow">
                  <AvatarImage
                    src={userProfilePicture}
                    alt={userData?.firstName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl sm:text-2xl">
                    {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  onClick={handleProfilePictureChange}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Change Photo
                </Button>
              </div>
            </div>

              {/* Profile Info Section */}
              <div className="col-span-2 flex-1 min-w-0">
                {isEditing ? (
                  <ProfileEdit
                    userData={userData}
                    onCancel={() => setIsEditing(false)}
                    onSave={handleSaveProfile}
                  />
                ) : (
                  <ProfileDisplay
                    userData={userData}
                    onEdit={handleEditProfile}
                  />
                )}
              </div>


            <Separator className="md:col-span-3" />
             {/* Subscription Section */}
             <div className="col-span-3 space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                    Subscription
                </h3>
                <div className="mt-4">
                    <SubscriptionForm />
                </div>
            </div>
            <Separator className="md:col-span-3" />

            {/* Notification Settings */}
            <div className="col-span-3 space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-muted-foreground" />
                Notification Preferences
              </h3>
              <div className="space-y-6">
                <NotificationToggle
                  title="Push Notifications"
                  description="Receive notifications"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={() => handleNotificationChange('push')}
                />
              </div>
            </div>
          </CardContent >
        </Card>
      <ChangeProfilePicture
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onFileAccepted={handleFileAccepted}
      />
      </div>
    </Container>
  );
}

// New component for notification toggles
function NotificationToggle({
  title,
  description,
  checked,
  onCheckedChange
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
}