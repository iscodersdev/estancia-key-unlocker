
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, authService } from '@/services/authService';
import { notificationService } from '@/services/notificationService';
import { clearComprobantesCache } from '@/services/comprobantesService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = () => {
      try {
        // Solo verificar si hay datos guardados en localStorage
        if (authService.isAuthenticated()) {
          const userData = authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            console.log('Usuario cargado desde localStorage:', userData);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user: userData } = await authService.login({ email, password });
      setUser(userData);
      console.log('Login exitoso:', userData);
      console.log('Iniciando precarga de comprobantes...');
      
      // Registrar dispositivo para notificaciones push
      try {
        await authService.registerDeviceForPush();
        console.log('Dispositivo registrado para notificaciones push');
      } catch (pushError) {
        console.warn('Error al registrar dispositivo para push:', pushError);
        // No fallar el login si falla el registro de push
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Cerrando sesión...');
    
    // Obtener el token actual antes de limpiar los datos
    const currentToken = localStorage.getItem('authToken');
    
    // Limpiar el cache de notificaciones del usuario actual
    if (currentToken) {
      notificationService.clearCache(currentToken);
      notificationService.clearStoredReadNotifications(currentToken);
      // Limpiar también el cache de comprobantes
      clearComprobantesCache(currentToken);
    }
    
    // Limpiar los datos de autenticación
    authService.logout();
    setUser(null);
    
    // Redirigir al index
    navigate('/');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
