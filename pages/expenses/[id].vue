<script setup lang="ts">
import type { Expense } from "~/db/schema";

const { id } = useRoute().params;

const { data: expense } = await useFetch<Expense>(`/api/expenses/${id}`);

if (!expense.value) {
	throw createError({
		statusCode: 404,
		statusMessage: "Expense not found",
	});
}
</script>

<template>
	<div>{{ expense!.name }}</div>
</template>
