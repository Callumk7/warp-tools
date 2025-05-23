import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../db/schema';
import * as authSchema from '../../db/auth-schema';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a DrizzleORM instance
export const db = drizzle(pool, {schema: { ...schema,...authSchema } });
