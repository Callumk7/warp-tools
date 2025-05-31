<template>
	<div class="flex flex-col gap-6 min-h-screen">
		<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
			<div class="flex items-center gap-4">
				<UButton variant="outline" icon="i-lucide-arrow-left" :to="`/invoices/${invoiceId}`" />
				<h1 class="text-xl font-semibold">Edit Invoice</h1>
			</div>
			
			<div v-if="pending" class="flex items-center justify-center min-h-96">
				<div class="text-center">
					<div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
					<p class="text-muted">Loading invoice...</p>
				</div>
			</div>

			<div v-else-if="error" class="flex items-center justify-center min-h-96">
				<div class="text-center">
					<h2 class="text-2xl font-semibold">Invoice not found</h2>
					<p class="mt-2 text-muted">The invoice you're trying to edit doesn't exist.</p>
					<UButton to="/invoices" class="mt-4">Back to Invoices</UButton>
				</div>
			</div>

			<div v-else class="grid gap-6">
				<Form @submit.prevent="onSubmit">
					<UCard>
						<template #header>
							<div>
								<h3 class="text-lg font-semibold">Edit Invoice</h3>
								<p class="text-sm text-stone-500">Update invoice information</p>
							</div>
						</template>
						<div class="flex flex-col gap-4">
							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField label="Client" name="clientId" class="flex-1">
									<USelect
										v-model="state.clientId"
										:items="clientOptions"
										placeholder="Select client"
										class="w-full"
									/>
								</UFormField>

								<UFormField label="Project" name="projectId" class="flex-1">
									<USelect
										v-model="state.projectId"
										:items="filteredProjectOptions"
										placeholder="Select project (optional)"
										class="w-full"
										:disabled="!state.clientId"
									/>
								</UFormField>
							</div>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField label="Invoice Number" name="invoiceNumber" class="flex-1" required>
									<UInput
										v-model="state.invoiceNumber"
										placeholder="Invoice number"
										class="w-full"
									/>
								</UFormField>

								<UFormField label="Status" name="status" class="flex-1">
									<USelect
										v-model="state.status"
										:items="statusOptions"
										class="w-full"
									/>
								</UFormField>
							</div>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField label="Issue Date" name="issueDate" class="flex-1" required>
									<UInput
										v-model="state.issueDate"
										type="date"
										class="w-full"
									/>
								</UFormField>

								<UFormField label="Due Date" name="dueDate" class="flex-1" required>
									<UInput
										v-model="state.dueDate"
										type="date"
										class="w-full"
									/>
								</UFormField>
							</div>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField label="Subtotal" name="subtotal" class="flex-1" required>
									<UInput
										v-model.number="state.subtotal"
										type="number"
										step="0.01"
										placeholder="0.00"
										class="w-full"
									/>
								</UFormField>

								<UFormField label="Tax Rate (%)" name="taxRate" class="flex-1">
									<UInput
										v-model.number="state.taxRate"
										type="number"
										step="0.01"
										placeholder="0.00"
										class="w-full"
										@input="calculateTaxAndTotal"
									/>
								</UFormField>
							</div>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField label="Tax Amount" name="taxAmount" class="flex-1">
									<UInput
										v-model.number="state.taxAmount"
										type="number"
										step="0.01"
										placeholder="0.00"
										class="w-full"
										readonly
									/>
								</UFormField>

								<UFormField label="Total" name="total" class="flex-1" required>
									<UInput
										v-model.number="state.total"
										type="number"
										step="0.01"
										placeholder="0.00"
										class="w-full"
										readonly
									/>
								</UFormField>
							</div>

							<UFormField label="Payment Terms" name="paymentTerms">
								<UInput
									v-model="state.paymentTerms"
									placeholder="e.g., Net 30 days"
									class="w-full"
								/>
							</UFormField>

							<UFormField label="Notes" name="notes">
								<UTextarea
									v-model="state.notes"
									placeholder="Additional notes about this invoice"
									class="w-full"
								/>
							</UFormField>

							<div class="flex gap-2">
								<UButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
									{{ isSubmitting ? "Updating..." : "Update Invoice" }}
								</UButton>
								<UButton variant="outline" :to="`/invoices/${invoiceId}`" :disabled="isSubmitting">
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
import type { Invoice, Client, Project } from "~/db/schema";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const invoiceId = route.params.id as string;

