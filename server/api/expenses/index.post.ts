import { z } from "zod";
import { expense, expenseInsertSchema } from "~/db/schema";

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const validBody = expenseInsertSchema
			.omit({
				id: true,
				createdAt: true,
				updatedAt: true,
				userId: true,
				date: true,
			})
			.extend({
				date: z.coerce.date(),
			})
			.parse(body);
		const newExpense = await db
			.insert(expense)
			.values({ ...validBody, userId: event.context.auth.user.id })
			.returning();
		return newExpense;
	} catch (error) {
		console.error("Error creating expense:", error);
		throw createError({
			statusCode: 500,
			message: "Error creating expense",
		});
	}
});
