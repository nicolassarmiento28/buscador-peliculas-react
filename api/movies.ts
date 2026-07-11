// Vercel Serverless Function (Node runtime). Mismo patron que api/search.ts:
// tipos req/res "any" (no @vercel/node instalado), token TMDb solo server-side.
// Un solo archivo con `type` como discriminador para no duplicar el
// boilerplate de validacion/token/error handling en 4 archivos separados.

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const ALLOWED_SORT_BY = [
  'popularity.desc',
  'vote_average.desc',
  'primary_release_date.desc',
];

const isValidPage = (rawPage: unknown): boolean => {
  const page = Number(typeof rawPage === 'string' ? rawPage : '1');
  return Number.isInteger(page) && page >= 1 && page <= 1000;
};

const isValidId = (rawId: unknown): boolean => {
  const id = Number(rawId);
  return typeof rawId === 'string' && Number.isInteger(id) && id > 0;
};

export default async function handler(req: any, res: any) {
  const type = typeof req.query?.type === 'string' ? req.query.type : '';
  const page = typeof req.query?.page === 'string' ? req.query.page : '1';

  const token = process.env.TMDB_API_TOKEN;
  if (!token) {
    res.status(500).json({
      status_message:
        'No se encontro TMDB_API_TOKEN en el servidor. Configura la variable de entorno y vuelve a desplegar.',
    });
    return;
  }

  let url: string;

  if (type === 'trending') {
    if (!isValidPage(page)) {
      res.status(400).json({ status_message: 'El parametro "page" es invalido.' });
      return;
    }
    url = `${TMDB_BASE_URL}/trending/movie/day?page=${encodeURIComponent(page)}`;
  } else if (type === 'discover') {
    const genreId = req.query?.genre_id;
    const sortBy =
      typeof req.query?.sort_by === 'string'
        ? req.query.sort_by
        : 'popularity.desc';

    if (!isValidId(genreId)) {
      res.status(400).json({ status_message: 'El parametro "genre_id" es invalido.' });
      return;
    }
    if (!ALLOWED_SORT_BY.includes(sortBy)) {
      res.status(400).json({ status_message: 'El parametro "sort_by" es invalido.' });
      return;
    }
    if (!isValidPage(page)) {
      res.status(400).json({ status_message: 'El parametro "page" es invalido.' });
      return;
    }

    url = `${TMDB_BASE_URL}/discover/movie?with_genres=${encodeURIComponent(genreId)}&sort_by=${encodeURIComponent(sortBy)}&page=${encodeURIComponent(page)}`;
  } else if (type === 'credits' || type === 'videos') {
    const movieId = req.query?.id;
    if (!isValidId(movieId)) {
      res.status(400).json({ status_message: 'El parametro "id" es invalido.' });
      return;
    }
    url = `${TMDB_BASE_URL}/movie/${encodeURIComponent(movieId)}/${type}`;
  } else {
    res.status(400).json({ status_message: 'El parametro "type" es invalido.' });
    return;
  }

  try {
    const tmdbResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    const data = await tmdbResponse.json();
    res.status(tmdbResponse.status).json(data);
  } catch (error) {
    console.error('Error al consultar TMDb:', error);
    res.status(502).json({ status_message: 'Error al consultar TMDb.' });
  }
}
