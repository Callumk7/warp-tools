import { db } from '../../utils/db';
import { clients } from '../../../db/schema';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.name) {
      throw createError({
        statusCode: 400,
        message: 'Client name is required'
      });
    }
    
    // Insert client into database
    const result = await db.insert(clients).values({
      id: body.id,
      userId: body.userId || '1', // Hardcoded for now
      name: body.name,
      contactPerson: body.contactPerson,
      email: body.email,
      phoneNumber: body.phoneNumber,
      address: body.address,
      city: body.city,
      postcode: body.postcode,
      country: body.country,
      notes: body.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return { id: body.id, success: true };
  } catch (error) {
    console.error('Error creating client:', error);
    throw createError({
      statusCode: 500,
      message: 'Error creating client'
    });
  }
});

