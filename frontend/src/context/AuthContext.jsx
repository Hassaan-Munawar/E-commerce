import { createContext, useEffect, useState, useContext } from 'react';
import supabase from '../utils/supabase';
import axios from 'axios';
import { AppRoutes } from '../constant/AppRoutes';
import { UserInfoContext } from './UserInfoContext';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setUserInfo } = useContext(UserInfoContext);

  const fetchAndSetUserInfo = async (userId, full_name, email) => {
    if (!userId) return;
    try {
      axios.post(AppRoutes.login, { id: userId, full_name: full_name, email: email }).then((response) => {
        setUserInfo(response?.data?.data);
      })
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error(errorMsg);
    }
  };

  useEffect(() => {
    // Initial session load
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const user = session?.user || null;
      setUser(user);
      if (session?.user?.id) fetchAndSetUserInfo(session?.user?.id, session?.user?.user_metadata?.full_name, session?.user?.email);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        const user = session?.user || null;
        setUser(user);
      }
    );


    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}


