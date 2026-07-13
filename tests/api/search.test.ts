import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from '../../api/search';

const TEST_TOKEN = 'test-secret-token-xyz';

const makeRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const bodyOf = (res: any) => JSON.stringify(res.json.mock.calls[0]?.[0] ?? {});

describe('api/search', () => {
  const originalToken = process.env.TMDB_API_TOKEN;

  beforeEach(() => {
    process.env.TMDB_API_TOKEN = TEST_TOKEN;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.TMDB_API_TOKEN = originalToken;
  });

  it('query vacio -> 400', async () => {
    const req = { query: { query: '' } };
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('query de 201+ chars -> 400', async () => {
    const req = { query: { query: 'a'.repeat(201) } };
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('page no numerico -> 400', async () => {
    const req = { query: { query: 'matrix', page: 'abc' } };
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('page decimal -> 400', async () => {
    const req = { query: { query: 'matrix', page: '1.5' } };
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('page fuera de rango (0) -> 400', async () => {
    const req = { query: { query: 'matrix', page: '0' } };
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('page fuera de rango (1001) -> 400', async () => {
    const req = { query: { query: 'matrix', page: '1001' } };
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('falta TMDB_API_TOKEN -> 500 sin filtrar detalles internos', async () => {
    delete process.env.TMDB_API_TOKEN;
    const req = { query: { query: 'matrix' } };
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    const body = bodyOf(res);
    expect(body).not.toContain(TEST_TOKEN);
    expect(body).not.toMatch(/at .*\.ts:\d+/);
  });

  it('fetch a TMDb rechaza -> 502', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'));
    const req = { query: { query: 'matrix' } };
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(502);
  });

  it('exito -> reenvia status y body de TMDb', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: vi.fn().mockResolvedValue({ results: [] }),
    });
    const req = { query: { query: 'matrix', page: '2' } };
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ results: [] });
  });

  it('el token nunca aparece en el body de ninguna respuesta (exito/400/500/502)', async () => {
    const responses: any[] = [];

    function makeResAndCheck() {
      const res = makeRes();
      responses.push(res);
      return res;
    }

    // 400
    await handler({ query: { query: '' } }, makeResAndCheck());
    // 500
    delete process.env.TMDB_API_TOKEN;
    await handler({ query: { query: 'matrix' } }, makeResAndCheck());
    process.env.TMDB_API_TOKEN = TEST_TOKEN;
    // 502
    global.fetch = vi.fn().mockRejectedValue(new Error('down'));
    await handler({ query: { query: 'matrix' } }, makeResAndCheck());
    // 200
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: vi.fn().mockResolvedValue({ results: [] }),
    });
    await handler({ query: { query: 'matrix' } }, makeResAndCheck());

    for (const res of responses) {
      expect(bodyOf(res)).not.toContain(TEST_TOKEN);
    }
  });
});

