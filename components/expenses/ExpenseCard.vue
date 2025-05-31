<template>
	<div class="flex justify-between items-start px-4 pb-4">
		<div class="flex flex-col gap-2">
			<NuxtLink :to="`/expenses/${props.expeneseId}`" class="text-lg font-bold">{{
				props.expeneseId
			}}</NuxtLink>
		</div>
		<div class="text-right">
			<p class="text-xl font-bold">£{{ props.invoiceAmount.toFixed(2) }}</p>
			<p class="text-sm text-muted">Total</p>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	expeneseId: string;
	projectId?: string;
	invoiceAmount: number;
	description?: string;
}

const props = defineProps<Props>();
</script>
