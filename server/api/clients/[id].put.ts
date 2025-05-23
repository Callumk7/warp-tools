import { db } from '../../utils/db';
import { client } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const body = await readBody(event);
  
  try {
    // Validate required fields
    if (!body.name) {
      throw createError({
        statusCode: 400,
        message: 'Client name is required'
      });
    }
    
    // Update client in database
    await db.update(client)
      .set({
        name: body.name,
        contactPerson: body.contactPerson,
        email: body.email,
        phoneNumber: body.phoneNumber,
        address: body.address,
        city: body.city,
        postcode: body.postcode,
        country: body.country,
        notes: body.notes,
        updatedAt: new Date()
      })
      .where(eq(client.id, id));
    
    return { id, success: true };
  } catch (error) {
    console.error(`Error updating client ${id}:`, error);
    throw createError({
      statusCode: 500,
      message: 'Error updating client'
    });
  }
});

