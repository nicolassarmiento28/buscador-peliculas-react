import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from '../../api/movies';

const TEST_TOKEN = 'test-secret-token-xyz';

const makeRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const bodyOf = (res: any) => JSON.stringify(res.json.mock.calls[0]?.[0] ?? {});

const okFetch = () =>
  vi.fn().mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({ results: [] }) });

describe('api/movies', () => {
  const originalToken = process.env.TMDB_API_TOKEN;

  beforeEach(() => {
    process.env.TMDB_API_TOKEN = TEST_TOKEN;
    vi.restoreAllMocks();
    global.fetch = okFetch();
  });

  afterEach(() => {
    process.env.TMDB_API_TOKEN = originalToken;
  });

  it('type fuera de whitelist -> 400', async () => {
    const res = makeRes();
    await handler({ query: { type: 'not-a-real-type' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('discover sin genre_id -> 400', async () => {
    const res = makeRes();
    await handler({ query: { type: 'discover' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('discover con genre_id no numerico -> 400', async () => {
    const res = makeRes();
    await handler({ query: { type: 'discover', genre_id: 'abc' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('discover con genre_id negativo -> 400', async () => {
    const res = makeRes();
    await handler({ query: { type: 'discover', genre_id: '-5' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('discover con sort_by fuera de whitelist -> 400', async () => {
    const res = makeRes();
    await handler(
      { query: { type: 'discover', genre_id: '28', sort_by: 'title.asc' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('discover valido -> 200', async () => {
    const res = makeRes();
    await handler(
      { query: { type: 'discover', genre_id: '28', sort_by: 'popularity.desc' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it.each(['credits', 'videos', 'recommendations'])(
    '%s sin id -> 400',
    async (type) => {
      const res = makeRes();
      await handler({ query: { type } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
    }
  );

  it.each(['credits', 'videos', 'recommendations'])(
    '%s con id invalido -> 400',
    async (type) => {
      const res = makeRes();
      await handler({ query: { type, id: 'not-a-number' } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
    }
  );

  it('credits con id valido -> 200', async () => {
    const res = makeRes();
    await handler({ query: { type: 'credits', id: '123' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('falta TMDB_API_TOKEN -> 500 sin filtrar detalles internos', async () => {
    delete process.env.TMDB_API_TOKEN;
    const res = makeRes();
    await handler({ query: { type: 'trending' } }, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(bodyOf(res)).not.toContain(TEST_TOKEN);
  });

  it('fetch a TMDb rechaza -> 502', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'));
    const res = makeRes();
    await handler({ query: { type: 'trending' } }, res);
    expect(res.status).toHaveBeenCalledWith(502);
  });

  it('el token nunca aparece en el body de ninguna respuesta (exito/400/500/502)', async () => {
    const responses: any[] = [];
    const push = () => {
      const res = makeRes();
      responses.push(res);
      return res;
    };

    await handler({ query: { type: 'bogus' } }, push()); // 400
    delete process.env.TMDB_API_TOKEN;
    await handler({ query: { type: 'trending' } }, push()); // 500
    process.env.TMDB_API_TOKEN = TEST_TOKEN;
    global.fetch = vi.fn().mockRejectedValue(new Error('down'));
    await handler({ query: { type: 'trending' } }, push()); // 502
    global.fetch = okFetch();
    await handler({ query: { type: 'trending' } }, push()); // 200

    for (const res of responses) {
      expect(bodyOf(res)).not.toContain(TEST_TOKEN);
    }
  });
});

