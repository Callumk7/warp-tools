<template>
  <UCard>
    <div class="flex flex-col gap-2">
      <h2 class="text-2xl font-bold">Invoice Management</h2>
      <p class="text-sm">Create, track, and manage all your invoices</p>
      <div class="w-full">
        <UButton icon="i-lucide-plus" color="neutral" class="float-right" to="/invoices/new">New Invoice</UButton>
      </div>
      <UCard>
        <div class="divide-y space-y-4 divide-slate-800">
          <InvoiceCard 
            v-for="invoice in invoices" 
            :key="invoice.id" 
            :invoice-number="invoice.invoiceNumber"
            :invoice-amount="invoice.subtotal" 
            :invoice-due-date="invoice.dueDate" 
            :invoice-status="invoice.status" 
          />
        </div>
      </UCard>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const { data: invoices, error } = await useFetch("/api/invoices");
</script>
