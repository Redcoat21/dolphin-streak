import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/core/stores/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Notification } from "@/core/components/shared/notification";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useEffect } from "react";

interface HeaderProps {
  currentPath?: string;
  languageDropdown?: boolean;
  selectedLanguage?: string;
  onLanguageChange?: (languageId: string) => void;
}

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    message: "New message from John Doe",
    read: false,
  },
  {
    id: 2,
    message: "Your course has been updated",
    read: true,
  },
  {
    id: 3,
    message: "New feedback on your assignment",
    read: false,
  },
];

export function Header({ currentPath, languageDropdown, selectedLanguage, onLanguageChange }: HeaderProps) {
  const { logout } = useAuthStore();
  const router = useRouter();
  const { getAccessToken, setUserData } = useAuthStore();
  const accessToken = getAccessToken();
  const { data: languagesData } = trpc.language.getLanguages.useQuery(
    { accessToken: accessToken || '' },
    {
      enabled: languageDropdown,
    }
  );

  const { data: userData } = trpc.auth.getProfile.useQuery({ accessToken: accessToken || '' });
  // Find the selected language object
  const selectedLanguageData = languagesData?.data.find(
    (language) => language._id === selectedLanguage
  );
  useEffect(() => {
    if (userData?.data) {
      setUserData(userData.data);
    }
  }, [userData]);
  const renderHeader = () => {
    switch (currentPath) {
      case "/":
      case undefined:
        return (
          <>
            {languageDropdown && languagesData?.data && (
              <Select
                value={selectedLanguage}
                onValueChange={(value) => onLanguageChange?.(value)}
              >
                <SelectTrigger className="w-[180px] bg-white flex items-center gap-2">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languagesData.data.map((language) => {
                    return (
                      <SelectItem key={language._id} value={language._id}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={language.image}
                            alt={language.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span>{language.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
            <Notification notifications={MOCK_NOTIFICATIONS} />
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={() => router.push("/forum")}
            >
              Forum
            </Button>
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        );
      case "/forum":
        return (
          <>
            <Notification notifications={MOCK_NOTIFICATIONS} />
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={() => router.push("/")}
            >
              Home
            </Button>
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        );
      case "/courses":
        return (
          <>
            {languageDropdown && languagesData?.data && (
              <Select
                value={selectedLanguage}
                onValueChange={(value) => onLanguageChange?.(value)}
              >
                <SelectTrigger className="w-[180px] bg-white flex items-center gap-2">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languagesData.data.map((language) => {
                    return (
                      <SelectItem key={language._id} value={language._id}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={language.image}
                            alt={language.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span>{language.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
            <Notification notifications={MOCK_NOTIFICATIONS} />
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={() => router.push("/forum")}
            >
              Forum
            </Button>
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={() => router.push("/")}
            >
              Home
            </Button>
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        );
      case "/daily-challenge":
        return (
          <>
            {languageDropdown && languagesData?.data && (
              <Select
                value={selectedLanguage}
                onValueChange={(value) => onLanguageChange?.(value)}
              >
                <SelectTrigger className="w-[180px] bg-white flex items-center gap-2">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languagesData.data.map((language) => {
                    return (
                      <SelectItem key={language._id} value={language._id}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={language.image}
                            alt={language.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span>{language.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
            <Notification notifications={MOCK_NOTIFICATIONS} />
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={() => router.push("/forum")}
            >
              Forum
            </Button>
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={() => router.push("/")}
            >
              Home
            </Button>
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        );
      case "/comprehensions":
        return (
          <>
            {languageDropdown && languagesData?.data && (
              <Select
                value={selectedLanguage}
                onValueChange={(value) => onLanguageChange?.(value)}
              >
                <SelectTrigger className="w-[180px] bg-white flex items-center gap-2">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languagesData.data.map((language) => {
                    return (
                      <SelectItem key={language._id} value={language._id}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={language.image}
                            alt={language.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span>{language.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
            <Notification notifications={MOCK_NOTIFICATIONS} />
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={() => router.push("/forum")}
            >
              Forum
            </Button>
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={() => router.push("/")}
            >
              Home
            </Button>
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        );

      default:
        return (
          <>
            <Notification notifications={MOCK_NOTIFICATIONS} />
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={() => router.push("/")}
            >
              Home
            </Button>
            <Button
              variant="custom-blue"
              className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        );
    }
  };

  return (
    <header className="fixed top-0 w-full bg-gradient-to-r from-[#0A84FF] to-[#5AB9EA] p-4 z-50">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto space-y-3 sm:space-y-0">
        <div className="flex items-center gap-3">
          {/* make the link so that the component inside it like inline */}
          <Link href="/profile" className="flex items-center gap-2">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarImage src={userData?.data?.profilePicture} alt="User" />
              <AvatarFallback>
                {userData?.data?.firstName && userData?.data?.lastName
                  ? `${userData.data.firstName.charAt(0)}${userData.data.lastName.charAt(0)}`
                  : userData?.data?.firstName?.slice(0, 2) || "U"}
              </AvatarFallback >
            </Avatar>
            <h3 className="text-xl font-semibold text-white">
              Hello, {userData?.data?.firstName} {userData?.data?.lastName}
            </h3>
          </Link>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2">
          {renderHeader()}
        </div>
      </div>
    </header>
  );
}