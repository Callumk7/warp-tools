<script setup lang="ts">
import type { Client } from "~/db/schema";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const clientId = route.params.id as string;

const {
	data: client,
	pending,
	error,
} = await useFetch<Client>(`/api/clients/${clientId}`);

const state = reactive({
	name: "",
	contactPerson: "",
	email: "",
	phoneNumber: "",
	address: "",
	city: "",
	postcode: "",
	country: "",
	notes: "",
});

// Populate form with existing client data
watchEffect(() => {
	if (client.value) {
		state.name = client.value.name;
		state.contactPerson = client.value.contactPerson || "";
		state.email = client.value.email || "";
		state.phoneNumber = client.value.phoneNumber || "";
		state.address = client.value.address || "";
		state.city = client.value.city || "";
		state.postcode = client.value.postcode || "";
		state.country = client.value.country || "";
		state.notes = client.value.notes || "";
	}
});

const isSubmitting = ref(false);

const onSubmit = async () => {
	if (isSubmitting.value) return;

	if (!state.name.trim()) {
		toast.add({
			title: "Error",
			description: "Client name is required",
			color: "error",
		});
		return;
	}

	if (state.email && !isValidEmail(state.email)) {
		toast.add({
			title: "Error",
			description: "Please enter a valid email address",
			color: "error",
		});
		return;
	}

	isSubmitting.value = true;

	try {
		const result = await $fetch(`/api/clients/${clientId}`, {
			method: "PUT",
			body: {
				name: state.name,
				contactPerson: state.contactPerson || null,
				email: state.email || null,
				phoneNumber: state.phoneNumber || null,
				address: state.address || null,
				city: state.city || null,
				postcode: state.postcode || null,
				country: state.country || null,
				notes: state.notes || null,
			},
		});

		if (result.success) {
			toast.add({
				title: "Success",
				description: "Client updated successfully",
				color: "success",
			});
			await navigateTo(`/clients/${clientId}`);
		}
	} catch (error) {
		console.error("Failed to update client:", error);
		toast.add({
			title: "Error",
			description: "Failed to update client. Please try again.",
			color: "error",
		});
	} finally {
		isSubmitting.value = false;
	}
};

function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
</script>

<template>
	<div class="flex flex-col gap-6 min-h-screen">
		<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
			<div class="flex items-center gap-4">
				<UButton
					variant="outline"
					icon="i-lucide-arrow-left"
					:to="`/clients/${clientId}`"
				/>
				<h1 class="text-xl font-semibold">Edit Client</h1>
			</div>

			<div v-if="pending" class="flex items-center justify-center min-h-96">
				<div class="text-center">
					<div
						class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
					></div>
					<p class="text-muted">Loading client...</p>
				</div>
			</div>

			<div v-else-if="error" class="flex items-center justify-center min-h-96">
				<div class="text-center">
					<h2 class="text-2xl font-semibold">Client not found</h2>
					<p class="mt-2 text-muted">
						The client you're trying to edit doesn't exist.
					</p>
					<UButton to="/clients" class="mt-4">Back to Clients</UButton>
				</div>
			</div>

			<div v-else class="grid gap-6">
				<UForm @submit.prevent="onSubmit">
					<UCard>
						<template #header>
							<div>
								<h3 class="text-lg font-semibold">Edit Client</h3>
								<p class="text-sm text-stone-500">
									Update client information
								</p>
							</div>
						</template>
						<div class="flex flex-col gap-4">
							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField
									label="Client Name"
									name="name"
									class="flex-1"
									required
								>
									<UInput
										v-model="state.name"
										placeholder="Company or client name"
										class="w-full"
									/>
								</UFormField>

								<UFormField
									label="Contact Person"
									name="contactPerson"
									class="flex-1"
								>
									<UInput
										v-model="state.contactPerson"
										placeholder="Primary contact name"
										class="w-full"
									/>
								</UFormField>
							</div>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField label="Email" name="email" class="flex-1">
									<UInput
										v-model="state.email"
										type="email"
										placeholder="contact@example.com"
										class="w-full"
									/>
								</UFormField>

								<UFormField
									label="Phone Number"
									name="phoneNumber"
									class="flex-1"
								>
									<UInput
										v-model="state.phoneNumber"
										placeholder="Phone number"
										class="w-full"
									/>
								</UFormField>
							</div>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField label="Address" name="address" class="flex-1">
									<UInput
										v-model="state.address"
										placeholder="Street address"
										class="w-full"
									/>
								</UFormField>

								<UFormField label="City" name="city" class="flex-1">
									<UInput
										v-model="state.city"
										placeholder="City"
										class="w-full"
									/>
								</UFormField>
							</div>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField
									label="Postcode"
									name="postcode"
									class="flex-1"
								>
									<UInput
										v-model="state.postcode"
										placeholder="Postcode"
										class="w-full"
									/>
								</UFormField>

								<UFormField label="Country" name="country" class="flex-1">
									<UInput
										v-model="state.country"
										placeholder="Country"
										class="w-full"
									/>
								</UFormField>
							</div>

							<UFormField label="Notes" name="notes">
								<UTextarea
									v-model="state.notes"
									placeholder="Additional notes about this client"
									class="w-full"
								/>
							</UFormField>

							<div class="flex gap-2">
								<UButton
									type="submit"
									:loading="isSubmitting"
									:disabled="isSubmitting"
								>
									{{ isSubmitting ? "Updating..." : "Update Client" }}
								</UButton>
								<UButton
									variant="outline"
									:to="`/clients/${clientId}`"
									:disabled="isSubmitting"
								>
									Cancel
								</UButton>
							</div>
						</div>
					</UCard>
				</UForm>
			</div>
		</main>
	</div>
</template>
