import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [streamer, setStreamer] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const response = await authService.me();
      setUser(response.user);
      setStreamer(response.streamer);
    } catch (error) {
      setUser(null);
      setStreamer(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const response = await authService.me();
        if (mounted) {
          setUser(response.user);
          setStreamer(response.streamer);
        }
      } catch (error) {
        if (mounted) {
          setUser(null);
          setStreamer(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (payload) => {
    await authService.login(payload);
    await refreshMe();
  };

  const register = async (payload) => {
    await authService.register(payload);
    await refreshMe();
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setStreamer(null);
  };

  const value = useMemo(
    () => ({
      user,
      streamer,
      loading,
      login,
      register,
      logout,
      refreshMe,
      startGoogleAuth: authService.startGoogleAuth
    }),
    [loading, streamer, user, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
