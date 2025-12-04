import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { apiService } from '../services/apiService';

export const useAuth = () => {
  const {
    user,
    authLoading,
    authError,
    isAuthenticated,
    setUser,
    setAuthLoading,
    setAuthError,
    setAuthenticated,
    logout: logoutStore,
  } = useAppStore();

  const login = useCallback(async (username: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const result = await apiService.auth.login(username, password);
      if (result.success && result.user) {
        setUser(result.user);
        setAuthenticated(true);
        return result;
      } else {
        setAuthError(result.error || 'Login failed');
        setAuthenticated(false);
        return result;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      setAuthError(errorMessage);
      setAuthenticated(false);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, [setUser, setAuthLoading, setAuthError, setAuthenticated]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const result = await apiService.auth.register(username, email, password);
      if (result.success && result.user) {
        setUser(result.user);
        setAuthenticated(true);
        return result;
      } else {
        setAuthError(result.error || 'Registration failed');
        setAuthenticated(false);
        return result;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register';
      setAuthError(errorMessage);
      setAuthenticated(false);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, [setUser, setAuthLoading, setAuthError, setAuthenticated]);

  const logout = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await apiService.auth.logout();
      logoutStore();
      setAuthenticated(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to logout';
      setAuthError(errorMessage);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, [logoutStore, setAuthLoading, setAuthError, setAuthenticated]);

  const getCurrentUser = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const currentUser = await apiService.auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
      return currentUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get current user';
      setAuthError(errorMessage);
      setAuthenticated(false);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, [setUser, setAuthLoading, setAuthError, setAuthenticated]);

  const checkAuth = useCallback(() => {
    const authenticated = apiService.auth.isAuthenticated();
    setAuthenticated(authenticated);
    if (authenticated) {
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUser(user);
        } catch {
          setUser(null);
          setAuthenticated(false);
        }
      }
    }
    return authenticated;
  }, [setUser, setAuthenticated]);

  return {
    user,
    authLoading,
    authError,
    isAuthenticated,
    login,
    register,
    logout,
    getCurrentUser,
    checkAuth,
  };
};
