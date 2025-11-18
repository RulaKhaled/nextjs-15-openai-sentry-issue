import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as Sentry from '@sentry/nextjs';

console.log('[API] Loading OpenAI module...');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

console.log(
  '[API] OpenAI client created:',
  typeof client,
  client.constructor.name
);

export async function GET(request: Request) {
  console.log('[API] GET request received');

  return await Sentry.startSpan(
    { op: 'api.route', name: 'openai-api-test' },
    async () => {
      const prompt = 'Hello!';

      console.log('[API] Calling OpenAI...');
      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      });

      console.log('[API] OpenAI response received');
      console.log('[API] Response:', response.choices[0].message.content);

      return NextResponse.json(response.choices[0].message.content);
    }
  );
}
