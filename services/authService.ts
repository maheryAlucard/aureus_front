// Mock authentication service
const MOCK_USER = {
  username: 'admin',
  password: 'admin123', // In production, this would be hashed
  email: 'admin@aureus.com'
};

// Mock users storage (in production, this would be a database)
let mockUsers: Array<{ username: string; email: string; password: string }> = [
  { username: MOCK_USER.username, email: MOCK_USER.email, password: MOCK_USER.password }
];

export interface User {
  username: string;
  email: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      const userData = { username: user.username, email: user.email };
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      return { success: true, user: userData };
    }
    
    return { success: false, error: 'Identifiants incorrects' };
  },

  register: async (username: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    if (mockUsers.find(u => u.username === username || u.email === email)) {
      return { success: false, error: 'Un utilisateur avec ce nom d\'utilisateur ou cet email existe déjà' };
    }
    
    // Validate password
    if (password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
    }
    
    // Create new user
    const newUser = { username, email, password };
    mockUsers.push(newUser);
    
    const userData = { username, email };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', 'mock_token_' + Date.now());
    return { success: true, user: userData };
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

