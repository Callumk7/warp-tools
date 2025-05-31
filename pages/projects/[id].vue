<template>
	<div class="flex flex-col gap-6 min-h-screen">
		<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
			<div class="flex items-center gap-4">
				<UButton variant="outline" icon="i-lucide-arrow-left" to="/projects" />
				<h1 class="text-xl font-semibold">Edit Project</h1>
			</div>
			
			<div v-if="pending" class="flex items-center justify-center min-h-96">
				<div class="text-center">
					<div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
					<p class="text-muted">Loading project...</p>
				</div>
			</div>

			<div v-else-if="error" class="flex items-center justify-center min-h-96">
				<div class="text-center">
					<h2 class="text-2xl font-semibold">Project not found</h2>
					<p class="mt-2 text-muted">The project you're trying to edit doesn't exist.</p>
					<UButton to="/projects" class="mt-4">Back to Projects</UButton>
				</div>
			</div>

			<div v-else class="grid gap-6">
				<Form @submit.prevent="onSubmit">
					<UCard>
						<template #header>
							<div>
								<h3 class="text-lg font-semibold">Edit Project</h3>
								<p class="text-sm text-stone-500">Update project information</p>
							</div>
						</template>
						<div class="flex flex-col gap-4">
							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField label="Project Name" name="name" class="flex-1" required>
									<UInput
										v-model="state.name"
										placeholder="Project name"
										class="w-full"
									/>
								</UFormField>

								<UFormField label="Client" name="clientId" class="flex-1" required>
									<USelect
										v-model="state.clientId"
										:items="clientOptions"
										placeholder="Select client"
										class="w-full"
									/>
								</UFormField>
							</div>

							<UFormField label="Description" name="description">
								<UTextarea
									v-model="state.description"
									placeholder="Project description"
									class="w-full"
								/>
							</UFormField>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField label="Start Date" name="startDate" class="flex-1">
									<UInput
										v-model="state.startDate"
										type="date"
										class="w-full"
									/>
								</UFormField>

								<UFormField label="End Date" name="endDate" class="flex-1">
									<UInput
										v-model="state.endDate"
										type="date"
										class="w-full"
									/>
								</UFormField>
							</div>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField label="Status" name="status" class="flex-1">
									<USelect
										v-model="state.status"
										:items="statusOptions"
										class="w-full"
									/>
								</UFormField>

								<UFormField label="Rate Type" name="rateType" class="flex-1">
									<USelect
										v-model="state.rateType"
										:items="rateTypeOptions"
										class="w-full"
									/>
								</UFormField>
							</div>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField label="Rate Amount" name="rateAmount" class="flex-1">
									<UInput
										v-model.number="state.rateAmount"
										type="number"
										step="0.01"
										placeholder="0.00"
										class="w-full"
									/>
								</UFormField>

								<UFormField label="Currency" name="currency" class="flex-1">
									<USelect
										v-model="state.currency"
										:items="currencyOptions"
										class="w-full"
									/>
								</UFormField>
							</div>

							<UFormField label="Notes" name="notes">
								<UTextarea
									v-model="state.notes"
									placeholder="Additional notes about this project"
									class="w-full"
								/>
							</UFormField>

							<div class="flex gap-2">
								<UButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
									{{ isSubmitting ? "Updating..." : "Update Project" }}
								</UButton>
								<UButton variant="outline" to="/projects" :disabled="isSubmitting">
									Cancel
								</UButton>
							</div>
						</div>
					</UCard>
				</Form>
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
import type { Project, Client } from "~/db/schema";

definePageMeta({
	title: "Edit Project",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const projectId = route.params.id as string;

const { data: project, pending, error } = await useFetch<Project & { client: { id: string; name: string } }>(`/api/projects/${projectId}`);
const { data: clients } = await useFetch<Client[]>("/api/clients");

const state = reactive({
	name: "",
	clientId: "",
	description: "",
	startDate: "",
	endDate: "",
	status: "IN_PROGRESS" as "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD",
	rateType: "HOURLY" as "HOURLY" | "FIXED",
	rateAmount: null as number | null,
	currency: "GBP",
	notes: "",
});

// Populate form with existing project data
watchEffect(() => {
	if (project.value) {
		state.name = project.value.name;
		state.clientId = project.value.clientId;
		state.description = project.value.description || "";
		state.startDate = project.value.startDate ? new Date(project.value.startDate).toISOString().split('T')[0] : "";
		state.endDate = project.value.endDate ? new Date(project.value.endDate).toISOString().split('T')[0] : "";
		state.status = project.value.status;
		state.rateType = project.value.rateType;
		state.rateAmount = project.value.rateAmount;
		state.currency = project.value.currency;
		state.notes = project.value.notes || "";
	}
});

const clientOptions = computed(() => 
	clients.value?.map(client => ({
		label: client.name,
		value: client.id,
	})) || []
);

const statusOptions = [
	{ label: "In Progress", value: "IN_PROGRESS" },
	{ label: "Completed", value: "COMPLETED" },
	{ label: "On Hold", value: "ON_HOLD" },
	{ label: "Cancelled", value: "CANCELLED" },
];

const rateTypeOptions = [
	{ label: "Hourly", value: "HOURLY" },
	{ label: "Fixed", value: "FIXED" },
];

const currencyOptions = [
	{ label: "GBP (£)", value: "GBP" },
	{ label: "USD ($)", value: "USD" },
	{ label: "EUR (€)", value: "EUR" },
];

const isSubmitting = ref(false);

const onSubmit = async () => {
	if (isSubmitting.value) return;

	if (!state.name.trim()) {
		toast.add({
			title: "Error",
			description: "Project name is required",
			color: "error",
		});
		return;
	}

	if (!state.clientId) {
		toast.add({
			title: "Error",
			description: "Client is required",
			color: "error",
		});
		return;
	}

	isSubmitting.value = true;

	try {
		const result = await $fetch(`/api/projects/${projectId}`, {
			method: "PUT",
			body: {
				name: state.name,
				clientId: state.clientId,
				description: state.description || null,
				startDate: state.startDate ? new Date(state.startDate) : null,
				endDate: state.endDate ? new Date(state.endDate) : null,
				status: state.status,
				rateType: state.rateType,
				rateAmount: state.rateAmount,
				currency: state.currency,
				notes: state.notes || null,
			},
		});

		if (result.success) {
			toast.add({
				title: "Success",
				description: "Project updated successfully",
				color: "success",
			});
			await navigateTo("/projects");
		}
	} catch (error) {
		console.error("Failed to update project:", error);
		toast.add({
			title: "Error",
			description: "Failed to update project. Please try again.",
			color: "error",
		});
	} finally {
		isSubmitting.value = false;
	}
};
</script>