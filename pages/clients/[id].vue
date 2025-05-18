<template>
  <div>
    <div v-if="isLoading">
      <p class="text-center py-8">Loading client details...</p>
    </div>
    
    <div v-else-if="error">
      <div class="bg-red-50 border-l-4 border-red-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else>
      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Edit Client: {{ client.name }}
          </h2>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button 
            type="button" 
            @click="deleteClient"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Client
          </button>
        </div>
      </div>
      
      <ClientForm 
        :client="client" 
        @submit="updateClient" 
        @cancel="navigateBack" 
      />
      
      <div class="mt-10">
        <h3 class="text-lg font-medium text-gray-900">Projects</h3>
        <div class="mt-4">
          <div v-if="client.projects && client.projects.length > 0" class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Project Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rate</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="project in client.projects" :key="project.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ project.name }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                          :class="{
                            'bg-green-100 text-green-800': project.status === 'COMPLETED',
                            'bg-blue-100 text-blue-800': project.status === 'IN_PROGRESS',
                            'bg-yellow-100 text-yellow-800': project.status === 'ON_HOLD',
                            'bg-red-100 text-red-800': project.status === 'CANCELLED'
                          }">
                      {{ project.status }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ project.rateType === 'HOURLY' ? `£${project.rateAmount}/hr` : `£${project.rateAmount} fixed` }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <NuxtLink :to="`/projects/${project.id}`" class="text-indigo-600 hover:text-indigo-900">View</NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-4 bg-gray-50 rounded-md">
            <p class="text-sm text-gray-500">No projects yet.</p>
            <NuxtLink :to="`/projects/new?clientId=${client.id}`" class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Create Project
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const clientId = route.params.id as string;

const isLoading = ref(true);
const error = ref(null);
const client = ref(null);

// Fetch client details
const fetchClient = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const { data, error: fetchError } = await useFetch(`/api/clients/${clientId}`);
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message || 'Failed to load client');
    }
    
    client.value = data.value;
  } catch (err) {
    console.error('Error fetching client:', err);
    error.value = 'Failed to load client details. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Update client
const updateClient = async (clientData) => {
  try {
    const updatedClient = {
      ...clientData,
      updatedAt: new Date()
    };
    
    const { data, error: updateError } = await useFetch(`/api/clients/${clientId}`, {
      method: 'PUT',
      body: updatedClient
    });
    
    if (updateError.value) {
      throw new Error(updateError.value.message || 'Failed to update client');
    }
    
    // Refresh client data
    await fetchClient();
    
    alert('Client updated successfully');
  } catch (err) {
    console.error('Error updating client:', err);
    alert('Failed to update client. Please try again.');
  }
};

// Delete client
const deleteClient = async () => {
  if (!confirm('Are you sure you want to delete this client? This will also delete all associated projects and invoices.')) {
    return;
  }
  
  try {
    const { data, error: deleteError } = await useFetch(`/api/clients/${clientId}`, {
      method: 'DELETE'
    });
    
    if (deleteError.value) {
      throw new Error(deleteError.value.message || 'Failed to delete client');
    }
    
    router.push('/clients');
  } catch (err) {
    console.error('Error deleting client:', err);
    alert('Failed to delete client. Please try again.');
  }
};

const navigateBack = () => {
  router.push('/clients');
};

// Fetch client data when component mounts
onMounted(fetchClient);
</script>

