# OpenAI Sentry Integration Reproduction Case

This repository is a minimal reproduction case for testing OpenAI instrumentation with Sentry in Next.js 15.

## 🐛 Issue

OpenAI SDK is not being correctly patched by Sentry's automatic instrumentation, resulting in missing spans and telemetry data for OpenAI API calls.

## 📋 Setup

### Prerequisites

- Node.js 20+ installed
- OpenAI API key
- Sentry account and DSN (optional for testing)

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd nextjs-15-openai-sentry-repro
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with your credentials:
```bash
# Required: OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Sentry Configuration (for sending data to your own Sentry project)
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org_slug
SENTRY_PROJECT=your_sentry_project_slug

# Optional: Sentry Auth Token (for uploading source maps)
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
```

Note: If you don't provide Sentry credentials, the instrumentation will still run locally but won't send data to Sentry.

### Running the App

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Visit the test endpoints:
- **Page Component**: http://localhost:3000/openai-test
- **API Route**: http://localhost:3000/api/openai

## 🔍 What to Check

When running the application, observe the console output for:

1. **Sentry Initialization**: Check if Sentry is initialized with the OpenAI integration
2. **OpenAI Client Creation**: Look for debug logs about the OpenAI client being wrapped
3. **Transaction Spans**: The `beforeSendTransaction` hook in `sentry.server.config.ts` will log all spans
4. **Expected Behavior**: OpenAI API calls should appear as child spans under the parent Sentry span
5. **Actual Behavior**: If the issue persists, you won't see OpenAI-specific spans being captured

## 📁 Key Files

### Application Files

- **`src/app/openai-test/page.tsx`**: Server component that tests OpenAI integration in a page context
- **`src/app/api/openai/route.ts`**: API route that tests OpenAI integration in an API context
- **`src/app/layout.tsx`**: Root layout component

### Sentry Configuration

- **`sentry.server.config.ts`**: Sentry configuration for Node.js runtime (includes OpenAI integration)
- **`sentry.edge.config.ts`**: Sentry configuration for Edge runtime
- **`src/instrumentation.ts`**: Next.js instrumentation file that loads Sentry based on runtime
- **`next.config.ts`**: Next.js configuration with Sentry webpack plugin and OpenAI externalization

### Configuration Details

The `next.config.ts` file includes important webpack configuration:

```javascript
webpack(config, { isServer }) {
  if (isServer) {
    // Force 'openai' to be required dynamically (not bundled)
    config.externals = config.externals || [];
    config.externals.push('openai');
  }
  return config;
}
```

This ensures that the OpenAI package is not bundled by webpack, allowing Sentry to properly instrument it at runtime.

## 🔧 Sentry Configuration

The Sentry server configuration (`sentry.server.config.ts`) includes:

```javascript
integrations: [
  Sentry.vercelAIIntegration(),
  Sentry.openAIIntegration({
    recordInputs: true,
    recordOutputs: true,
  }),
]
```

This should automatically instrument OpenAI SDK calls and create spans with input/output data.

## 📊 Expected Results

When properly instrumented, you should see:

1. A parent span for the request/page load
2. Child spans for OpenAI API calls with:
   - Operation type: `ai.openai` or similar
   - Input/output data (prompts and completions)
   - Timing information

## 🚨 Current Issue

If OpenAI is not being patched correctly, you will only see:

1. The parent span (`openai-test-page` or `openai-api-test`)
2. No child spans for the actual OpenAI API calls
3. Console logs showing `Is wrapped? false` in the API route

## 🐞 Debugging

Check the console output when the application runs. The following debug logs are included:

- `[Sentry] Initializing Sentry...`: Confirms Sentry is loading
- `[Sentry] Sentry initialized`: Confirms initialization complete
- `[API] Is wrapped?`: Shows if the OpenAI client is wrapped by Sentry
- `[Sentry] Transaction:`: Lists all spans in each transaction

## 📝 Notes

- This repo uses Next.js 15.5.4 with React 19
- OpenAI SDK version: 5.18.0
- Sentry Next.js SDK version: 10.22.0
- The `TURBOPACK=0` flag is used to disable Turbopack for better debugging
- Webpack is configured to externalize the OpenAI package to allow runtime instrumentation

## 🤝 Contributing

If you find the issue or have a solution, please feel free to open an issue or pull request.

## 📄 License

MIT
