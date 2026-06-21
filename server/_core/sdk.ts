import type { Request } from "express";
import { createClient } from "@supabase/supabase-js";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
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
      throw new Error("Missing Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new Error("Invalid Supabase token");
    }

    const supabaseUser = data.user;
    const openId = supabaseUser.id;

    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    let [user] = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

    if (!user) {
      await db.insert(users).values({
        openId,
        name: supabaseUser.user_metadata?.full_name ?? supabaseUser.email ?? null,
        email: supabaseUser.email ?? null,
        loginMethod: "email",
        lastSignedIn: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      [user] = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    }

    if (!user) throw new Error("User not found after insert");

    return user as AuthenticatedUser;
  },
};
