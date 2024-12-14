import { create } from 'zustand';

interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    setAuth: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    setAuth: (accessToken: string, refreshToken: string) => {
        localStorage.setItem("secure_dolphin_streak_usr_access_token", accessToken);
        localStorage.setItem("secure_dolphin_streak_usr_refresh_token", refreshToken);
        set({ isAuthenticated: true, accessToken, refreshToken });
    },
    logout: () => {
        localStorage.removeItem("secure_dolphin_streak_usr_access_token");
        localStorage.removeItem("secure_dolphin_streak_usr_refresh_token");
        set({ isAuthenticated: false, accessToken: null, refreshToken: null });
    },
    checkAuth: () => {
        const accessToken = localStorage.getItem("secure_dolphin_streak_usr_access_token");
        set({ isAuthenticated: !!accessToken });
    }
}));
