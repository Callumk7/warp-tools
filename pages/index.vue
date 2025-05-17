<script setup lang="ts">
const {data} = await useFetch('/api/dummy');
</script>

<template>
    <Navigation />
    <Table />
</template>
