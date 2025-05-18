import { db } from '../../utils/db';
import { clients } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  
  try {
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, id),
      with: {
        projects: true
      }
    });
    
    if (!client) {
      throw createError({
        statusCode: 404,
        message: 'Client not found'
      });
    }
    
    return client;
  } catch (error) {
    console.error(`Error fetching client ${id}:`, error);
    throw createError({
      statusCode: 500,
      message: 'Error fetching client'
    });
  }
});

