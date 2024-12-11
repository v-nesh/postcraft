import { neon } from '@neondatabase/serverless';

export default async function getDbConnection() {
  const sql = neon(process.env.DATABASE_URL as string);
  return sql;
}
