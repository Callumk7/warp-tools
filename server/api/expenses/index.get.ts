export default defineEventHandler(async () => {
	try {
		const expenses = await db.query.expense.findMany();
		return expenses || [];
	} catch (error) {
		console.error("Error fetching expenses:", error);
		throw createError({
			statusCode: 500,
			message: "Error fetching expenses",
		});
	}
});
