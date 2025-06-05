<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

const schema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
	amount: z.number(),
	externalInvoiceId: z.string().optional(),
	category: z.string().min(1, "Category is required"),
	description: z.string().optional(),
	receiptUrl: z.string().optional(),
	projectId: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const { data: projects } = await useFetch("/api/projects");

const formattedProjects = computed(() => {
	return (
		projects.value?.map((project) => ({
			label: project.name,
			value: project.id.toString(),
		})) || []
	);
});

const state = reactive<Partial<Schema>>({
	name: undefined,
	amount: 0,
	externalInvoiceId: undefined,
	category: undefined,
	description: undefined,
	receiptUrl: undefined,
	projectId: undefined,
});

const now = new Date();
const date = ref<CalendarDate | undefined>();
onMounted(() => {
	date.value = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
});

const onSubmit = async () => {
	try {
		const result = await $fetch("/api/expenses", {
			method: "POST",
			body: {
				name: state.name,
				amount: state.amount,
				date: date.value!.toString(),
				externalInvoiceId: state.externalInvoiceId,
				category: state.category,
				description: state.description,
				receiptUrl: state.receiptUrl,
				projectId: state.projectId,
			},
		});
		console.log(result);
		if (result.success) {
			await navigateTo("/expenses");
		}
	} catch (error) {
		console.error(error);
	}
};
</script>

<template>
	<div>
		<UForm :schema="schema" :state="state" class="space-y-2" @submit="onSubmit">
			<UFormField label="Name" name="name">
				<UInput v-model="state.name" class="w-80" />
			</UFormField>
			<UFormField label="Amount" name="amount">
				<UInput v-model="state.amount" type="number" class="w-80" />
			</UFormField>
			<UFormField label="Date" name="date">
				<DatePicker v-model="date" class="w-80" />
			</UFormField>
			<UFormField label="Project" name="projectId">
				<USelect
					v-model="state.projectId"
					:items="formattedProjects"
					class="w-80"
				/>
			</UFormField>
			<UFormField label="External Invoice ID" name="externalInvoiceId">
				<UInput v-model="state.externalInvoiceId" class="w-80" />
			</UFormField>
			<UFormField label="Category" name="category">
				<UInput v-model="state.category" class="w-80" />
			</UFormField>
			<UFormField label="Description" name="description">
				<UInput v-model="state.description" class="w-80" />
			</UFormField>
			<UFormField label="Receipt" name="receiptUrl">
				<UInput v-model="state.receiptUrl" class="w-80" />
			</UFormField>
			<UButton type="submit" class="w-80">Submit</UButton>
		</UForm>
	</div>
</template>
