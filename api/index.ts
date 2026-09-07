import { app } from "./app";

// In Vercel serverless environment, Express `app` is a callable (req, res) handler.
// Exporting both default and named handler ensures compatibility with all Vercel node runtimes.
export default app;
export const handler = app;
