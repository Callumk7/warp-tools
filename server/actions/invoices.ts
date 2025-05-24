import { type Invoice, invoice, type InvoiceInsert } from "~/db/schema";

export type NewInvoice = Omit<InvoiceInsert, "updatedAt" | "createdAt">;

export async function createInvoice(newInvoice: NewInvoice): Promise<Invoice> {
	const now = new Date();
	const [result] = await db
		.insert(invoice)
		.values({
			...newInvoice,
			createdAt: now,
			updatedAt: now,
		})
		.returning();

	return result;
}
