import BgGradient from '@/components/common/bg-gradient';
import UpgradeYourPlan from '@/components/upload/upgrade-your-plan';
import UploadForm from '@/components/upload/upload-form';
import getDbConnection from '@/lib/db';
import {
  doesUserExist,
  getPlanType,
  hasCancelledSubscription,
  updateUserId,
} from '@/lib/user-helpers';
import { currentUser } from '@clerk/nextjs/server';
import { Badge } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const clearkUser = await currentUser();
  if (!clearkUser) return redirect('/sign-in')
  const email = clearkUser?.emailAddresses[0].emailAddress ?? '';
  const sql = await getDbConnection();
  const user = await doesUserExist(sql, email);
  let userId = null;
  // let priceId = null;

  const hasUserCancelled = await hasCancelledSubscription(sql, email);

  if (user) {
    userId = clearkUser?.id;
    if (userId) await updateUserId(sql, userId, email);
    // priceId = user[0].price_id;
  }
  // const { id: planTypeId = 'starter', name: planTypeName } = getPlanType(priceId);

  // const isBasicPlan = planTypeId === 'basic';
  // const isProPlan = planTypeId === 'pro';

  return (
    <BgGradient>
      <div className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8'>
        <div className='flex flex-col items-center justify-center gap-6 text-center'>

          <h2 className='capitalize text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            Start creating amazing content
          </h2>

          <p className='mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center'>
            Upload your audio or video file and let our AI do the magic!
          </p>

          {true && (
            <p className='mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center'>
              You get{' '}
              <span className='font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md'>
                unlimited blog posts
              </span>{' '}
              {/* as part of the <span className='font-bold capitalize'>{planTypeName}</span> Plan. */}
            </p>
          )}

          {true ? (
            <BgGradient>
              <UploadForm />
            </BgGradient>
          ) : (
            <UpgradeYourPlan />
          )}
        </div>
      </div>
    </BgGradient>
  );
}
