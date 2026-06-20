import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, double, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["customer", "provider", "admin"]).default("customer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  // Provider specific fields
  isProvider: boolean("isProvider").default(false),
  bio: text("bio"),
  // Add other provider-specific fields like profile picture, contact info, etc.
});

export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  providerId: int("providerId").notNull().references(() => users.id),
  category: mysqlEnum("category", ["household chores", "repairs", "personal care", "skilled trades"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: double("price").notNull(),
  unit: varchar("unit", { length: 50 }), // e.g., "per hour", "per job"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull().references(() => users.id),
  providerId: int("providerId").notNull().references(() => users.id),
  serviceId: int("serviceId").notNull().references(() => services.id),
  bookingDate: timestamp("bookingDate").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  totalPrice: double("totalPrice").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull().references(() => bookings.id),
  customerId: int("customerId").notNull().references(() => users.id),
  providerId: int("providerId").notNull().references(() => users.id),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
