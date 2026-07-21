import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { readFileSync } from 'node:fs';
import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest';

let testEnv: RulesTestEnvironment;

const UID_A = 'user-a';
const UID_B = 'user-b';

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'biblioteca-de-peliculas-cb2ea',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

const seedList = async (isPublic: boolean) => {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'lists', UID_A), {
      ownerId: UID_A,
      title: 'Mi lista',
      isPublic,
      shareSlug: 'abc12345',
      createdAt: Date.now(),
    });
  });
};

const seedItem = async () => {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'lists', UID_A, 'items', 'item-1'), {
      movieId: 1,
      movieTitle: 'Some movie',
      posterPath: '/x.jpg',
      addedAt: Date.now(),
    });
  });
};

describe('firestore.rules - lists/{listId}', () => {
  it('usuario B autenticado NO puede leer la lista privada de A', async () => {
    await seedList(false);
    const ctxB = testEnv.authenticatedContext(UID_B);
    await assertFails(getDoc(doc(ctxB.firestore(), 'lists', UID_A)));
  });

  it('usuario B autenticado NO puede actualizar la lista de A', async () => {
    await seedList(false);
    const ctxB = testEnv.authenticatedContext(UID_B);
    await assertFails(
      setDoc(doc(ctxB.firestore(), 'lists', UID_A), { title: 'hijacked' }, { merge: true })
    );
  });

  it('allow delete: if false bloquea incluso al dueno', async () => {
    await seedList(false);
    const ctxA = testEnv.authenticatedContext(UID_A);
    await assertFails(deleteDoc(doc(ctxA.firestore(), 'lists', UID_A)));
  });

  it('lectura publica permitida si isPublic == true', async () => {
    await seedList(true);
    const ctxAnon = testEnv.unauthenticatedContext();
    await assertSucceeds(getDoc(doc(ctxAnon.firestore(), 'lists', UID_A)));
  });

  it('lectura publica denegada si isPublic == false', async () => {
    await seedList(false);
    const ctxAnon = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(ctxAnon.firestore(), 'lists', UID_A)));
  });

  it('lectura publica denegada si el doc no existe (primera visita)', async () => {
    const ctxAnon = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(ctxAnon.firestore(), 'lists', UID_A)));
  });

  it('nadie puede hacer un query/list sobre la coleccion lists (evita enumeracion de shareSlug)', async () => {
    await seedList(true);
    const ctxAnon = testEnv.unauthenticatedContext();
    await assertFails(
      getDocs(query(collection(ctxAnon.firestore(), 'lists'), where('isPublic', '==', true)))
    );
    const ctxA = testEnv.authenticatedContext(UID_A);
    await assertFails(getDocs(collection(ctxA.firestore(), 'lists')));
  });

  it('el dueno autenticado puede crear su propia lista (doc aun no existe)', async () => {
    const ctxA = testEnv.authenticatedContext(UID_A);
    await assertSucceeds(
      setDoc(doc(ctxA.firestore(), 'lists', UID_A), {
        ownerId: UID_A,
        title: 'Mi lista',
        isPublic: false,
        shareSlug: 'abc12345',
        createdAt: Date.now(),
      })
    );
  });

  it('la creacion falla si ownerId no coincide con el uid del dueno', async () => {
    const ctxA = testEnv.authenticatedContext(UID_A);
    await assertFails(
      setDoc(doc(ctxA.firestore(), 'lists', UID_A), {
        ownerId: UID_B,
        title: 'Mi lista',
        isPublic: false,
        shareSlug: 'abc12345',
        createdAt: Date.now(),
      })
    );
  });
});

describe('firestore.rules - lists/{listId}/items/{itemId}', () => {
  it('el dueno lee y escribe sus propios items', async () => {
    await seedList(false);
    await seedItem();
    const ctxA = testEnv.authenticatedContext(UID_A);
    await assertSucceeds(getDoc(doc(ctxA.firestore(), 'lists', UID_A, 'items', 'item-1')));
    await assertSucceeds(
      setDoc(doc(ctxA.firestore(), 'lists', UID_A, 'items', 'item-2'), {
        movieId: 2,
        movieTitle: 'Otra',
        posterPath: '/y.jpg',
        addedAt: Date.now(),
      })
    );
  });

  it('otro usuario autenticado no puede leer ni escribir items ajenos', async () => {
    await seedList(false);
    await seedItem();
    const ctxB = testEnv.authenticatedContext(UID_B);
    await assertFails(getDoc(doc(ctxB.firestore(), 'lists', UID_A, 'items', 'item-1')));
    await assertFails(
      setDoc(doc(ctxB.firestore(), 'lists', UID_A, 'items', 'item-2'), {
        movieId: 2,
        movieTitle: 'Otra',
        posterPath: '/y.jpg',
        addedAt: Date.now(),
      })
    );
  });

  it('lectura publica de items permitida solo si el doc padre es publico', async () => {
    await seedList(true);
    await seedItem();
    const ctxAnon = testEnv.unauthenticatedContext();
    await assertSucceeds(getDoc(doc(ctxAnon.firestore(), 'lists', UID_A, 'items', 'item-1')));
  });

  it('lectura publica de items denegada si el doc padre es privado', async () => {
    await seedList(false);
    await seedItem();
    const ctxAnon = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(ctxAnon.firestore(), 'lists', UID_A, 'items', 'item-1')));
  });
});

