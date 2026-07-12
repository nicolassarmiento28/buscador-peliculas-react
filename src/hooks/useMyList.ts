import { useCallback, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Movie } from '../types/movies';

interface ListItemDoc {
  docId: string;
  movieId: number;
}

// ponytail: shareSlug generado con crypto.randomUUID().slice(0, 8), no hace
// falta un generador de slugs dedicado para un identificador que solo debe
// ser unico y url-safe.
const createShareSlug = (): string => crypto.randomUUID().slice(0, 8);

interface UseMyListResult {
  shareSlug: string | null;
  isFavorite: (movieId: number) => boolean;
  isSaving: (movieId: number) => boolean;
  toggleFavorite: (movie: Movie) => void;
}

// Resuelve (o crea, la primera vez) la lista personal del usuario logueado
// y mantiene sus items sincronizados en tiempo real via onSnapshot.
export const useMyList = (user: User | null): UseMyListResult => {
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [items, setItems] = useState<ListItemDoc[]>([]);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) {
      setShareSlug(null);
      setItems([]);
      return;
    }

    let cancelled = false;

    // Doc id = uid: la lista propia de un usuario es unica por diseno, asi
    // que resolver/crearla es una transaccion sobre un id determinista en
    // vez de un query + create (evita listas duplicadas si el usuario abre
    // dos pestanas antes de tener lista).
    const ownListRef = doc(db, 'lists', user.uid);

    runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ownListRef);
      if (snap.exists()) {
        return snap.data().shareSlug as string;
      }

      const slug = createShareSlug();
      transaction.set(ownListRef, {
        ownerId: user.uid,
        title: 'Mi lista',
        isPublic: false,
        shareSlug: slug,
        createdAt: serverTimestamp(),
      });
      return slug;
    })
      .then((slug) => {
        if (!cancelled) setShareSlug(slug);
      })
      .catch((error) => {
        console.error('Error resolviendo la lista del usuario:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const listId = user?.uid ?? null;

  useEffect(() => {
    if (!listId) return;

    return onSnapshot(
      collection(db, 'lists', listId, 'items'),
      (snapshot) => {
        setItems(
          snapshot.docs.map((docSnap) => ({
            docId: docSnap.id,
            movieId: docSnap.data().movieId as number,
          }))
        );
      },
      (error) => console.error('Error escuchando items de la lista:', error)
    );
  }, [listId]);

  const isFavorite = useCallback(
    (movieId: number) => items.some((item) => item.movieId === movieId),
    [items]
  );

  const isSaving = useCallback(
    (movieId: number) => savingIds.has(movieId),
    [savingIds]
  );

  const toggleFavorite = useCallback(
    (movie: Movie) => {
      if (!listId) return;

      setSavingIds((prev) => new Set(prev).add(movie.id));

      const existing = items.find((item) => item.movieId === movie.id);
      const itemsRef = collection(db, 'lists', listId, 'items');
      const request = existing
        ? deleteDoc(doc(itemsRef, existing.docId))
        : setDoc(doc(itemsRef), {
            movieId: movie.id,
            movieTitle: movie.title,
            posterPath: movie.poster_path,
            addedAt: serverTimestamp(),
          });

      request
        .catch((error) =>
          console.error('Error actualizando favoritos en Firestore:', error)
        )
        .finally(() => {
          setSavingIds((prev) => {
            const next = new Set(prev);
            next.delete(movie.id);
            return next;
          });
        });
    },
    [listId, items]
  );

  return { shareSlug, isFavorite, isSaving, toggleFavorite };
};
