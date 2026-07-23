export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    const { allyCode } = await request.json();
    if (!allyCode || !/^\d{9,}$/.test(allyCode)) {
      return new Response(JSON.stringify({ error: 'Invalid ally code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const token = env.GH_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ error: 'GH_TOKEN secret not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const res = await fetch(
      'https://api.github.com/repos/DannKhan/SWGoH_w_OpenCode/actions/workflows/fetch-snapshot.yml/dispatches',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'swgoh-dispatch-worker',
        },
        body: JSON.stringify({ ref: 'master', inputs: { allyCode } }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      return new Response(JSON.stringify({ error: `GitHub API error ${res.status}`, body, statusText: res.statusText }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  },
};
