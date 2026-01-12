/**
 * Minimal Data Cache Demo
 *
 * This server component fetches site preferences from GraphQL
 * with Next.js Data Cache + tag-based invalidation.
 */

async function getSitePrefs() {
  const res = await fetch(process.env.GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GRAPHQL_TOKEN}`,
    },
    body: JSON.stringify({
      query: `query { sitePreferences(siteId: "demo") { json } }`,
      variables: { siteId: 'demo' },
    }),
    cache: 'force-cache',
    next: { tags: ['site-prefs'] },
  });

  const data = await res.json();
  if (!data.data?.sitePreferences?.json) {
    console.error('GraphQL error:', JSON.stringify(data));
    throw new Error('Failed to fetch site preferences');
  }
  return data.data.sitePreferences.json;
}

export default async function Home() {
  const prefs = await getSitePrefs();

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Data Cache Demo</h1>

      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Site Preferences</h2>
        <p className="text-gray-800"><strong>Brand:</strong> {prefs.brandName}</p>
        <p className="text-gray-800"><strong>Primary Color:</strong> {prefs.theme.primaryColor}</p>
        <p className="mt-4 text-lg text-gray-800">
          <strong>Fetched at:</strong>{' '}
          <code className="bg-yellow-200 text-gray-900 px-2 py-1 rounded">{prefs.lastUpdated}</code>
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold mb-2 text-gray-900">Test the cache:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-800">
          <li>Refresh this page - timestamp stays the same (cache hit)</li>
          <li>Invalidate the cache:
            <pre className="mt-1 bg-gray-800 text-green-400 p-2 rounded text-xs overflow-x-auto">
{`curl -X POST http://localhost:3000/api/revalidate \\
  -H "Authorization: Bearer my-webhook-secret-123"`}
            </pre>
          </li>
          <li>Refresh again - timestamp updates (cache miss)</li>
        </ol>
      </div>
    </main>
  );
}
