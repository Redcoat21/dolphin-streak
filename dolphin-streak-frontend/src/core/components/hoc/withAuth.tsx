import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthStore } from "@/core/stores/authStore";

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
      console.log("isAuthenticated:", isAuthenticated);
      if (!isAuthenticated) {
        const allowedPaths = [
          "/auth/login",
          "/auth/register",
          "/auth/forgot-password",
          "/auth/change-password",
        ];
        if (!allowedPaths.includes(router.pathname)) {
          router.replace("/auth/login");
        }
      }
    }, [isAuthenticated, router]);

    return <Component {...props} />;
  };
}
