// Vercel Serverless Function (Node runtime). Mismo patron que api/search.ts
// y api/movies.ts: tipos req/res "any" (no @vercel/node instalado).
//
// Usa Firebase Admin SDK (no el SDK cliente) para poder resolver
// shareSlug -> lista puntual sin exponer un `list`/query de coleccion al
// cliente. El Admin SDK no esta sujeto a firestore.rules, por eso el
// filtro isPublic==true se aplica aca mismo antes de responder.
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const isValidSlug = (raw: unknown): raw is string =>
  typeof raw === 'string' && /^[a-zA-Z0-9_-]{4,64}$/.test(raw);

const getDb = () => {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        // Vercel guarda saltos de linea escapados en la env var.
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
          /\\n/g,
          '\n'
        ),
      }),
    });
  }
  return getFirestore();
};

export default async function handler(req: any, res: any) {
  const shareSlug = req.query?.shareSlug;

  if (!isValidSlug(shareSlug)) {
    res
      .status(400)
      .json({ status_message: 'El parametro "shareSlug" es invalido.' });
    return;
  }

  if (
    !process.env.FIREBASE_ADMIN_PROJECT_ID ||
    !process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
    !process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ) {
    res.status(500).json({
      status_message:
        'Configuracion del servidor incompleta. Intenta mas tarde.',
    });
    return;
  }

  try {
    const db = getDb();
    const snap = await db
      .collection('lists')
      .where('shareSlug', '==', shareSlug)
      .where('isPublic', '==', true)
      .limit(1)
      .get();

    if (snap.empty) {
      res.status(404).json({ status_message: 'Lista no encontrada.' });
      return;
    }

    const listDoc = snap.docs[0];
    const itemsSnap = await listDoc.ref.collection('items').get();
    const items = itemsSnap.docs.map((itemDoc: any) => {
      const data = itemDoc.data();
      return {
        movieId: data.movieId,
        movieTitle: data.movieTitle,
        posterPath: data.posterPath ?? null,
      };
    });

    res.status(200).json({ title: listDoc.data().title, items });
  } catch (error) {
    console.error('Error al leer la lista publica:', error);
    res.status(502).json({ status_message: 'Error al leer la lista.' });
  }
}
