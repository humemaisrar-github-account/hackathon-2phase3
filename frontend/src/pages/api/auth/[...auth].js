import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";

// Initialize Better Auth with PostgreSQL configuration
const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/todo_app",
  },
  secret: process.env.BETTER_AUTH_SECRET || "IzppJvlcHVtQPU7z2kxuIgn6qbG6yqL0",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001", // Updated to match actual port
  trustHost: true,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  // Enable JWT for compatibility with the backend
  jwt: {
    expiresIn: "7d", // Token expires in 7 days
  },
  // Allow session access via API for JWT retrieval
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
  },
  // Ensure proper error handling and JSON responses
  social: {
    providers: [], // No social providers for now
  },
  // Ensure all responses are JSON
  hooks: {
    after: [
      {
        middleware: (ctx) => {
          // Ensure all responses are JSON
          ctx.response.headers.set("Content-Type", "application/json");
          return ctx.response;
        }
      }
    ]
  }
});

// Create Next.js API handler
const handler = toNextJsHandler(auth);

export default handler;

// Export all methods
export const { GET, POST } = handler;