<template>
  <div>
    <UButton to="/clients/new">New</UButton>
    <UTable :data="safeClients" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { Client } from '~/db/schema';

// Fetch clients with proper error handling and default value
const { data: clients, error } = await useFetch<Client[]>('/api/clients');

// Make sure we always have an array, even if the API returns null
const safeClients = computed(() => clients.value || []);

const ULink = resolveComponent("ULink");

const columns: TableColumn<Client>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => h(ULink, { to: `/clients/${row.original.id}` }, { default: () => row.original.name })
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ cell }) => cell.getValue()
    }
]


// Handle errors
if (error.value) {
    console.error('Failed to load clients:', error.value);
}
</script>
