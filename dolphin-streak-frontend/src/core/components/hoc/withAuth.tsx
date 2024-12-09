import { AuthContext } from "@/core/contexts/AuthContext";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
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
