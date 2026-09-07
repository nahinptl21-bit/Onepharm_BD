import { app } from "./app";

// Export default serverless handler for Vercel
export default function handler(req: any, res: any) {
  return app(req, res);
}
