// Server-side proxy for ESPN World Cup scoreboard — kills CORS issues.
exports.handler = async function(event) {
  const dates = (event.queryStringParameters && event.queryStringParameters.dates) || '';
  const url = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?limit=950' + (dates ? '&dates=' + dates : '');
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: 'ESPN returned ' + res.status }) };
    }
    const data = await res.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60'
      },
      body: data
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: String(e) }) };
  }
};
