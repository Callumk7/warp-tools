<template>
  <div>
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Add New Client</h2>
      </div>
    </div>
    
    <ClientForm @submit="createClient" @cancel="navigateBack" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const createClient = async (clientData) => {
  try {
    // Set default values for a new client
    const newClient = {
      ...clientData,
      userId: '1', // Hardcoded for now, will be replaced with auth user ID later
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Send data to API
    const { data, error } = await useFetch('/api/clients', {
      method: "POST",
      body: newClient
    });
    
    if (error.value) {
      throw new Error(error.value.message || 'Failed to create client');
    }
    
    // Navigate back to clients list
    router.push('/clients');
  } catch (error) {
    console.error('Error creating client:', error);
    alert('Failed to create client. Please try again.');
  }
};

const navigateBack = () => {
  router.push('/clients');
};
</script>

