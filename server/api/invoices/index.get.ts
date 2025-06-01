import { eq } from "drizzle-orm";
import { invoice } from "~/db/schema";
import { getUserId } from "~/server/utils/helpers";

export default defineEventHandler(async (event) => {
	const userId = getUserId(event);

	try {
		const invoices = await db.query.invoice.findMany({
			where: eq(invoice.userId, userId),
			with: {
				project: true,
			},
		});

		return invoices || [];
	} catch (error) {
		console.error("Error fetching invoices:", error);
		throw createError({
			statusCode: 500,
			message: "Error fetching invoices",
		});
	}
});
