# Data Cache Demo

Minimal demo of Next.js Data Cache with tag-based invalidation.

## Setup

```bash
npm install
```

## Run

Terminal 1 - Mock GraphQL server:
```bash
node mock-graphql-server.js
```

Terminal 2 - Next.js:
```bash
npm run dev
```

Open http://localhost:3000

## Test

1. Refresh the page - timestamp stays the same (cache hit)
2. Invalidate:
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Authorization: Bearer my-webhook-secret-123"
   ```
3. Refresh - timestamp updates (cache miss)