const { data: invoice, pending, error } = await useFetch<Invoice & { 
	project?: { id: string; name: string; client: { id: string; name: string } } 
}>(`/api/invoices/${invoiceId}`);

const { data: clients } = await useFetch<Client[]>("/api/clients");
const { data: projects } = await useFetch<Project & { client: { id: string; name: string } }[]>("/api/projects");

const state = reactive({
	clientId: "",
	projectId: "",
	invoiceNumber: "",
	status: "DRAFT" as "DRAFT" | "SENT" | "PAID" | "PARTIALLY_PAID" | "OVERDUE" | "CANCELLED",
	issueDate: "",
	dueDate: "",
	subtotal: 0,
	taxRate: null as number | null,
	taxAmount: null as number | null,
	total: 0,
	notes: "",
	paymentTerms: "",
});

// Populate form with existing invoice data
watchEffect(() => {
	if (invoice.value) {
		state.clientId = invoice.value.clientId || "";
		state.projectId = invoice.value.projectId || "";
		state.invoiceNumber = invoice.value.invoiceNumber;
		state.status = invoice.value.status;
		state.issueDate = new Date(invoice.value.issueDate).toISOString().split('T')[0];
		state.dueDate = new Date(invoice.value.dueDate).toISOString().split('T')[0];
		state.subtotal = invoice.value.subtotal;
		state.taxRate = invoice.value.taxRate;
		state.taxAmount = invoice.value.taxAmount;
		state.total = invoice.value.total;
		state.notes = invoice.value.notes || "";
		state.paymentTerms = invoice.value.paymentTerms || "";
	}
});

const clientOptions = computed(() => 
	clients.value?.map(client => ({
		label: client.name,
		value: client.id,
	})) || []
);

const filteredProjectOptions = computed(() => {
	if (!state.clientId || !projects.value) return [];
	return projects.value
		.filter(project => project.clientId === state.clientId)
		.map(project => ({
			label: project.name,
			value: project.id,
		}));
});

// Clear project selection when client changes
watch(() => state.clientId, () => {
	state.projectId = "";
});

const statusOptions = [
	{ label: "Draft", value: "DRAFT" },
	{ label: "Sent", value: "SENT" },
	{ label: "Paid", value: "PAID" },
	{ label: "Partially Paid", value: "PARTIALLY_PAID" },
	{ label: "Overdue", value: "OVERDUE" },
	{ label: "Cancelled", value: "CANCELLED" },
];

const calculateTaxAndTotal = () => {
	if (state.taxRate && state.subtotal) {
		state.taxAmount = (state.subtotal * state.taxRate) / 100;
		state.total = state.subtotal + state.taxAmount;
	} else {
		state.taxAmount = null;
		state.total = state.subtotal;
	}
};

// Recalculate when subtotal changes
watch(() => state.subtotal, calculateTaxAndTotal);

const isSubmitting = ref(false);

const onSubmit = async () => {
	if (isSubmitting.value) return;

	if (!state.invoiceNumber.trim()) {
		toast.add({
			title: "Error",
			description: "Invoice number is required",
			color: "error",
		});
		return;
	}

	if (!state.issueDate || !state.dueDate) {
		toast.add({
			title: "Error",
			description: "Issue date and due date are required",
			color: "error",
		});
		return;
	}

	isSubmitting.value = true;

	try {
		const result = await $fetch(`/api/invoices/${invoiceId}`, {
			method: "PUT",
			body: {
				clientId: state.clientId || null,
				projectId: state.projectId || null,
				invoiceNumber: state.invoiceNumber,
				status: state.status,
				issueDate: new Date(state.issueDate),
				dueDate: new Date(state.dueDate),
				subtotal: state.subtotal,
				taxRate: state.taxRate,
				taxAmount: state.taxAmount,
				total: state.total,
				notes: state.notes || null,
				paymentTerms: state.paymentTerms || null,
			},
		});

		if (result.success) {
			toast.add({
				title: "Success",
				description: "Invoice updated successfully",
				color: "success",
			});
			await navigateTo(`/invoices/${invoiceId}`);
		}
	} catch (error) {
		console.error("Failed to update invoice:", error);
		toast.add({
			title: "Error",
			description: "Failed to update invoice. Please try again.",
			color: "error",
		});
	} finally {
		isSubmitting.value = false;
	}
};
</script>
