<template>
	<CardLayout
		title="Invoice Management"
		sub-title="Create, update, and manage all of your invoices."
	>
		<div class="w-full">
			<UButton
				icon="i-lucide-plus"
				color="neutral"
				class="float-right"
				to="/invoices/new"
			>
				New Invoice
			</UButton>
		</div>
		<div class="py-4 rounded-md border border-muted">
			<div class="space-y-4 divide-y divide-muted">
				<InvoiceCard
					v-for="invoice in invoices"
					:key="invoice.id"
					:invoice-id="invoice.id"
					:invoice-number="invoice.invoiceNumber"
					:invoice-amount="invoice.subtotal"
					:invoice-due-date="invoice.dueDate"
					:invoice-status="invoice.status"
				/>
			</div>
		</div>
	</CardLayout>
</template>

<script setup lang="ts">
const { data: invoices, error } = await useFetch("/api/invoices");
</script>
