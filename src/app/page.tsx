import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>OpenAI Sentry Integration Test</h1>
      <p>This is a reproduction case for OpenAI not being correctly patched by Sentry instrumentation.</p>
      
      <h2>Test Endpoints:</h2>
      <ul>
        <li>
          <Link href="/openai-test" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            /openai-test
          </Link>
          {' '}- Server component with OpenAI integration
        </li>
        <li>
          <Link href="/api/openai" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            /api/openai
          </Link>
          {' '}- API route with OpenAI integration
        </li>
      </ul>

      <h2>Instructions:</h2>
      <ol>
        <li>Make sure you have set your <code>OPENAI_API_KEY</code> and optionally <code>SENTRY_DSN</code> in <code>.env.local</code></li>
        <li>Click on the test endpoints above</li>
        <li>Check the console output for Sentry spans and OpenAI instrumentation</li>
        <li>Look for spans in your Sentry project dashboard (if configured)</li>
      </ol>

      <p style={{ marginTop: '2rem', color: '#666' }}>
        See the <a href="https://github.com/your-repo/README.md" style={{ color: '#0070f3' }}>README</a> for more details.
      </p>
    </div>
  );
}

