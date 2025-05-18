<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Create New Client</h1>

        <UCard variant="soft" class="w-fit mx-auto">
            <UForm :schema="schema" :state="state" class="space-y-4 flex flex-col" @submit="onSubmit">
                <UFormField label="Client Name" name="name" required>
                    <UInput v-model="state.name" placeholder="Company or client name" />
                </UFormField>

                <UFormField label="Email" name="email">
                    <UInput v-model="state.email" type="email" placeholder="contact@example.com" />
                </UFormField>

                <UFormField label="Contact Person" name="contactPerson">
                    <UInput v-model="state.contactPerson" placeholder="Primary contact name" />
                </UFormField>

                <UFormField label="Notes" name="notes">
                    <UTextarea v-model="state.notes" placeholder="Additional notes about this client" />
                </UFormField>

                <UButton variant="outline" @click="navigateBack">Cancel</UButton>
                <UButton type="submit" :loading="isSubmitting">
                    {{ isSubmitting ? 'Creating...' : 'Create Client' }}
                </UButton>
            </UForm>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import type { FormSubmitEvent } from '#ui/types';

// Define the validation schema
const schema = z.object({
    name: z.string().min(1, 'Client name is required'),
    contactPerson: z.string().optional(),
    email: z.string().email('Invalid email address').optional().nullable(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional(),
    notes: z.string().optional()
});

// Define the form state type
type FormSchema = z.infer<typeof schema>;

// Initialize form state
const state = reactive<FormSchema>({
    name: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    postcode: '',
    country: '',
    notes: ''
});

// Track submission state
const isSubmitting = ref(false);
const toast = useToast();
const router = useRouter();

// Handle form submission
async function onSubmit(event: FormSubmitEvent<FormSchema>) {
    isSubmitting.value = true;

    try {
        // Prepare client data
        const clientData = {
            id: uuidv4(), // Generate a unique ID
            ...event.data,
            userId: "34d13d61-417f-4729-a81e-304a87f38847", // Hardcoded for now, will be replaced with auth user ID later
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Send data to API
        const { data, error } = await useFetch('/api/clients', {
            method: 'POST',
            body: clientData
        });

        if (error.value) {
            throw new Error(error.value.message || 'Failed to create client');
        }

        // Show success message
        toast.add({
            title: 'Success',
            description: 'Client created successfully',
            color: 'success'
        });

        // Navigate back to clients list
        router.push('/clients');
    } catch (error) {
        console.error('Error creating client:', error);

        // Show error message
        toast.add({
            title: 'Error',
            description: error.message || 'Failed to create client. Please try again.',
            color: 'error'
        });
    } finally {
        isSubmitting.value = false;
    }
}

// Navigate back to clients list
function navigateBack() {
    router.push('/clients');
}
</script>
