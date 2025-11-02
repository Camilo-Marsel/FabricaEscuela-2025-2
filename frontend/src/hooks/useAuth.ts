import { useState, useEffect } from 'react';

// Mock authentication hook
// TODO: Replace with real authentication using Supabase Auth when backend is integrated
// Example integration:
// import { supabase } from '@/lib/supabase';
// const { data: { user } } = await supabase.auth.getUser();

export type UserRole = 'admin' | 'driver' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication status
    // TODO: Replace with actual Supabase auth check
    // const checkAuth = async () => {
    //   const { data: { session } } = await supabase.auth.getSession();
    //   if (session?.user) {
    //     const { data: profile } = await supabase
    //       .from('profiles')
    //       .select('*, user_roles(role)')
    //       .eq('id', session.user.id)
    //       .single();
    //     setUser(profile);
    //   }
    //   setLoading(false);
    // };
    // checkAuth();
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole = 'driver') => {
    // TODO: Replace with actual Supabase login
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password
    // });
    
    // Mock login - just set user based on role
    setUser({
      id: role === 'admin' ? 'admin-001' : 'driver-001',
      name: role === 'admin' ? 'Admin User' : 'Juan Pérez',
      email,
      role
    });
  };

  const logout = async () => {
    // TODO: Replace with actual Supabase logout
    // await supabase.auth.signOut();
    
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isDriver: user?.role === 'driver'
  };
};
