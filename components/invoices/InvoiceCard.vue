<template>
	<div class="flex justify-between items-start px-4 pb-4">
		<div class="flex flex-col gap-2">
			<NuxtLink :to="`/invoices/${props.invoiceId}`" class="text-lg font-bold">{{
				props.invoiceNumber
			}}</NuxtLink>
			<div class="flex items-center gap-3">
				<UBadge :color="getStatusColor(props.invoiceStatus)" variant="soft">
					{{ props.invoiceStatus }}
				</UBadge>
				<span class="text-sm text-muted"
					>Due: {{ formatDate(props.invoiceDueDate) }}</span
				>
			</div>
		</div>
		<div class="text-right">
			<p class="text-xl font-bold">£{{ props.invoiceAmount.toFixed(2) }}</p>
			<p class="text-sm text-muted">Total</p>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	invoiceId: string;
	invoiceNumber: string;
	invoiceAmount: number;
	invoiceDueDate: string;
	invoiceStatus: string;
}

const props = defineProps<Props>();

function formatDate(date: string | Date | null | undefined) {
	if (!date) return "N/A";
	return new Date(date).toLocaleDateString("en-GB");
}

function getStatusColor(status: string) {
	switch (status) {
		case "PAID":
			return "success";
		case "SENT":
			return "primary";
		case "DRAFT":
			return "neutral";
		case "OVERDUE":
			return "error";
		case "PARTIALLY_PAID":
			return "warning";
		case "CANCELLED":
			return "error";
		default:
			return "neutral";
	}
}
</script>
