import { create } from "zustand";

interface UseLoginStateProps {
  isLogin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  username: string;
  setUsername: (newUsername: string) => void; 
}

export const useLoginState = create<UseLoginStateProps>((set) => ({
  isLogin: false,
  onLogin: () => set({ isLogin: true }),
  onLogout: () => set({ isLogin: false }),
  username: "", 
  setUsername: (newUsername: string) => set({ username: newUsername }), 
}));
