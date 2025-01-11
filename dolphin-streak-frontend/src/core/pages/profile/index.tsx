import { Container } from "@/core/components/container";
import { useAuthStore } from "@/core/stores/authStore";
import { Header } from "../dasboard/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Bell, Globe, LogOut, Settings, User } from "lucide-react";
import * as z from "zod";
import { TUpdateProfileInput } from "@/server/types/auth";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export function ProfilePage() {
  const { getAccessToken, logout, getUserData, setUserData } = useAuthStore();
  const router = useRouter();
  const accessToken = getAccessToken();
  const userData = getUserData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
  });

  const { mutateAsync: updateProfile } = trpc.auth.updateProfile.useMutation();

  const form = useForm<TUpdateProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
    },
  });

  const handleEditProfile = () => {
    setIsEditing(true);
    form.reset({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
    });
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

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Container>
      <Header currentPath="/profile" />
      <div className="mt-24 max-w-4xl mx-auto p-4">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will need to login again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                    <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...form.register("firstName")}
                            className="w-full"
                          />
                          {form.formState.errors.firstName && (
                            <p className="text-sm text-red-500">
                              {form.formState.errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...form.register("lastName")}
                            className="w-full"
                          />
                          {form.formState.errors.lastName && (
                            <p className="text-sm text-red-500">
                              {form.formState.errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold">
                        {userData?.firstName} {userData?.lastName}
                      </h2>
                      <p className="text-gray-500">{userData?.email}</p>
                      <Button onClick={handleEditProfile} variant="outline" className="mt-2">
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Language Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language Settings
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Learning Language</p>
                  <p className="text-sm text-gray-500">
                    {userData?.languages?.length ? 
                      userData.languages.join(", ") : 
                      "No language selected"}
                  </p>
                </div>
                <Button onClick={handleLanguageChange}>
                  Change Language
                </Button>
              </div>
            </div>

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