import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const clients = await db.query.clients.findMany({
      with: {
        projects: true
      }
    });
    
    return clients || [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw createError({
      statusCode: 500,
      message: 'Error fetching clients'
    });
  }
});

