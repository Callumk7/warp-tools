<template>
    <div class="w-64 h-screen p-4 flex flex-col gap-4 border-r border-slate-600">
        <SidebarLink v-for="link in sidebarNav" :key="link.to" :to="link.to" :label="link.label" />
    </div>
</template>

<script setup lang="ts">
const sidebarNav = [
    {
        label: 'Clients',
        to: '/clients'
    },
    {
        label: 'Projects',
        to: '/projects'
    },
    {
        label: 'Invoices',
        to: '/invoices'
    },
    {
        label: 'Expenses',
        to: '/expenses'
    },
]
</script>
