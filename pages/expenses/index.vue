<script setup lang="ts">
const { data: expenses } = await useFetch("/api/expenses");
</script>

<template>
	<CardLayout title="Expenses">
		<div class="w-full">
			<UButton
				icon="i-lucide-plus"
				color="neutral"
				class="float-right"
				to="/expenses/new"
			>
				New Expense
			</UButton>
		</div>
		<UCard>
			<div class="space-y-4">
				<ExpenseCard
					v-for="expense in expenses"
					:key="expense.id"
					:expenese-id="expense.id"
					:invoice-amount="expense.amount"
				/>
			</div>
		</UCard>
	</CardLayout>
</template>
