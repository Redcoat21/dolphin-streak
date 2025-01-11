import { Container } from "@/core/components/container";
import { useAuthStore } from "@/core/stores/authStore";
import { Header } from "../dasboard/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { TUpdateProfileInput } from "@/server/types/auth";
import { LogoutButton } from "./components/logout";
import { ChangeProfilePicture } from "./components/change-profile-picture";
import { ProfileEdit } from "./components/profile-edit";
import { ProfileDisplay } from "./components/profile-display";


export function ProfilePage() {
  const { getAccessToken, getUserData, setUserData } = useAuthStore();
  const router = useRouter();
  const accessToken = getAccessToken();
  const userData = getUserData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const { mutateAsync: updateProfile } = trpc.auth.updateProfile.useMutation();

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (values: TUpdateProfileInput) => {
    try {
      const result = await updateProfile({
        accessToken: accessToken || "",
        ...values,
      });

      if (result.success) {
        setUserData({
          ...userData!,
          ...values,
        });
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleProfilePictureChange = () => {
    setIsDialogOpen(true);
  };

  const handleFileAccepted = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("accessToken", accessToken || "");

      const result = await trpc.auth.updateProfilePicture.mutateAsync(formData);

      if (result.success) {
        setUserData({
          ...userData!,
          profilePicture: result.profilePicture,
        });
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
      }
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

  const handleLanguageChange = () => {
    router.push("/learning");
  };


  return (
    <Container>
      <Header currentPath="/profile" />
      <div className="mt-24 max-w-4xl mx-auto p-4">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
              <LogoutButton />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2">
                  <AvatarImage src={userData?.profilePicture} alt={userData?.firstName} />
                  <AvatarFallback>
                    {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
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
                      onProfilePictureChange={handleProfilePictureChange}
                    />
                  )}
                </div>
              </div>
            </div>
            <ChangeProfilePicture
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onFileAccepted={handleFileAccepted}
            />

            <Separator />

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationChange('email')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={() => handleNotificationChange('push')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}