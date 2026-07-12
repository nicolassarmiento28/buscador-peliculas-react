import { useEffect, useState } from 'react';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../services/firebase';

interface UseAuthResult {
  user: User | null;
  loading: boolean;
}

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ponytail: si el redirect falla (login cancelado, error de red) no debe
    // romper el mount; onAuthStateChanged igual resuelve el estado final.
    getRedirectResult(auth).catch((error) =>
      console.error('Error al resolver el redirect de Google:', error)
    );

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  return { user, loading };
};
