// Vercel Serverless Function (Node runtime). No usa @vercel/node porque no
// esta instalado en el proyecto; los tipos req/res son compatibles con
// http.IncomingMessage/ServerResponse que Vercel provee en runtime.
// ponytail: tipos "any" minimos para req/res, no vale la pena instalar
// @vercel/node solo por los tipos de esta funcion.

const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';

export default async function handler(req: any, res: any) {
  const query = typeof req.query?.query === 'string' ? req.query.query : '';
  const rawPage = typeof req.query?.page === 'string' ? req.query.page : '1';

  if (!query.trim() || query.length > 200) {
    res.status(400).json({ status_message: 'El parametro "query" es invalido.' });
    return;
  }

  const page = Number(rawPage);
  if (!Number.isInteger(page) || page < 1 || page > 1000) {
    res.status(400).json({ status_message: 'El parametro "page" es invalido.' });
    return;
  }

  const token = process.env.TMDB_API_TOKEN;
  if (!token) {
    res.status(500).json({
      status_message:
        'No se encontro TMDB_API_TOKEN en el servidor. Configura la variable de entorno y vuelve a desplegar.',
    });
    return;
  }

  try {
    const url = `${TMDB_SEARCH_URL}?query=${encodeURIComponent(query)}&page=${encodeURIComponent(page)}`;
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
