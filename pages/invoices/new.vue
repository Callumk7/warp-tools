<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import type { Client } from "~/db/schema";

const { data: clients, error, status } = await useFetch<Client[]>("/api/clients");

const selectedClient = ref(undefined);

// Transform clients data into the format expected by USelect
const formattedClients = computed(() => {
	return (
		clients.value?.map((client) => ({
			label: client.name,
			value: client.id.toString(),
		})) || []
	);
});

interface InvoiceItem {
	description: string;
	quantity: number;
	rate: number;
	amount: number;
}

const state = reactive({
	items: [{ description: "", quantity: 1, rate: 0, amount: 0 }] as InvoiceItem[],
});

const addItem = () => {
	state.items.push({
		description: "",
		quantity: 1,
		rate: 0,
		amount: 0,
	});
};

const removeItem = (index: number) => {
	state.items = state.items.filter((_, i) => i !== index);
};

const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
	const item = state.items[index];

	item[field] = value as never;

	if (field === "quantity" || field === "rate") {
		item.amount = item.quantity * item.rate;
	}
};

const invoiceNumber = ref("");
const now = new Date();
const dueDate = ref<CalendarDate | undefined>();
const issueDate = ref<CalendarDate | undefined>();

// Set default dates after component mounts
onMounted(() => {
	issueDate.value = new CalendarDate(
		now.getFullYear(),
		now.getMonth() + 1,
		now.getDate(),
	);
	dueDate.value = new CalendarDate(
		now.getFullYear(),
		now.getMonth() + 2,
		now.getDate(),
	);
});

const subtotal = ref(0);
const tax = ref(0);
const total = ref(0);

const calculateTotal = () => {
	return state.items.reduce((sum, item) => sum + Number(item.amount), 0);
};

const isSubmitting = ref(false);

const onSubmit = async () => {
	if (isSubmitting.value) return;
	
	const filteredItems = state.items.filter(item => item.description.trim() !== "");
	if (filteredItems.length === 0) {
		alert("Please add at least one invoice item");
		return;
	}

	if (!invoiceNumber.value.trim()) {
		alert("Please enter an invoice number");
		return;
	}

	if (!issueDate.value || !dueDate.value) {
		alert("Please select issue and due dates");
		return;
	}

	isSubmitting.value = true;
	
	try {
		const subtotalAmount = calculateTotal();
		const taxAmount = 0; // Currently no tax
		const totalAmount = subtotalAmount + taxAmount;

		const result = await $fetch("/api/invoices", {
			method: "POST",
			body: {
				projectId: null, // Optional for now
				invoiceNumber: invoiceNumber.value,
				issueDate: issueDate.value?.toDate("gmt"),
				dueDate: dueDate.value?.toDate("gmt"),
				subtotal: subtotalAmount,
				taxRate: 0,
				taxAmount: taxAmount,
				total: totalAmount,
				items: filteredItems,
			},
		});

		if (result.success) {
			await navigateTo("/invoices");
		}
	} catch (error) {
		console.error("Failed to create invoice:", error);
		alert("Failed to create invoice. Please try again.");
	} finally {
		isSubmitting.value = false;
	}
};
</script>

<template>
	<div class="flex flex-col gap-6 min-h-screen">
		<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
			<div class="flex items-center gap-4">
				<UButton variant="outline" icon="i-lucide-arrow-left" to="/invoices" />
				<h1 class="text-xl font-semibold">Create New Invoice</h1>
			</div>
			<div class="grid gap-6">
				<Form @submit.prevent="onSubmit">
					<UCard>
						<template #header>
							<div>
								<h3 class="text-lg font-semibold">New Invoice</h3>
								<p class="text-sm text-stone-500">Create a new invoice</p>
							</div>
						</template>
						<div class="flex flex-col gap-4">
							<div v-if="error">{{ error }}</div>
							<div
								v-else
								class="w-full flex justify-stretch items-center gap-2"
							>
								<UFormField label="Client" name="clientId">
									<USelect
										v-model="selectedClient"
										:items="formattedClients"
										:loading="status === 'pending'"
										placeholder="Select a client"
										value-key="value"
										class="w-56"
									/>
								</UFormField>

								<UFormField label="Project" name="project" class="flex-1">
									<UInput
										placeholder="Project name or description"
										class="w-full"
									/>
								</UFormField>
							</div>
							<div class="w-full flex justify-between items-center gap-2">
								<UFormField label="Invoice Number" class="flex-1">
									<UInput
										v-model="invoiceNumber"
										placeholder="Invoice Number"
										class="w-full"
									/>
								</UFormField>

								<UFormField
									label="Issue Date"
									name="issueDate"
									class="flex-1"
								>
									<DatePicker v-model="issueDate" class="w-full" />
								</UFormField>

								<UFormField
									label="Due Date"
									name="dueDate"
									class="flex-1"
								>
									<DatePicker v-model="dueDate" class="w-full" />
								</UFormField>
							</div>
							<UButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
								{{ isSubmitting ? "Creating..." : "Create Invoice" }}
							</UButton>
						</div>
					</UCard>
					<!-- Invoice Items -->
					<UCard>
						<template #header>
							<div>
								<h3 class="text-lg font-semibold">Invoice Items</h3>
								<p class="text-sm text-stone-500">
									Add the services or products you're billing for
								</p>
							</div>
						</template>

						<div class="space-y-4">
							<div class="rounded-md border">
								<div class="grid grid-cols-12 gap-2 p-3 font-medium">
									<div class="col-span-6">Description</div>
									<div class="col-span-2">Quantity</div>
									<div class="col-span-2">Rate</div>
									<div class="col-span-1">Amount</div>
									<div class="col-span-1"></div>
								</div>

								<div
									v-for="(item, index) in state.items"
									:key="index"
									class="grid grid-cols-12 gap-2 border-t p-3"
								>
									<div class="col-span-6">
										<UInput
											v-model="item.description"
											placeholder="Item description"
											@input="
												updateItem(
													index,
													'description',
													item.description,
												)
											"
										/>
									</div>
									<div class="col-span-2">
										<UInput
											v-model="item.quantity"
											type="number"
											min="1"
											@input="
												updateItem(
													index,
													'quantity',
													item.quantity,
												)
											"
										/>
									</div>
									<div class="col-span-2">
										<UInput
											v-model="item.rate"
											type="number"
											min="0"
											step="0.01"
											@input="updateItem(index, 'rate', item.rate)"
										/>
									</div>
									<div class="col-span-1">
										{{ item.amount.toFixed(2) }}
									</div>
									<div
										class="col-span-1 flex items-center justify-center"
									>
										<UButton
											variant="ghost"
											icon="i-lucide-trash"
											:disabled="state.items.length === 1"
											@click="removeItem(index)"
										/>
									</div>
								</div>
							</div>

							<UButton
								variant="outline"
								icon="i-lucide-plus"
								@click="addItem"
							>
								Add Item
							</UButton>

							<div class="flex justify-end space-x-4 border-t pt-4">
								<div class="text-right">
									<div class="font-medium">Subtotal</div>
									<div class="text-sm text-muted-foreground">
										Tax (0%)
									</div>
									<div class="text-lg font-bold mt-2">Total</div>
								</div>
								<div class="text-right">
									<div class="font-medium">
										£{{ calculateTotal().toFixed(2) }}
									</div>
									<div class="text-sm text-muted-foreground">£0.00</div>
									<div class="text-lg font-bold mt-2">
										£{{ calculateTotal().toFixed(2) }}
									</div>
								</div>
							</div>
						</div>
					</UCard>
				</Form>
			</div>
		</main>
	</div>
</template>
