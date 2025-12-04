// Mock authentication service
const MOCK_USER = {
  username: 'admin',
  password: 'admin123', // In production, this would be hashed
  email: 'admin@aureus.com'
};

export interface User {
  username: string;
  email: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      const user = { username: MOCK_USER.username, email: MOCK_USER.email };
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      return { success: true, user };
    }
    
    return { success: false, error: 'Identifiants incorrects' };
  },

  logout: (): void => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
};

