import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

// Devuelve el movieId del primer item guardado en la lista del usuario
// (o null si no tiene sesion o la lista esta vacia), para alimentar la fila
// "Basado en tu lista" con getMovieRecommendations.
export const useFirstListMovieId = (user: User | null): number | null => {
  const [movieId, setMovieId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setMovieId(null);
      return;
    }

    return onSnapshot(
      collection(db, 'lists', user.uid, 'items'),
      (snapshot) => {
        const first = snapshot.docs[0];
        setMovieId(first ? (first.data().movieId as number) : null);
      },
      (error) => console.error('Error leyendo la lista del usuario:', error)
    );
  }, [user]);

  return movieId;
};
