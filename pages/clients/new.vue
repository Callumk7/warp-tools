<template>
	<div>
		<h1 class="text-2xl font-bold mb-6">Create New Client</h1>

		<UCard variant="soft" class="w-fit mx-auto">
			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4 flex flex-col"
				@submit="onSubmit"
			>
				<UFormField label="Client Name" name="name" required>
					<UInput v-model="state.name" placeholder="Company or client name" />
				</UFormField>

				<UFormField label="Email" name="email">
					<UInput
						v-model="state.email"
						type="email"
						placeholder="contact@example.com"
					/>
				</UFormField>

				<UFormField label="Contact Person" name="contactPerson">
					<UInput
						v-model="state.contactPerson"
						placeholder="Primary contact name"
					/>
				</UFormField>

				<UFormField label="Notes" name="notes">
					<UTextarea
						v-model="state.notes"
						placeholder="Additional notes about this client"
					/>
				</UFormField>

				<UButton variant="outline" @click="navigateBack">Cancel</UButton>
				<UButton type="submit" :loading="isSubmitting">
					{{ isSubmitting ? "Creating..." : "Create Client" }}
				</UButton>
			</UForm>
		</UCard>
	</div>
</template>

<script setup lang="ts">
import { z } from "zod";

const router = useRouter();

// Define the validation schema
const createClientSchema = z.object({
	name: z.string().min(1, "Client name is required"),
	contactPerson: z.string().optional(),
	email: z.string().email("Invalid email address").optional().nullable(),
	phoneNumber: z.string().optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	postcode: z.string().optional(),
	country: z.string().optional(),
	notes: z.string().optional(),
});

const { schema, state, isSubmitting, onSubmit } = useEntityForm({
	schema: createClientSchema,
	endpoint: "/api/clients",
	successMessage: "Client created successfully",
	redirectPath: "/clients",
});

// Navigate back to clients list
function navigateBack() {
	router.push("/clients");
}
</script>
