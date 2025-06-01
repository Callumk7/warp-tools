<script setup lang="ts">
import type { z } from "zod";
import { clientInsertSchema } from "~/db/schema";

const toast = useToast();

const schema = clientInsertSchema.omit({
	userId: true,
	createdAt: true,
	updatedAt: true,
});

type Schema = z.infer<typeof schema>;

const state = reactive<Partial<Schema>>({
	name: undefined,
	contactPerson: undefined,
	email: undefined,
	phoneNumber: undefined,
	address: undefined,
	city: undefined,
	postcode: undefined,
	country: undefined,
	notes: undefined,
});

const isSubmitting = ref(false);

const onSubmit = async () => {
	if (isSubmitting.value) return;

	if (!state.name?.trim()) {
		toast.add({
			title: "Error",
			description: "Client name is required",
			color: "error",
		});
		return;
	}

	isSubmitting.value = true;

	try {
		const result = await $fetch("/api/clients", {
			method: "POST",
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
				description: "Client created successfully",
				color: "success",
			});
			await navigateTo("/clients");
		}
	} catch (error) {
		console.error("Failed to create client:", error);
		toast.add({
			title: "Error",
			description: "Failed to create client. Please try again.",
			color: "error",
		});
	} finally {
		isSubmitting.value = false;
	}
};
</script>

<template>
	<div class="flex flex-col gap-6 min-h-screen">
		<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
			<div class="flex items-center gap-4">
				<UButton variant="outline" icon="i-lucide-arrow-left" to="/clients" />
				<h1 class="text-xl font-semibold">Create New Client</h1>
			</div>
			<div class="grid gap-6">
				<UForm :schema="schema" :state="state" @submit="onSubmit">
					<UCard>
						<template #header>
							<div>
								<h3 class="text-lg font-semibold">New Client</h3>
								<p class="text-sm text-muted">Create a new client</p>
							</div>
						</template>
						<div class="flex flex-col gap-4">
							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField
									label="Client Name"
									name="name"
									class="flex-1 min-h-24"
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
									class="flex-1 min-h-24"
								>
									<UInput
										v-model="state.contactPerson"
										placeholder="Primary contact name"
										class="w-full"
									/>
								</UFormField>
							</div>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField
									label="Email"
									name="email"
									class="flex-1 min-h-24"
								>
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
									class="flex-1 min-h-24"
								>
									<UInput
										v-model="state.phoneNumber"
										placeholder="Phone number"
										class="w-full"
									/>
								</UFormField>
							</div>

							<div class="w-full flex justify-stretch items-center gap-2">
								<UFormField
									label="Address"
									name="address"
									class="flex-1 min-h-24"
								>
									<UInput
										v-model="state.address"
										placeholder="Street address"
										class="w-full"
									/>
								</UFormField>

								<UFormField
									label="City"
									name="city"
									class="flex-1 min-h-24"
								>
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
									class="flex-1 min-h-24"
								>
									<UInput
										v-model="state.postcode"
										placeholder="Postcode"
										class="w-full"
									/>
								</UFormField>

								<UFormField
									label="Country"
									name="country"
									class="flex-1 min-h-24"
								>
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

							<UButton
								type="submit"
								:loading="isSubmitting"
								:disabled="isSubmitting"
							>
								{{ isSubmitting ? "Creating..." : "Create Client" }}
							</UButton>
						</div>
					</UCard>
				</UForm>
			</div>
		</main>
	</div>
</template>
