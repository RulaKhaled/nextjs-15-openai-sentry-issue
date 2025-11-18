# OpenAI Sentry Integration Reproduction Case

This repository is a minimal reproduction case for testing OpenAI instrumentation with Sentry in Next.js 15.

## 🐛 Issue

OpenAI SDK is not being correctly patched by Sentry's automatic instrumentation, resulting in missing spans and telemetry data for OpenAI API calls. More context can be found here https://linear.app/getsentry/issue/JS-1085/investigate-openai-missing-spans-for-nextjs

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

### ✅ Scenario 1: Using Webpack Externals (Working)

When running with the webpack configuration approach:

```typescript
webpack(config, { isServer }) {
  if (isServer) {
    // Force 'openai' to be required dynamically (not bundled)
    // This allows Sentry to properly instrument the OpenAI SDK at runtime
    config.externals = config.externals || [];
    config.externals.push('openai');
  }
  return config;
}
```

**Expected Result:**
- OpenAI API calls should appear as child spans under the parent Sentry transaction
- When testing http://localhost:3000/api/openai:
  - Span name: `Generative AI model operation`
  - Span op: `gen_ai.chat`
  - This span should be a child of `api.route`
- When testing http://localhost:3000/openai-test:
  - Span name: `Generative AI model operation`
  - Span op: `gen_ai.chat`
  - This span should be a child of `ai.openai`
- The `beforeSendTransaction` hook should log these spans in the console
- Both input prompts and output completions should be captured (if `recordInputs` and `recordOutputs` are enabled)

**Actual Result:**
✅ **Working as expected** - You will see the correct AI spans in both development and production modes. The OpenAI SDK is properly instrumented by Sentry.

### ❌ Scenario 2: Using serverExternalPackages (Not Working)

When you replace the webpack configuration with Next.js's `serverExternalPackages`:

```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ['openai'],
  // Remove or comment out the webpack configuration
};
```

**Expected Result:**
- OpenAI API calls should appear as child spans under the parent Sentry transaction
- When testing http://localhost:3000/api/openai:
  - Span name: `Generative AI model operation`
  - Span op: `gen_ai.chat`
  - This span should be a child of `api.route`
- When testing http://localhost:3000/openai-test:
  - Span name: `Generative AI model operation`
  - Span op: `gen_ai.chat`
  - This span should be a child of `ai.openai`
- The `beforeSendTransaction` hook should log these spans in the console
- Both input prompts and output completions should be captured (if `recordInputs` and `recordOutputs` are enabled)

**Actual Result:**
❌ **Not working** - AI spans will no longer show in both development and production modes. Only the parent transaction span appears, without any child spans for OpenAI API calls. The OpenAI SDK is not being properly instrumented by Sentry. This behavior persists regardless of the environment.

