/**
 * uSafe Identity Authentication Hook (useUsafeAuth)
 * Implements the uSafe Identity Ecosystem integration guide (auth.usafe.in)
 * Built with Zustand for global reactive state management across Kite Browser.
 */

import { create } from 'zustand';
import { USafeUser, usafeAuth } from '../services/usafeAuth';
import { web4Bridge } from '../services/web4Bridge';

export interface UsafeAuthState {
  user: USafeUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionStatus: 'unauthenticated' | 'authenticating' | 'authenticated' | 'expired';
  isElectron: boolean;

  // Actions
  loginWithPasskey: (handle?: string) => Promise<USafeUser | null>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  verifySession: () => Promise<boolean>;
  clearError: () => void;
  initSession: () => void;
}

export const useUsafeAuthStore = create<UsafeAuthState>((set, get) => ({
  user: usafeAuth.getCurrentUser(),
  accessToken: usafeAuth.getAccessToken(),
  isAuthenticated: usafeAuth.isAuthenticated(),
  isLoading: false,
  error: null,
  sessionStatus: usafeAuth.isAuthenticated() ? 'authenticated' : 'unauthenticated',
  isElectron: web4Bridge.isElectron(),

  loginWithPasskey: async (handle?: string) => {
    set({ isLoading: true, error: null, sessionStatus: 'authenticating' });
    try {
      // In Electron environment, we can route hardware challenge via native secure enclave
      if (web4Bridge.isElectron() && (window as any).electronAPI?.verifyPasskey) {
        await (window as any).electronAPI.verifyPasskey({ handle: handle || '@sovereign.kite' });
      }

      const user = await usafeAuth.signInWithPasskey(handle);
      set({
        user,
        accessToken: usafeAuth.getAccessToken(),
        isAuthenticated: true,
        isLoading: false,
        sessionStatus: 'authenticated',
        error: null,
      });
      return user;
    } catch (err: any) {
      const errorMessage = err?.message || 'Passkey authentication failed';
      set({
        isLoading: false,
        error: errorMessage,
        sessionStatus: 'unauthenticated',
      });
      return null;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await usafeAuth.logout();
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        sessionStatus: 'unauthenticated',
        error: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err?.message || 'Failed to logout',
      });
    }
  },

  refreshSession: async () => {
    const { user } = get();
    if (!user) return false;

    set({ isLoading: true });
    try {
      const refreshed = await usafeAuth.refreshTokenSession();
      if (refreshed) {
        const updatedUser = usafeAuth.getCurrentUser();
        set({
          user: updatedUser,
          accessToken: usafeAuth.getAccessToken(),
          isAuthenticated: true,
          isLoading: false,
          sessionStatus: 'authenticated',
        });
        return true;
      } else {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          sessionStatus: 'expired',
        });
        return false;
      }
    } catch (err: any) {
      set({
        isLoading: false,
        error: err?.message || 'Failed to refresh token',
        sessionStatus: 'expired',
      });
      return false;
    }
  },

  verifySession: async () => {
    const { user } = get();
    if (!user) {
      set({ isAuthenticated: false, sessionStatus: 'unauthenticated' });
      return false;
    }

    const isValid = user.exp * 1000 > Date.now();
    if (!isValid) {
      // Attempt auto-refresh
      return await get().refreshSession();
    }

    set({ isAuthenticated: true, sessionStatus: 'authenticated' });
    return true;
  },

  clearError: () => set({ error: null }),

  initSession: () => {
    const current = usafeAuth.getCurrentUser();
    const isAuth = usafeAuth.isAuthenticated();
    set({
      user: current,
      accessToken: usafeAuth.getAccessToken(),
      isAuthenticated: isAuth,
      sessionStatus: isAuth ? 'authenticated' : 'unauthenticated',
      isElectron: web4Bridge.isElectron(),
    });
  },
}));

/**
 * React hook alias for accessing uSafe Identity state and methods
 */
export function useUsafeAuth() {
  return useUsafeAuthStore();
}

export default useUsafeAuth;
