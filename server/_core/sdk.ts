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
    console.log("[Auth] Authorization header:", authHeader ? "present" : "missing");

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("[Auth] No Bearer token found");
      throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("[Auth] Token length:", token.length);

    const { data, error } = await supabase.auth.getUser(token);
    console.log("[Auth] Supabase getUser result:", error ? `error: ${error.message}` : `user: ${data.user?.id}`);

    if (error || !data.user) {
      throw new Error("Invalid Supabase token");
    }

    const supabaseUser = data.user;
    const openId = supabaseUser.id;

    let user = await db.getUserByOpenId(openId);
    console.log("[Auth] DB user found:", !!user);

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
