// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

console.log('[Sentry] Initializing Sentry...');

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  debug: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Add Vercel AI Integration to automatically capture AI spans
  integrations: [
    Sentry.vercelAIIntegration(),
    Sentry.openAIIntegration({
      recordInputs: true,
      recordOutputs: true,
    }),
  ],

  beforeSendTransaction: (transaction) => {
    console.log(
      '[Sentry] Transaction:',
      transaction.transaction,
      'Spans:',
      transaction.spans?.length
    );
    transaction.spans?.forEach((span) => {
      console.log('  -', span.op, span.description);
    });
    return transaction;
  },
});

console.log('[Sentry] Sentry initialized');
