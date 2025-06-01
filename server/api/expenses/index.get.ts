import { eq } from "drizzle-orm";
import { expense } from "~/db/schema";
import { getUserId } from "~/server/utils/helpers";

export default defineEventHandler(async (event) => {
	const userId = getUserId(event);
	try {
		const expenses = await db.query.expense.findMany({
			where: eq(expense.userId, userId),
		});
		return expenses || [];
	} catch (error) {
		console.error("Error fetching expenses:", error);
		throw createError({
			statusCode: 500,
			message: "Error fetching expenses",
		});
	}
});
