<script setup lang="ts">
import { z } from "zod";

const newProjectSchema = z.object({
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

type;
</script>

<template>
	<UModal title="Create a project">
		<UButton label="Create Project" color="primary" variant="subtle" />

		<template #body>
			<div>
				<UForm> </UForm>
			</div>
		</template>
	</UModal>
</template>
