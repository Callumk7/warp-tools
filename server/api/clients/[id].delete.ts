import { db } from '../../utils/db';
import { clients } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  
  try {
    // Delete client from database
    await db.delete(clients).where(eq(clients.id, id));
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting client ${id}:`, error);
    throw createError({
      statusCode: 500,
      message: 'Error deleting client'
    });
  }
});

