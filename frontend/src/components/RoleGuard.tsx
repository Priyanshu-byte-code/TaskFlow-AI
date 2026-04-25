import { useAuth } from '../hooks/useAuth';

interface Props {
  allowedRoles: ('Admin' | 'Manager' | 'Member')[];
  children: JSX.Element;
}

const RoleGuard = ({ allowedRoles, children }: Props) => {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) return null;
  return children;
};

export default RoleGuard;
