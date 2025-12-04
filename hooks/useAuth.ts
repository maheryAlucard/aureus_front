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
  }, [setUser, setAuthenticated, setAuthLoading, setAuthError]);

  const logout = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await apiService.auth.logout();
      logoutStore();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to logout';
      setAuthError(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  }, [logoutStore, setAuthLoading, setAuthError]);

  const checkAuth = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const isAuth = apiService.auth.isAuthenticated();
      if (isAuth) {
        const currentUser = await apiService.auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check authentication';
      setAuthError(errorMessage);
      setAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }, [setUser, setAuthenticated, setAuthLoading, setAuthError]);

  const getCurrentUser = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const currentUser = await apiService.auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setAuthenticated(true);
      }
      return currentUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get current user';
      setAuthError(errorMessage);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, [setUser, setAuthenticated, setAuthLoading, setAuthError]);

  return {
    user,
    authLoading,
    authError,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    getCurrentUser,
  };
};

