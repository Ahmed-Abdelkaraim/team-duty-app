import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import TransportDashboard from '@/components/TransportDashboard';
import ExternalDashboard from '@/components/ExternalDashboard';
import { User } from '@/types/attendance';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.team === 'نقل') {
    return <TransportDashboard user={user} onLogout={handleLogout} />;
  }

  return <ExternalDashboard user={user} onLogout={handleLogout} />;
};

export default Index;
