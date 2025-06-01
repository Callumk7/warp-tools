<script setup lang="ts">
import { z } from "zod";

interface Props {
	clientId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["create-project"]);

const newProjectSchema = z.object({
	name: z.string().min(1, "Client name is required"),
	clientId: z.string().optional(),
	description: z.string().optional(),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	status: z
		.enum(["IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED"])
		.default("IN_PROGRESS"),
	notes: z.string().optional(),
	rateAmount: z.number().optional(),
	currency: z.string().optional(),
});

type Schema = z.output<typeof newProjectSchema>;

const state = reactive<Partial<Schema>>({
	name: undefined,
	clientId: props.clientId ? props.clientId : undefined,
	description: undefined,
	startDate: undefined,
	endDate: undefined,
	status: "IN_PROGRESS",
	notes: undefined,
	rateAmount: undefined,
	currency: undefined,
});

// fetch clients
const { data: clients } = await useFetch("/api/clients");

// Transform clients data into the format expected by USelect
const formattedClients = computed(() => {
	return (
		clients.value?.map((client) => ({
			label: client.name,
			value: client.id.toString(),
		})) || []
	);
});

const onSubmit = async () => {
	await $fetch("/api/projects", {
		method: "POST",
		body: {
			name: state.name,
			clientId: state.clientId,
			description: state.description,
			startDate: state.startDate,
			endDate: state.endDate,
			status: state.status,
			notes: state.notes,
			rateAmount: state.rateAmount,
			currency: state.currency,
		},
	});

	emit("create-project");
};
</script>

<template>
	<UModal title="Create a project">
		<UButton label="Create Project" color="primary" variant="subtle" />

		<template #body>
			<UForm
				:schema="newProjectSchema"
				:state="state"
				action="/api/projects"
				method="POST"
				@submit="onSubmit"
			>
				<UFormField label="Name" name="name">
					<UInput v-model="state.name" class="w-full" />
				</UFormField>

				<UFormField label="Client" name="clientId">
					<USelect
						v-model="state.clientId"
						:items="formattedClients"
						class="w-full"
					/>
				</UFormField>

				<UButton type="submit">Submit</UButton>
			</UForm>
		</template>
	</UModal>
</template>
