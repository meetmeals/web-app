import React from 'react';
import {
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import LoadingSpinner from 'components/loading-spinner';
import { RootState } from 'stores';
import { STRIPE_RETURN_URL } from 'utilities/constants';

import styles from './checkout-form.module.scss';

type CheckoutFormProps = {
    clientSecret: string;
    handleBackClick: () => void;
    orderId: number;
};

function CheckoutForm(props: CheckoutFormProps) {
    const { info } = useSelector((root: RootState) => root.user);
    const stripe = useStripe();
    const elements = useElements();

    const [, setMessage] = React.useState<string>('');
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const { t } = useTranslation();

    React.useEffect(() => {
        if (!stripe) {
            return;
        }

        if (!props.clientSecret) {
            return;
        }

        stripe
            .retrievePaymentIntent(props.clientSecret)
            .then(({ paymentIntent }) => {
                switch (paymentIntent?.status) {
                    case 'succeeded':
                        setMessage('Payment succeeded!');
                        break;
                    case 'processing':
                        setMessage('Your payment is processing.');
                        break;
                    case 'requires_payment_method':
                        setMessage(
                            'Your payment was not successful, please try again.',
                        );
                        break;
                    default:
                        setMessage('Something went wrong.');
                        break;
                }
            });
    }, [props.clientSecret, stripe]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: STRIPE_RETURN_URL + `?order-id=${props.orderId}`,
            },
        });

        if (error.type === 'card_error' || error.type === 'validation_error') {
            setMessage(error.message || '');
        } else {
            setMessage('An unexpected error occurred.');
        }

        setLoading(false);
    }

    const paymentElementOptions: StripePaymentElementOptions = {
        layout: 'tabs',
        defaultValues: {
            billingDetails: {
                name: `${info.fName} ${info.lName}`,
            },
        },
    };

    return (
        <div className={styles.container}>
            <form
                id="payment-form"
                className={styles['container__form']}
                onSubmit={handleSubmit}
            >
                <PaymentElement
                    id="payment-element"
                    className={styles['container__form__payment']}
                    options={paymentElementOptions}
                />
                <div className={styles.flex}>
                    <button
                        className={styles['container__form__btn-area']}
                        id="back"
                        onClick={props.handleBackClick}
                    >
                        <span
                            id="button-back"
                            className={
                                styles['container__form__btn-area__content']
                            }
                        >
                            {t('app.back')}
                        </span>
                    </button>
                    <button
                        className={styles['container__form__btn-area']}
                        disabled={isLoading || !stripe || !elements}
                        id="submit"
                    >
                        <span
                            id="button-text"
                            className={
                                styles['container__form__btn-area__content']
                            }
                        >
                            {isLoading ? <LoadingSpinner /> : t('app.payNow')}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CheckoutForm;
