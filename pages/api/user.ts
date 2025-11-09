// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClientInstance } from "@/lib/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClientInstance(req, res);
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return res.status(401).json({ user: null });
  }

  return res.status(200).json({ user: data.user });
}
