import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

// Define the type for the decoded JWT token
interface DecodedToken {
  email: string;
  userId: string;
  exp: number;
}

// Define the type for the auth context
interface AuthContextType {
  user: DecodedToken | null;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode; // This will allow any valid JSX to be passed as children
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use auth state
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider to manage login state
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  // Check login status on app load
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        setUser(null); // No token, user is not logged in
        return;
      }

      // Decode the token to get user info
      const decodedToken: DecodedToken = jwtDecode(token);
      console.log("🚀 ~ checkLoginStatus ~ decodedToken:", decodedToken);
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();

      if (isTokenExpired) {
        setUser(null); // Token expired, log user out
        await SecureStore.deleteItemAsync("authToken");
        return;
      }

      setUser(decodedToken); // Set user data if token is valid
    };

    checkLoginStatus();
  }, []);

  // Login function
  const login = async (token: string) => {
    await SecureStore.setItemAsync("authToken", token);
    const decodedToken: DecodedToken = jwtDecode(token);
    console.log("🚀 ~ login ~ decodedToken:", decodedToken);
    setUser(decodedToken); // Set user data when logging in
  };

  // Logout function
  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    setUser(null); // Clear user data on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
