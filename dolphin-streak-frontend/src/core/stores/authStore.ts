import { create } from "zustand";
import { trpc } from "@/utils/trpc";
import { TUserProfileData } from "@/server/types/auth";

interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    userEmail: string | null;
    userData: TUserProfileData | null;
    setAuth: (accessToken: string, refreshToken: string, email: string) => void;
    logout: () => void;
    checkAuth: () => void;
    getAccessToken: () => string | null;
    getRefreshToken: () => string | null;
    getEmail: () => string | null;
    refreshAccessToken: () => Promise<string | null>;
    getUserData: () => TUserProfileData | null;
    setUserData: (userData: TUserProfileData) => void;
}

const isClient = typeof window !== "undefined";

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    userEmail: null,
    userData: null,
    setAuth: (accessToken: string, refreshToken: string, email: string) => {
        if (isClient) {
            localStorage.setItem(
                "secure_dolphin_streak_usr_access_token",
                accessToken
            );
            localStorage.setItem(
                "secure_dolphin_streak_usr_refresh_token",
                refreshToken
            );
            localStorage.setItem(
                "secure_dolphin_streak_usr_email",
                email
            );
        }
        set({ isAuthenticated: true, accessToken, refreshToken, userEmail: email });
    },
    logout: () => {
        if (isClient) {
            localStorage.removeItem("secure_dolphin_streak_usr_access_token");
            localStorage.removeItem("secure_dolphin_streak_usr_refresh_token");
            localStorage.removeItem("secure_dolphin_streak_usr_email");
        }
        set({ isAuthenticated: false, accessToken: null, refreshToken: null, userEmail: null, userData: null, });
    },
    getAccessToken: () =>
        isClient
            ? localStorage.getItem("secure_dolphin_streak_usr_access_token")
            : null,
    getRefreshToken: () =>
        isClient
            ? localStorage.getItem("secure_dolphin_streak_usr_refresh_token")
            : null,
    getEmail: () =>
        isClient
            ? localStorage.getItem("secure_dolphin_streak_usr_email")
            : null,
    checkAuth: () => {
        const accessToken = isClient
            ? localStorage.getItem("secure_dolphin_streak_usr_access_token")
            : null;
        const refreshToken = isClient
            ? localStorage.getItem("secure_dolphin_streak_usr_refresh_token")
            : null;
        const userEmail = isClient
            ? localStorage.getItem("secure_dolphin_streak_usr_email")
            : null;
        set({
            isAuthenticated: !!accessToken,
            accessToken,
            refreshToken,
            userEmail,
        });
    },
    refreshAccessToken: async () => {
        const refreshToken = get().getRefreshToken();
        if (!refreshToken) {
            get().logout();
            return null;
        }

        try {
            const { mutateAsync: refreshAccessToken } = trpc.auth.refreshAccessToken.useMutation();
            const result = await refreshAccessToken({ refreshToken });

            if (result) {
                const userEmail = isClient
                    ? localStorage.getItem("secure_dolphin_streak_usr_email")
                    : null;
                get().setAuth(result.data.accessToken, refreshToken, userEmail || '');
                return result.data.accessToken;
            }
            return null;
        } catch (error) {
            console.error("Failed to refresh access token", error);
            get().logout();
            return null;
        }
    },
    getUserData: () => get().userData,
    setUserData: (userData) => set({ userData }),
}))
