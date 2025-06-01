import {
	pgTable,
	uuid,
	text,
	timestamp,
	boolean,
	integer,
	doublePrecision,
	pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";
import { createInsertSchema } from "drizzle-zod";

// Enums
export const projectStatusEnum = pgEnum("project_status", [
	"IN_PROGRESS",
	"COMPLETED",
	"CANCELLED",
	"ON_HOLD",
]);
export const rateTypeEnum = pgEnum("rate_type", ["HOURLY", "FIXED", "DAILY"]);
export const invoiceStatusEnum = pgEnum("invoice_status", [
	"DRAFT",
	"SENT",
	"PAID",
	"PARTIALLY_PAID",
	"OVERDUE",
	"CANCELLED",
]);

// Users
export const profile = pgTable("profile", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),

	// Business details
	businessName: text("business_name"),
	businessAddress: text("business_address"),
	taxId: text("tax_id"),
	phoneNumber: text("phone_number"),
	website: text("website"),

	// App settingsschema
	defaultCurrency: text("default_currency").default("GBP").notNull(),
	defaultTaxRate: doublePrecision("default_tax_rate").default(20), // UK VAT rate
});

// Clients
export const client = pgTable("client", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	contactPerson: text("contact_person"),
	email: text("email"),
	phoneNumber: text("phone_number"),
	address: text("address"),
	city: text("city"),
	postcode: text("postcode"),
	country: text("country"),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Client = typeof client.$inferSelect;
export type ClientInsert = typeof client.$inferInsert;
export const clientInsertSchema = createInsertSchema(client);

// Projects
export const project = pgTable("project", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	clientId: uuid("client_id")
		.notNull()
		.references(() => client.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description"),
	startDate: timestamp("start_date"),
	endDate: timestamp("end_date"),
	status: projectStatusEnum("status").default("IN_PROGRESS").notNull(),
	rateType: rateTypeEnum("rate_type").default("HOURLY").notNull(),
	rateAmount: doublePrecision("rate_amount"),
	currency: text("currency").default("GBP").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Project = typeof project.$inferSelect;
export type ProjectInsert = typeof project.$inferInsert;
export const projectInsertSchema = createInsertSchema(project);

// Invoices
export const invoice = pgTable("invoice", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	projectId: uuid("project_id").references(() => project.id, { onDelete: "set null" }),
	clientId: uuid("client_id").references(() => client.id, { onDelete: "set null" }),
	invoiceNumber: text("invoice_number").notNull().unique(),
	issueDate: timestamp("issue_date").defaultNow().notNull(),
	dueDate: timestamp("due_date").notNull(),
	status: invoiceStatusEnum("status").default("DRAFT").notNull(),
	subtotal: doublePrecision("subtotal").notNull(),
	taxRate: doublePrecision("tax_rate"),
	taxAmount: doublePrecision("tax_amount"),
	total: doublePrecision("total").notNull(),
	notes: text("notes"),
	paymentTerms: text("payment_terms"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Invoice = typeof invoice.$inferSelect;
export type InvoiceInsert = typeof invoice.$inferInsert;
export const invoiceInsertSchema = createInsertSchema(invoice);

// Invoice Items
export const invoiceItem = pgTable("invoice_item", {
	id: uuid("id").primaryKey().defaultRandom(),
	invoiceId: uuid("invoice_id")
		.notNull()
		.references(() => invoice.id, { onDelete: "cascade" }),
	description: text("description").notNull(),
	quantity: doublePrecision("quantity").notNull(),
	unitPrice: doublePrecision("unit_price").notNull(),
	amount: doublePrecision("amount").notNull(),
	taxable: boolean("taxable").default(true).notNull(),
});

// Payments
export const payment = pgTable("payment", {
	id: uuid("id").primaryKey().defaultRandom(),
	invoiceId: uuid("invoice_id")
		.notNull()
		.references(() => invoice.id, { onDelete: "cascade" }),
	amount: doublePrecision("amount").notNull(),
	projectId: uuid("project_id").references(() => project.id, { onDelete: "set null" }),
	clientId: uuid("client_id").references(() => client.id, { onDelete: "set null" }),
	paymentDate: timestamp("payment_date").notNull(),
	paymentMethod: text("payment_method"),
	reference: text("reference"),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Expenses
export const expense = pgTable("expense", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	projectId: uuid("project_id").references(() => project.id, { onDelete: "set null" }),
	externalInvoiceId: text("external_invoice_id"),
	date: timestamp("date").notNull(),
	category: text("category").notNull(),
	amount: doublePrecision("amount").notNull(),
	currency: text("currency").default("GBP").notNull(),
	description: text("description"),
	receiptUrl: text("receipt_url"),
	billable: boolean("billable").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Expense = typeof expense.$inferSelect;
export type ExpenseInsert = typeof expense.$inferInsert;
export const expenseInsertSchema = createInsertSchema(expense);

// Time Entries
export const timeEntry = pgTable("time_entries", {
	id: uuid("id").primaryKey().defaultRandom(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => project.id, { onDelete: "cascade" }),
	description: text("description"),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time"),
	duration: integer("duration"), // Duration in minutes
	billable: boolean("billable").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
	clients: many(client),
	projects: many(project),
	invoices: many(invoice),
	expenses: many(expense),
}));

export const clientRelations = relations(client, ({ one, many }) => ({
	user: one(user, {
		fields: [client.userId],
		references: [user.id],
	}),
	projects: many(project),
	invoices: many(invoice),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
	user: one(user, {
		fields: [project.userId],
		references: [user.id],
	}),
	client: one(client, {
		fields: [project.clientId],
		references: [client.id],
	}),
	invoices: many(invoice),
	expenses: many(expense),
	timeEntries: many(timeEntry),
}));

export const invoiceRelations = relations(invoice, ({ one, many }) => ({
	user: one(user, {
		fields: [invoice.userId],
		references: [user.id],
	}),
	project: one(project, {
		fields: [invoice.projectId],
		references: [project.id],
	}),
	client: one(client, {
		fields: [invoice.clientId],
		references: [client.id],
	}),
	items: many(invoiceItem),
	payments: many(payment),
}));

export const invoiceItemRelations = relations(invoiceItem, ({ one }) => ({
	invoice: one(invoice, {
		fields: [invoiceItem.invoiceId],
		references: [invoice.id],
	}),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
	invoice: one(invoice, {
		fields: [payment.invoiceId],
		references: [invoice.id],
	}),
	project: one(project, {
		fields: [payment.projectId],
		references: [project.id],
	}),
	client: one(client, {
		fields: [payment.clientId],
		references: [client.id],
	}),
}));

export const expensesRelations = relations(expense, ({ one }) => ({
	user: one(user, {
		fields: [expense.userId],
		references: [user.id],
	}),
	project: one(project, {
		fields: [expense.projectId],
		references: [project.id],
	}),
}));

export const timeEntryRelations = relations(timeEntry, ({ one }) => ({
	project: one(project, {
		fields: [timeEntry.projectId],
		references: [project.id],
	}),
}));
