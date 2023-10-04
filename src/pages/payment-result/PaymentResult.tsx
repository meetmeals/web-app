import { useStripe } from '@stripe/react-stripe-js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import styles from './payment-result.module.scss';

function PaymentResult() {
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [searchParams] = useSearchParams();
    const [paymentStatus, setPaymentStatus] = React.useState<string>('');

    const stripe = useStripe();
    const { t } = useTranslation();

    React.useEffect(() => {
        const paymentIntentClientSecret = searchParams.get(
            'payment_intent_client_secret',
        );

        if (paymentIntentClientSecret) {
            if (!stripe) {
                return;
            }
            stripe
                .retrievePaymentIntent(paymentIntentClientSecret)
                .then(({ paymentIntent }) => {
                    switch (paymentIntent?.status) {
                        case 'succeeded':
                            setPaymentStatus('payment.succeeded');
                            break;
                        case 'processing':
                            setPaymentStatus('payment.processing');
                            break;
                        case 'requires_payment_method':
                            setPaymentStatus('payment.requiresPaymentMethod');
                            break;
                        default:
                            setPaymentStatus('payment.Failed');
                            break;
                    }
                    setLoading(false);
                });
        } else {
            setPaymentStatus('payment.unknownStatus');
            setLoading(false);
        }
    }, [searchParams, stripe]);

    return (
        <div className={styles.container}>
            <h1>{isLoading ? 'Loading...' : t(paymentStatus)}</h1>
        </div>
    );
}

export default PaymentResult;
