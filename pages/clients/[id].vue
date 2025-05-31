<script setup lang="ts">
import CreateProjectModal from "~/components/projects/CreateProjectModal.vue";
import type { Project, Client, Invoice } from "~/db/schema";

definePageMeta({
	title: "Client Details",
});

const route = useRoute();
const clientId = route.params.id as string;

const { data: client, refresh: refreshClient } = await useFetch<
	Client & { projects: Project[]; invoices: Invoice[] }
>(`/api/clients/${clientId}`);

const breadcrumbItems = computed(() => [
	{
		label: "Home",
		icon: "i-lucide-house",
		to: "/",
	},
	{
		label: "Clients",
		icon: "i-lucide-users",
		to: "/clients",
	},
	{
		label: client.value?.name || "Client",
		icon: "i-lucide-user",
	},
]);

const editClient = () => {
	// Navigate to edit client page (for future functionality)
	navigateTo(`/clients/${clientId}/edit`);
};

// Handle error and not found states
if (!client.value) {
	throw createError({
		statusCode: 404,
		statusMessage: "Client not found",
	});
}

const onProjectCreated = () => {
	refreshClient();
};
</script>

<template>
	<div v-if="!client" class="flex items-center justify-center min-h-96">
		<div class="text-center">
			<h2 class="text-2xl font-semibold">Client not found</h2>
			<p class="mt-2 text-muted">The client you're looking for doesn't exist.</p>
			<UButton to="/clients" class="mt-4">Back to Clients</UButton>
		</div>
	</div>

	<div v-else class="space-y-6">
		<!-- Breadcrumb -->
		<UBreadcrumb :items="breadcrumbItems" />

		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">
				{{ client.name }}
			</h1>
			<div class="flex space-x-3">
				<UButton variant="outline" icon="i-lucide-edit" @click="editClient">
					Edit Client
				</UButton>
			</div>
		</div>

		<!-- Client Information Card -->
		<UCard>
			<template #header>
				<h2 class="text-xl font-semibold">Client Information</h2>
			</template>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<div v-if="client.contactPerson">
					<h3 class="text-sm font-medium text-muted">Contact Person</h3>
					<p class="mt-1 text-sm">
						{{ client.contactPerson }}
					</p>
				</div>

				<div v-if="client.email">
					<h3 class="text-sm font-medium text-muted">Email</h3>
					<p class="mt-1 text-sm">
						{{ client.email }}
					</p>
				</div>

				<div v-if="client.phoneNumber">
					<h3 class="text-sm font-medium text-muted">Phone Number</h3>
					<p class="mt-1 text-sm">
						{{ client.phoneNumber }}
					</p>
				</div>

				<div v-if="client.address">
					<h3 class="text-sm font-medium text-muted">Address</h3>
					<p class="mt-1 text-sm">
						{{ client.address }}
					</p>
				</div>

				<div v-if="client.city">
					<h3 class="text-sm font-medium text-muted">City</h3>
					<p class="mt-1 text-sm">
						{{ client.city }}
					</p>
				</div>

				<div v-if="client.postcode">
					<h3 class="text-sm font-medium text-muted">Postcode</h3>
					<p class="mt-1 text-sm">
						{{ client.postcode }}
					</p>
				</div>

				<div v-if="client.country">
					<h3 class="text-sm font-medium text-muted">Country</h3>
					<p class="mt-1 text-sm">
						{{ client.country }}
					</p>
				</div>

				<div>
					<h3 class="text-sm font-medium text-muted">Client Since</h3>
					<p class="mt-1 text-sm">
						{{ formatDate(client.createdAt) }}
					</p>
				</div>
			</div>

			<div v-if="client.notes" class="mt-6">
				<h3 class="text-sm font-medium text-muted">Notes</h3>
				<p class="mt-1 text-sm whitespace-pre-wrap">
					{{ client.notes }}
				</p>
			</div>
		</UCard>

		<!-- Projects Section -->
		<div class="space-y-4">
			<Heading :count="client.projects?.length ?? 0">Projects</Heading>

			<!-- Projects Table or Empty State -->
			<UCard v-if="client.projects && client.projects.length > 0">
				<ProjectsTable :projects="client.projects" />
			</UCard>

			<!-- Empty State -->
			<div v-else class="text-center py-12 shadow rounded-lg">
				<div class="flex flex-col items-center">
					<div
						class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
					>
						<UIcon name="i-lucide-folder-open" class="w-8 h-8 text-muted" />
					</div>
					<h3 class="text-lg font-medium mb-2">No projects yet</h3>
					<p class="text-muted mb-6">
						Get started by creating a project for this client.
					</p>
					<CreateProjectModal
						:client-id="client.id"
						@create-project="onProjectCreated"
					/>
				</div>
			</div>
		</div>

		<!--Invoice Section -->
		<div class="space-y-4">
			<Heading :count="client.invoices?.length ?? 0">Invoices</Heading>
			<!-- Projects Table or Empty State -->
			<UCard v-if="client.invoices && client.invoices.length > 0">
				<div v-for="invoice in client.invoices" :key="invoice.id">
					<p>{{ invoice.id }}</p>
				</div>
			</UCard>

			<!-- Empty State -->
			<div v-else class="text-center py-12 shadow rounded-lg">
				<div class="flex flex-col items-center">
					<div
						class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
					>
						<UIcon name="i-lucide-folder-open" class="w-8 h-8 text-muted" />
					</div>
					<h3 class="text-lg font-medium mb-2">No invoices yet</h3>
					<p class="text-muted mb-6">
						Get started by creating an invoice for this client.
					</p>
					<UButton :to="`/invoices/new?clientId=${client.id}`">
						Create Invoice
					</UButton>
				</div>
			</div>
		</div>
	</div>
</template>
