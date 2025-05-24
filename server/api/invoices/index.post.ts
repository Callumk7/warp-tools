import { invoiceInsertSchema } from "~/db/schema";
import { createInvoice } from "~/server/actions/invoices";

const bodySchema = invoiceInsertSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		console.log(body);
		// const validBody = bodySchema.parse(body);
		// const invoice = await createInvoice(validBody);

		return body;
	} catch (error) {
		console.error("Error creating invoice:", error);
		throw createError({
			statusCode: 500,
			message: "Error creating invoice",
		});
	}
});
