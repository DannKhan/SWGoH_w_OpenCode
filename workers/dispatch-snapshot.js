const REPO = 'DannKhan/SWGoH_w_OpenCode';

async function dispatchWorkflow(env, workflowId, ref, inputs) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/actions/workflows/${workflowId}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GH_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'swgoh-dispatch-worker',
      },
      body: JSON.stringify({ ref, inputs }),
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
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders() });
    }

    const token = env.GH_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ error: 'GH_TOKEN secret not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      });
    }

    const body = await request.json();
    const type = body.type || 'snapshot';

    if (type === 'snapshot') {
      const { allyCode } = body;
      if (!allyCode || !/^\d{9,}$/.test(allyCode)) {
        return new Response(JSON.stringify({ error: 'Invalid ally code' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() },
        });
      }
      return dispatchWorkflow(env, 'fetch-snapshot.yml', 'master', { allyCode });
    }

    if (type === 'scan-gls') {
      const { guildId, guildName } = body;
      if (!guildId || !guildName) {
        return new Response(JSON.stringify({ error: 'Missing guildId or guildName' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() },
        });
      }
      return dispatchWorkflow(env, 'scan-guild-gls.yml', 'master', { guildId, guildName });
    }

    return new Response(JSON.stringify({ error: 'Unknown type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  },
};
