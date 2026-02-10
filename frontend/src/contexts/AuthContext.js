import { createContext, useContext } from 'react';
import { AuthProvider } from './AuthContext.jsx';
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export { AuthProvider };
