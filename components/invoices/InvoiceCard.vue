<template>
  <div class="flex flex-col gap-2 py-2">
    <h3 class="text-lg font-bold">{{ props.invoiceNumber }}</h3>
    <div class="text-[0.6rem] bg-amber-200 rounded-full px-2 py-1 text-black w-fit">{{props.invoiceStatus}}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  invoiceNumber: string;
  invoiceAmount: number;
  invoiceDueDate: string;
  invoiceStatus: string;
}

const props = defineProps<Props>();
</script>
