export const plansMap = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Get started with Postcraft!',
    price: '10',
    items: ['3 Blog Posts', '3 Transcription'],
    paymentLink: 'https://buy.stripe.com/test_dR66smaHzgek35K144',
    priceId: process.env.NODE_ENV === 'development' ? 'price_1QTc1tSBQ6YE5q0w6ap0IBlX' : '',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'All Blog Posts, let’s go!',
    price: '19.99',
    items: ['Unlimited Blog Posts', 'Unlimited Transcriptions'],
    paymentLink: 'https://buy.stripe.com/test_dR6bMG2b35zG7m0fYZ',
    priceId: process.env.NODE_ENV === 'development' ? 'price_1QTc4xSBQ6YE5q0wzgqcmOzh' : '',
  },
];

export const ORIGIN_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://postcraft-vercel.app';
