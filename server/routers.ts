import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import {
  users,
  services,
  bookings,
  reviews,
  type InsertService,
  type InsertBooking,
  type InsertReview,
} from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  provider: router({
    onboard: protectedProcedure
      .input(
        z.object({
          bio: z.string().min(10).max(1000),
          phone: z.string().optional(),
          location: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db
          .update(users)
          .set({ isProvider: true, bio: input.bio, role: "provider" })
          .where(eq(users.id, ctx.user.id));
        return { success: true };
      }),

    list: publicProcedure
      .input(
        z.object({
          category: z.string().optional(),
          search: z.string().optional(),
        }).nullish().transform(val => val ?? {})
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const providers = await db
          .select()
          .from(users)
          .where(eq(users.isProvider, true));
        return providers;
      }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const [provider] = await db
          .select()
          .from(users)
          .where(and(eq(users.id, input.id), eq(users.isProvider, true)))
          .limit(1);
        if (!provider) return null;
        const providerServices = await db
          .select()
          .from(services)
          .where(eq(services.providerId, input.id));
        const providerReviews = await db
          .select()
          .from(reviews)
          .where(eq(reviews.providerId, input.id))
          .orderBy(desc(reviews.createdAt));
        return { ...provider, services: providerServices, reviews: providerReviews };
      }),
  }),

  services: router({
    list: publicProcedure
      .input(
        z.object({
          category: z
            .enum(["household chores", "repairs", "personal care", "skilled trades"])
            .optional(),
          search: z.string().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
        }).nullish().transform(val => val ?? {})
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const allServices = await db
          .select({
            id: services.id,
            name: services.name,
            description: services.description,
            price: services.price,
            unit: services.unit,
            pricingNotes: services.pricingNotes,
            category: services.category,
            providerId: services.providerId,
            providerName: users.name,
            providerBio: users.bio,
            createdAt: services.createdAt,
          })
          .from(services)
          .innerJoin(users, eq(services.providerId, users.id));

        return allServices.filter((s) => {
          if (input.category && s.category !== input.category) return false;
          if (input.minPrice && s.price < input.minPrice) return false;
          if (input.maxPrice && s.price > input.maxPrice) return false;
          if (
            input.search &&
            !s.name.toLowerCase().includes(input.search.toLowerCase()) &&
            !s.description?.toLowerCase().includes(input.search.toLowerCase())
          )
            return false;
          return true;
        });
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(3).max(255),
          description: z.string().optional(),
          category: z.enum([
            "household chores",
            "repairs",
            "personal care",
            "skilled trades",
          ]),
          price: z.number().positive(),
          unit: z.string().optional(),
          pricingNotes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        if (!ctx.user.isProvider) throw new Error("Only providers can create services");
        await db.insert(services).values({
          ...input,
          providerId: ctx.user.id,
        } as InsertService);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db
          .delete(services)
          .where(and(eq(services.id, input.id), eq(services.providerId, ctx.user.id)));
        return { success: true };
      }),
  }),

  bookings: router({
    create: protectedProcedure
      .input(
        z.object({
          serviceId: z.number(),
          providerId: z.number(),
          bookingDate: z.string(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const [service] = await db
          .select()
          .from(services)
          .where(eq(services.id, input.serviceId))
          .limit(1);
        if (!service) throw new Error("Service not found");
        await db.insert(bookings).values({
          customerId: ctx.user.id,
          providerId: input.providerId,
          serviceId: input.serviceId,
          bookingDate: new Date(input.bookingDate),
          totalPrice: service.price,
          status: "pending",
        } as InsertBooking);
        return { success: true };
      }),

    myBookings: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select({
          id: bookings.id,
          status: bookings.status,
          bookingDate: bookings.bookingDate,
          totalPrice: bookings.totalPrice,
          createdAt: bookings.createdAt,
          serviceName: services.name,
          serviceCategory: services.category,
          providerName: users.name,
          providerId: bookings.providerId,
          serviceId: bookings.serviceId,
        })
        .from(bookings)
        .innerJoin(services, eq(bookings.serviceId, services.id))
        .innerJoin(users, eq(bookings.providerId, users.id))
        .where(eq(bookings.customerId, ctx.user.id))
        .orderBy(desc(bookings.createdAt));
    }),

    providerJobs: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select({
          id: bookings.id,
          status: bookings.status,
          bookingDate: bookings.bookingDate,
          totalPrice: bookings.totalPrice,
          createdAt: bookings.createdAt,
          serviceName: services.name,
          customerName: users.name,
          customerId: bookings.customerId,
          serviceId: bookings.serviceId,
        })
        .from(bookings)
        .innerJoin(services, eq(bookings.serviceId, services.id))
        .innerJoin(users, eq(bookings.customerId, users.id))
        .where(eq(bookings.providerId, ctx.user.id))
        .orderBy(desc(bookings.createdAt));
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          bookingId: z.number(),
          status: z.enum(["confirmed", "completed", "cancelled"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db
          .update(bookings)
          .set({ status: input.status })
          .where(
            and(
              eq(bookings.id, input.bookingId),
              eq(bookings.providerId, ctx.user.id)
            )
          );
        return { success: true };
      }),
  }),

  reviews: router({
    create: protectedProcedure
      .input(
        z.object({
          bookingId: z.number(),
          providerId: z.number(),
          rating: z.number().int().min(1).max(5),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(reviews).values({
          ...input,
          customerId: ctx.user.id,
        } as InsertReview);
        return { success: true };
      }),

    forProvider: publicProcedure
      .input(z.object({ providerId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db
          .select({
            id: reviews.id,
            rating: reviews.rating,
            comment: reviews.comment,
            createdAt: reviews.createdAt,
            customerName: users.name,
          })
          .from(reviews)
          .innerJoin(users, eq(reviews.customerId, users.id))
          .where(eq(reviews.providerId, input.providerId))
          .orderBy(desc(reviews.createdAt));
      }),
  }),

  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { totalBookings: 0, totalEarnings: 0, avgRating: 0, pendingJobs: 0 };

      if (ctx.user.isProvider) {
        const allJobs = await db
          .select()
          .from(bookings)
          .where(eq(bookings.providerId, ctx.user.id));
        const completed = allJobs.filter((j) => j.status === "completed");
        const pending = allJobs.filter((j) => j.status === "pending").length;
        const earnings = completed.reduce((sum, j) => sum + (j.totalPrice || 0), 0);
        const providerReviews = await db
          .select()
          .from(reviews)
          .where(eq(reviews.providerId, ctx.user.id));
        const avgRating =
          providerReviews.length > 0
            ? providerReviews.reduce((s, r) => s + r.rating, 0) / providerReviews.length
            : 0;
        return {
          totalBookings: allJobs.length,
          totalEarnings: earnings,
          avgRating: Math.round(avgRating * 10) / 10,
          pendingJobs: pending,
        };
      } else {
        const myBookings = await db
          .select()
          .from(bookings)
          .where(eq(bookings.customerId, ctx.user.id));
        const totalSpent = myBookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
        return {
          totalBookings: myBookings.length,
          totalEarnings: totalSpent,
          avgRating: 0,
          pendingJobs: myBookings.filter((b) => b.status === "pending").length,
        };
      }
    }),
  }),

  subscription: router({
    initiate: protectedProcedure
      .input(z.object({
        phone: z.string().min(9),
        method: z.enum(["ecocash", "innbucks"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const { initiateSubscriptionPayment } = await import("./paynow");
        const email = "maxymuusha@gmail.com";
        const result = await initiateSubscriptionPayment(email, input.phone, input.method);
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.update(users)
          .set({ lastPaymentRef: result.pollUrl })
          .where(eq(users.id, ctx.user.id));
        return result;
      }),

    poll: protectedProcedure
      .input(z.object({ pollUrl: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { pollPaymentStatus } = await import("./paynow");
        const result = await pollPaymentStatus(input.pollUrl);
        if (result.paid) {
          const db = await getDb();
          if (!db) throw new Error("Database unavailable");
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 30);
          await db.update(users)
            .set({
              subscriptionStatus: "active",
              subscriptionExpiry: expiry,
              isProvider: true,
              role: "provider",
            })
            .where(eq(users.id, ctx.user.id));
        }
        return result;
      }),

    status: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { status: "none", expiry: null };
      const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
      return {
        status: user?.subscriptionStatus ?? "none",
        expiry: user?.subscriptionExpiry ?? null,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
