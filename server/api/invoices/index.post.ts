import { invoiceInsertSchema, invoiceItem } from "~/db/schema";
import { createInvoice } from "~/server/actions/invoices";
import { db } from "~/server/utils/db";
import { z } from "zod";

const invoiceItemSchema = z.object({
	description: z.string(),
	quantity: z.number(),
	rate: z.number(),
	amount: z.number(),
});

const bodySchema = invoiceInsertSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		userId: true,
		issueDate: true,
		dueDate: true,
	})
	.extend({
		items: z.array(invoiceItemSchema),
		issueDate: z.coerce.date(),
		dueDate: z.coerce.date(),
	});

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		console.log(body);
		const validBody = bodySchema.parse(body);

		// Create invoice
		const { items, ...invoiceData } = validBody;
		const invoice = await createInvoice({
			...invoiceData,
			userId: event.context.auth.user.id,
		});

		// Create invoice items
		if (items.length > 0) {
			await db.insert(invoiceItem).values(
				items.map((item) => ({
					invoiceId: invoice.id,
					description: item.description,
					quantity: item.quantity,
					unitPrice: item.rate,
					amount: item.amount,
				})),
			);
		}

		return { success: true, invoice };
	} catch (error) {
		console.error("Error creating invoice:", error);
		throw createError({
			statusCode: 500,
			message: "Error creating invoice",
		});
	}
});
