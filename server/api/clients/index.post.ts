import { db } from '../../utils/db';
import { clients } from '../../../db/schema';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Define validation schema for incoming data
const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Client name is required'),
  contactPerson: z.string().optional().nullable(),
  email: z.string().email('Invalid email address').optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postcode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  userId: z.string().optional() // Will be replaced with auth user ID later
});

export default defineEventHandler(async (event) => {
  try {
    // Read request body
    const body = await readBody(event);
    
    // Validate incoming data
    const validationResult = clientSchema.safeParse(body);
    
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: validationResult.error.format()
      });
    }

    
    // Extract validated data
    const validatedData = validationResult.data;
		console.log(validatedData);
    
    // Generate ID if not provided
    const clientId = validatedData.id || uuidv4();
    
    // Prepare client data for insertion
    const clientData = {
      id: clientId,
      userId: "34d13d61-417f-4729-a81e-304a87f38847", // Hardcoded for now, will be replaced with auth user ID later
      name: validatedData.name,
      contactPerson: validatedData.contactPerson,
      email: validatedData.email,
      phoneNumber: validatedData.phoneNumber,
      address: validatedData.address,
      city: validatedData.city,
      postcode: validatedData.postcode,
      country: validatedData.country,
      notes: validatedData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert client into database
    await db.insert(clients).values(clientData);
    
    // Return success response with the new client ID
    return {
      id: clientId,
      success: true,
      message: 'Client created successfully'
    };
  } catch (error) {
    // Handle validation errors
    if (error.statusCode === 400) {
      throw error; // Re-throw validation errors
    }
    
    // Log database or other errors
    console.error('Error creating client:', error);
    
    // Return appropriate error response
    throw createError({
      statusCode: 500,
      message: 'Error creating client',
      data: {
        error: error.message
      }
    });
  }
});
