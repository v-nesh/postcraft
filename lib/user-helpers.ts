import { plansMap } from '@/lib/constants';
import { NeonQueryFunction } from '@neondatabase/serverless';

export async function hasCancelledSubscription(
  sql: NeonQueryFunction<false, false>,
  email: string
) {
  const query = await sql`SELECT * FROM users where email=${email} AND status='cancelled'`;
  return query && query?.length > 0;
}

export async function updateUserId(
  sql: NeonQueryFunction<false, false>,
  userId: string,
  email: string
) {
  await sql`UPDATE users SET user_id = ${userId} WHERE email=${email}`;
}

export function getPlanType(price_id: string) {
  const checkPlanType = plansMap.filter((plan) => plan.priceId === price_id);
  return checkPlanType[0];
}

export async function doesUserExist(sql: NeonQueryFunction<false, false>, email: string) {
  const query = await sql`SELECT * FROM users where status = 'cancelled' AND email=${email}`;
  return query?.length > 0 ? query : false;
}
