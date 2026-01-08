import { create } from "zustand";

interface User {
  id: string;
  username: string;
  createdAt: string;
  profilePhoto?: string;
  status?: string;
  
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;

  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  // ✅ async action (NOT state)
  checkAuth: async () => {
    try {
      const res = await fetch(import.meta.env.VITE_BackendURI + "/api/user/check-auth", {
        method: "POST",
        credentials: "include", // important for cookies/JWT
      });


      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();

      set({
        isAuthenticated: true,
        user: data.user,
      });
    } catch {
      set({
        isAuthenticated: false,
        user: null,
      });
    }
  },

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

export default useAuthStore;
