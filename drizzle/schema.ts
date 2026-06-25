import { pgTable, text, timestamp, varchar, doublePrecision, boolean, serial, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: text("role").default("customer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  isProvider: boolean("isProvider").default(false),
  bio: text("bio"),
  subscriptionStatus: text("subscriptionStatus").default("none"),
  subscriptionExpiry: timestamp("subscriptionExpiry"),
  lastPaymentRef: text("lastPaymentRef"),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  providerId: integer("providerId").notNull().references(() => users.id),
  category: text("category").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  unit: varchar("unit", { length: 50 }),
  pricingNotes: text("pricingNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerId: integer("customerId").notNull().references(() => users.id),
  providerId: integer("providerId").notNull().references(() => users.id),
  serviceId: integer("serviceId").notNull().references(() => services.id),
  bookingDate: timestamp("bookingDate").notNull(),
  status: text("status").default("pending").notNull(),
  totalPrice: doublePrecision("totalPrice").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("bookingId").notNull().references(() => bookings.id),
  customerId: integer("customerId").notNull().references(() => users.id),
  providerId: integer("providerId").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
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
