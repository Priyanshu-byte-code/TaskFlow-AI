import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export const useAuth = () => {
  const { user, accessToken, loading, error } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'Admin';
  const isManager = user?.role === 'Manager' || isAdmin;
  return { user, accessToken, loading, error, isAdmin, isManager };
};
