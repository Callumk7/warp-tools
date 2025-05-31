import { eq } from "drizzle-orm";
import { db } from "~/server/utils/db";
import { invoice } from "~/db/schema";
import { auth } from "~/server/utils/auth";
import { z, ZodError } from "zod";

const bodySchema = z.object({
	projectId: z.string().uuid().optional().nullable(),
	clientId: z.string().uuid().optional().nullable(),
	invoiceNumber: z.string().min(1),
	issueDate: z.coerce.date(),
	dueDate: z.coerce.date(),
	status: z.enum(["DRAFT", "SENT", "PAID", "PARTIALLY_PAID", "OVERDUE", "CANCELLED"]),
	subtotal: z.number(),
	taxRate: z.number().optional().nullable(),
	taxAmount: z.number().optional().nullable(),
	total: z.number(),
	notes: z.string().optional().nullable(),
	paymentTerms: z.string().optional().nullable(),
});

export default defineEventHandler(async (event) => {
	try {
		// Get user from session
		const session = await auth.api.getSession({ headers: event.headers });
		if (!session?.user?.id) {
			throw createError({
				statusCode: 401,
				message: "Unauthorized",
			});
		}

		const invoiceId = getRouterParam(event, "id");
		if (!invoiceId) {
			throw createError({
				statusCode: 400,
				message: "Invoice ID is required",
			});
		}

		const body = await readBody(event);
		const validBody = bodySchema.parse(body);

		// Update invoice
		const [updatedInvoice] = await db
			.update(invoice)
			.set({
				...validBody,
				updatedAt: new Date(),
			})
			.where(eq(invoice.id, invoiceId))
			.returning();

		if (!updatedInvoice) {
			throw createError({
				statusCode: 404,
				message: "Invoice not found",
			});
		}

		return { success: true, invoice: updatedInvoice };
	} catch (error: unknown) {
		console.error("Error updating invoice:", error);

		// Check if it's a Zod validation error
		if (error instanceof ZodError) {
			throw createError({
				statusCode: 400,
				message: "Validation error",
				data: error.issues,
			});
		}

		// Handle other types of errors
		throw createError({
			statusCode: 500,
			message: "Error updating invoice",
		});
	}
});
