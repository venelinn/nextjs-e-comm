// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";

export function createServerClientInstance(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      get(name) {
        return req.cookies[name];
      },
      set(name, value, options) {
        if (res) {
          const cookie = `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; ${
            options?.maxAge ? `Max-Age=${options.maxAge};` : ""
          }`;
          res.setHeader("Set-Cookie", cookie);
        }
      },
      remove(name) {
        if (res) {
          res.setHeader("Set-Cookie", `${name}=; Path=/; Max-Age=0`);
        }
      },
    },
  });
}
