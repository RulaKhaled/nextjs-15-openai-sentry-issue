import * as Sentry from '@sentry/nextjs';
import { OpenAI } from 'openai';

export const dynamic = 'force-dynamic';

console.log('[Page] Loading openai-test page...');

export default async function OpenaiTest() {
  console.log('[Page] Rendering OpenaiTest component');

  const prompt = 'Hello!';

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  await Sentry.startSpan(
    { op: 'ai.openai', name: 'openai-test-page' },
    async () => {
      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      });
      console.log('[Page] Response:', response);
      return response;
    }
  );

  return <div>OpenAI Test</div>;
}
