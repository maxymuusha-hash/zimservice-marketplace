import type { Request } from "express";
import { createClient } from "@supabase/supabase-js";
import * as db from "../db";
import type { User } from "../../drizzle/schema";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type AuthenticatedUser = User & {
  isProvider?: boolean | null;
  bio?: string | null;
};

export const sdk = {
  async authenticateRequest(req: Request): Promise<AuthenticatedUser> {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new Error("Invalid Supabase token");
    }

    const supabaseUser = data.user;
    const openId = supabaseUser.id; // use Supabase UUID as openId

    let user = await db.getUserByOpenId(openId);

    if (!user) {
      await db.upsertUser({
        openId,
        name: supabaseUser.user_metadata?.full_name ?? supabaseUser.email ?? null,
        email: supabaseUser.email ?? null,
        loginMethod: "email",
        lastSignedIn: new Date(),
      });
      user = await db.getUserByOpenId(openId);
    }

    if (!user) throw new Error("User not found after upsert");

    return user as AuthenticatedUser;
  },
};
