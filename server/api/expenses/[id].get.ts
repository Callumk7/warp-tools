import { eq } from "drizzle-orm";
import { expense } from "~/db/schema";

export default defineEventHandler(async (event) => {
	const id = event.context.params?.id;
	if (!id) {
		throw createError({
			statusCode: 400,
			message: "Expense ID is required",
		});
	}

	try {
		const expenseResult = await db.query.expense.findFirst({
			where: eq(expense.id, id),
		});

		if (!expenseResult) {
			throw createError({
				statusCode: 404,
				message: "Expense not found",
			});
		}

		return expenseResult;
	} catch (error) {
		console.error(`Error fetching expense ${id}:`, error);
		throw createError({
			statusCode: 500,
			message: "Error fetching expense",
		});
	}
});
