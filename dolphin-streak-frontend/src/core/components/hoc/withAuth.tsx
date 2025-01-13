import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthStore } from "@/core/stores/authStore";
import { trpc } from "@/utils/trpc";

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const { isAuthenticated, refreshToken: refreshTokenFromStore } = useAuthStore();
    const { mutate: refreshAccessToken } = trpc.auth.refreshAccessToken.useMutation();

    const refreshToken = refreshTokenFromStore as string;
    useEffect(() => {
      if (!isAuthenticated) {
        const allowedPaths = [
          "/auth/login",
          "/auth/register",
          "/auth/forgot-password",
          "/auth/change-password",
        ];
        if (!allowedPaths.includes(router.pathname)) {
          refreshAccessToken({ refreshToken }, {
            onSuccess: () => {
              router.replace(router.pathname);
            },
            onError: () => {
              router.replace("/auth/login");
            },
          });
        }
      }
    }, [isAuthenticated, refreshToken, refreshAccessToken, router]);

    return <Component {...props} />;
  };
}
