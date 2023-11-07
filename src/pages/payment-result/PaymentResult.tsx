import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';

import LoadingOverlay from 'components/loading-overlay';

import styles from './payment-result.module.scss';

function PaymentResult() {
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [searchParams] = useSearchParams();
    const [paymentStatus, setPaymentStatus] = React.useState<string>('');
    const [orderId, setOrderId] = React.useState<string>('');

    const navigate = useNavigate();
    const stripe = useStripe();
    const { t } = useTranslation();

    React.useEffect(() => {
        const paymentIntentClientSecret = searchParams.get(
            'payment_intent_client_secret',
        );
        setOrderId(searchParams.get('order-id') ?? '');

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

    React.useEffect(() => {
        if (orderId) {
            console.log(orderId);
        }
    }, [orderId]);

    function handleViewOrder() {
        navigate(`/account?tab=orders&order-id=${orderId}`);
    }

    return (
        <div className={styles.container}>
            {isLoading && <LoadingOverlay />}
            <img
                alt="Follow your order"
                src="/img/icons/common/after-payment.png"
                className={styles['container__img']}
            />
            {!isLoading && (
                <>
                    <h1 className={styles['container__header']}>
                        {t(paymentStatus)}!
                    </h1>
                    {orderId && (
                        <button
                            className={styles['container__btn']}
                            onClick={handleViewOrder}
                        >
                            {t('payment.viewOrder')}
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

export default PaymentResult;
