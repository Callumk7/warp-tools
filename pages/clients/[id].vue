<template>
  <div v-if="!client">
    No Data
  </div>
  <div v-else class="space-y-4">
    <UBreadcrumb :items="items" />
    <UCard variant="outline">
      <template #header>
        <h2 class="text-2xl font-bold">{{ client.name }}</h2>
      </template>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ client.name }}</td>
            <td>{{ client.email }}</td>
          </tr>
        </tbody>
      </table>
    </UCard>
    <UTable :data="client.projects" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const clientId = route.params.id as string;

const { data: client, error } = await useFetch(`/api/clients/${clientId}`);

import type { BreadcrumbItem } from '@nuxt/ui'

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Home',
    icon: 'i-lucide-house'
  },
  {
    label: 'Components',
    icon: 'i-lucide-box',
    to: '/components'
  },
  {
    label: 'Breadcrumb',
    icon: 'i-lucide-link',
    to: '/components/breadcrumb'
  }
])
</script>

<style lang="css" scoped>
table {
  width: 100%;

  th,
  td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
}
</style>
