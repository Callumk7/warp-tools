<template>
  <form @submit.prevent="submitForm">
    <div class="shadow sm:rounded-md sm:overflow-hidden">
      <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
        <div class="grid grid-cols-6 gap-6">
          <!-- Client Name -->
          <div class="col-span-6 sm:col-span-3">
            <label for="name" class="block text-sm font-medium text-gray-700">Client Name</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              v-model="form.name"
              required
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Contact Person -->
          <div class="col-span-6 sm:col-span-3">
            <label for="contactPerson" class="block text-sm font-medium text-gray-700">Contact Person</label>
            <input 
              type="text" 
              name="contactPerson" 
              id="contactPerson" 
              v-model="form.contactPerson"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Email -->
          <div class="col-span-6 sm:col-span-3">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              v-model="form.email"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Phone -->
          <div class="col-span-6 sm:col-span-3">
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              type="text" 
              name="phoneNumber" 
              id="phoneNumber" 
              v-model="form.phoneNumber"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Address -->
          <div class="col-span-6">
            <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
            <input 
              type="text" 
              name="address" 
              id="address" 
              v-model="form.address"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- City -->
          <div class="col-span-6 sm:col-span-2">
            <label for="city" class="block text-sm font-medium text-gray-700">City</label>
            <input 
              type="text" 
              name="city" 
              id="city" 
              v-model="form.city"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Postcode -->
          <div class="col-span-6 sm:col-span-2">
            <label for="postcode" class="block text-sm font-medium text-gray-700">Postcode</label>
            <input 
              type="text" 
              name="postcode" 
              id="postcode" 
              v-model="form.postcode"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Country -->
          <div class="col-span-6 sm:col-span-2">
            <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
            <input 
              type="text" 
              name="country" 
              id="country" 
              v-model="form.country"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Notes -->
          <div class="col-span-6">
            <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
            <textarea 
              name="notes" 
              id="notes" 
              v-model="form.notes"
              rows="3"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button 
          type="button" 
          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  client: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['submit', 'cancel']);

// Initialize form with client data or default values
const form = reactive({
  id: props.client?.id || '',
  name: props.client?.name || '',
  contactPerson: props.client?.contactPerson || '',
  email: props.client?.email || '',
  phoneNumber: props.client?.phoneNumber || '',
  address: props.client?.address || '',
  city: props.client?.city || '',
  postcode: props.client?.postcode || '',
  country: props.client?.country || '',
  notes: props.client?.notes || ''
});

const isSubmitting = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;
  
  try {
    // For new clients, generate an ID
    if (!form.id) {
      form.id = uuidv4();
    }
    
    // Emit the form data to parent component
    emit('submit', { ...form });
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

