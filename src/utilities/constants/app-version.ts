import { loadStripe } from '@stripe/stripe-js';

import packageJson from '../../../package.json';

export const APP_NAME = 'Meetmeals';
export const APP_VERSION = packageJson.version;
export const STRIPE_RETURN_URL =
    process.env.REACT_APP_WEB_APP_URL + '/payment-result';
export const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_API_KEY || '',
);
export const ASSETS_BASE_URL = process.env.REACT_APP_ASSETS_BASE_URL;
