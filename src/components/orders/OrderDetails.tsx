import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import BottomSidebar from 'components/bottom-sidebar';
import LoadingOverlay from 'components/loading-overlay';
import LoadingSpinner from 'components/loading-spinner';
import StarRating from 'components/star-rating';
import {
    OrderDetailsInterface,
    OrderDetailsResponseInterface,
} from 'models/orders';
import { RootState } from 'stores';
import apiClient from 'utilities/api-client';

import styles from './order-details.module.scss';

type OrderDetailsProps = {
    orderId: string;
};

type Satisfaction = {
    foodQuality: number;
    foodVolume: number;
    sellerEncounter: number;
    totalSatisfaction: number;
    comments: string;
};

const SATISFACTION_COMMENTS_MAX_LENGTH = 600;
const SATISFACTION_COMMENTS_ROWS = 8;

enum OrderStatus {
    Paid = '1', // Paid
    Received = '2', // Received
}

function OrderDetails(props: OrderDetailsProps) {
    const [order, setOrder] = React.useState<OrderDetailsInterface>();
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [shouldShowSatisfactionSheet, setShowSatisfactionSheet] =
        React.useState<boolean>(false);
    const [satisfaction, setSatisfaction] = React.useState<Satisfaction>({
        foodQuality: 0,
        foodVolume: 0,
        sellerEncounter: 0,
        totalSatisfaction: 0,
        comments: '',
    });
    const [formChanged, setFormChanged] = React.useState<boolean>(false);
    const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
    const [retries, setRetries] = React.useState<number>(0);
    const [isReceivedLoading, setReceivedLoading] =
        React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');
    const { token } = useSelector((root: RootState) => root.user);
    const navigate = useNavigate();
    const { t } = useTranslation();

    React.useEffect(() => {
        async function fetchOrderDetails() {
            setLoading(true);
            const orderDetailsResponse: OrderDetailsResponseInterface =
                await apiClient.orders.orderDetail(
                    { order_id: props.orderId },
                    {
                        Authorization: `Bearer ${token}`,
                    },
                );
            switch (orderDetailsResponse.status) {
                case 200:
                    setOrder(orderDetailsResponse.data);
                    setLoading(false);
                    break;
                case 400:
                    break;
                case 422:
                    break;
                default:
                    break;
            }
        }
        fetchOrderDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retries, token]);

    function handleRating(key: string, value: number | string) {
        setError('');
        setSatisfaction((prev) => ({ ...prev, [key]: value }));
        setFormChanged(true);
    }

    async function handleReceivedSubmit() {
        if (isReceivedLoading) return;

        setReceivedLoading(true);
        try {
            const orderReceivedResponse = await apiClient.orders.orderReceived(
                props.orderId,
                {
                    Authorization: `Bearer ${token}`,
                },
            );
            switch (orderReceivedResponse.status) {
                case 200:
                case 400:
                    setRetries((prev) => prev + 1);
                    break;
                case 401:
                    break;
            }
        } catch (e) {
            console.warn(e);
        } finally {
            setReceivedLoading(false);
        }
    }

    async function handleSatisfactionSubmit() {
        if (!formChanged || isSubmitting) return;
        if (order?.package_id !== undefined && order.id !== undefined) {
            setSubmitting(true);
            const { totalSatisfaction, comments, ...others } = satisfaction;
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const satisfactionDetailResponse =
                    await apiClient.satisfactions.satisfactionDetail(
                        {
                            food_quality: others.foodQuality,
                            food_volume: others.foodVolume,
                            seller_encounter: others.sellerEncounter,
                            package_id: order?.package_id,
                            order_id: order?.id,
                        },
                        headers,
                    );
                switch (satisfactionDetailResponse.status) {
                    case 200:
                        const satisfactionTotalResponse =
                            await apiClient.satisfactions.satisfactionTotal(
                                {
                                    package_id: order.package_id,
                                    order_id: order.id,
                                    total_satisfaction: totalSatisfaction,
                                },
                                headers,
                            );
                        switch (satisfactionTotalResponse.status) {
                            case 200:
                                const satisfactionDescResponse =
                                    await apiClient.satisfactions.satisfactionDesc(
                                        {
                                            desc_satisfaction: comments,
                                            package_id: order.package_id,
                                            order_id: order.id,
                                        },
                                        headers,
                                    );
                                switch (satisfactionDescResponse.status) {
                                    case 200:
                                        setShowSatisfactionSheet(false);
                                        setRetries((prev) => prev + 1);
                                        break;
                                }
                                break;
                        }
                        break;
                    case 400:
                        setError(
                            t(
                                'orders.orderDetails.ratingNotReceived',
                            ) as string,
                        );
                        break;
                }
            } catch (e) {
                console.warn(e);
            } finally {
                setSubmitting(false);
            }
        }
    }

    if (isLoading) {
        return <LoadingOverlay />;
    } else if (!order && !isLoading) {
        return (
            <p className={styles['container__loading']}>
                {t('orders.orderDetails.notFound')}
            </p>
        );
    }

    let orderStatus: string = '';
    switch (order?.status) {
        case OrderStatus.Paid:
            orderStatus = t('orders.orderDetails.paid');
            break;
        case OrderStatus.Received:
            orderStatus = t('orders.orderDetails.received');
            break;
    }

    return (
        <div className={styles.container}>
            {isReceivedLoading && <LoadingOverlay />}
            <section className={styles['container__order-status']}>
                <h2>{t('orders.orderDetails.orderStatus')}</h2>
                <p>
                    <span>{orderStatus}</span>
                    <span>&#x2714;</span>
                </p>
            </section>
            <section className={styles['container__order-details']}>
                <p>{order?.restaurant_name}</p>
                <p>{order?.restaurant_address}</p>
                <p className={styles['container__order-details__package']}>
                    <span
                        className={
                            styles['container__order-details__package__name']
                        }
                    >
                        {order?.package_name}
                    </span>
                    <span
                        className={
                            styles['container__order-details__package__count']
                        }
                    >
                        x {order?.count_of_package}
                    </span>
                </p>
                <p>{order?.date}</p>
                <p>
                    {t('app.from')} {order?.start_time} {t('app.to')}{' '}
                    {order?.end_time}
                </p>
                <p>
                    {t('orders.orderDetails.price')}: &euro;{order?.total_price}
                </p>
                <p className={styles['container__order-details__need-help']}>
                    <button onClick={() => navigate('/contact-us')}>
                        {t('orders.orderDetails.needHelp')}
                    </button>
                </p>
            </section>
            {order?.status === OrderStatus.Paid && (
                <section className={styles['container__confirm-received']}>
                    <button
                        className={styles['container__confirm-received__btn']}
                        onClick={handleReceivedSubmit}
                    >
                        {t('orders.orderDetails.didYouReceive')}
                    </button>
                </section>
            )}
            {order?.customer_satisfactions_id &&
                order?.total_satisfaction &&
                order.total_satisfaction >= 0 && (
                <section className={styles['container__rating']}>
                    <p className={styles['container__rating__title']}>
                        {t('orders.orderDetails.yourScore')}
                    </p>
                    <div className={styles['container__rating__stars']}>
                        <section>
                            <StarRating
                                rating={order.total_satisfaction}
                                setRating={() => console.warn}
                            />
                        </section>
                        <p
                            className={
                                styles['container__rating__thank-you']
                            }
                        >
                            {t('orders.orderDetails.thankYou')}
                        </p>
                    </div>
                </section>
            )}
            {order?.status === OrderStatus.Received &&
                !order.customer_satisfactions_id && (
                <section className={styles['container__rating']}>
                    <button onClick={() => setShowSatisfactionSheet(true)}>
                        {t('orders.orderDetails.rate')}
                    </button>
                </section>
            )}
            <BottomSidebar
                isOpen={shouldShowSatisfactionSheet}
                setOpen={setShowSatisfactionSheet}
                height={600}
            >
                <div className={styles['container__bottom-sidebar']}>
                    <p className={styles['container__bottom-sidebar__header']}>
                        {t('orders.orderDetails.rateHeader')}
                    </p>
                    <div
                        className={styles['container__bottom-sidebar__rating']}
                    >
                        <section>
                            <p>{t('orders.orderDetails.foodQuality')}</p>
                            <StarRating
                                rating={satisfaction.foodQuality}
                                setRating={(rating) =>
                                    handleRating('foodQuality', rating)
                                }
                            />
                        </section>
                        <section>
                            <p>{t('orders.orderDetails.foodVolume')}</p>
                            <StarRating
                                rating={satisfaction.foodVolume}
                                setRating={(rating) =>
                                    handleRating('foodVolume', rating)
                                }
                            />
                        </section>
                        <section>
                            <p>{t('orders.orderDetails.sellerEncounter')}</p>
                            <StarRating
                                rating={satisfaction.sellerEncounter}
                                setRating={(rating) =>
                                    handleRating('sellerEncounter', rating)
                                }
                            />
                        </section>
                        <section>
                            <p>{t('orders.orderDetails.totalSatisfaction')}</p>
                            <StarRating
                                rating={satisfaction.totalSatisfaction}
                                setRating={(rating) =>
                                    handleRating('totalSatisfaction', rating)
                                }
                            />
                        </section>
                    </div>
                    <div
                        className={
                            styles['container__bottom-sidebar__separator']
                        }
                    />
                    <div
                        className={
                            styles['container__bottom-sidebar__comments']
                        }
                    >
                        <textarea
                            className={
                                styles['container__bottom-sidebar__text-area']
                            }
                            rows={SATISFACTION_COMMENTS_ROWS}
                            maxLength={SATISFACTION_COMMENTS_MAX_LENGTH}
                            autoComplete="off"
                            value={satisfaction.comments}
                            onChange={(e) =>
                                handleRating('comments', e.target.value)
                            }
                            placeholder={t('orders.orderDetails.comments')}
                        />
                    </div>
                    <div
                        className={styles['container__bottom-sidebar__submit']}
                    >
                        {error && <p>{error}</p>}
                        <button onClick={handleSatisfactionSubmit}>
                            {isSubmitting ? (
                                <LoadingSpinner />
                            ) : (
                                t('orders.orderDetails.send')
                            )}
                        </button>
                    </div>
                </div>
            </BottomSidebar>
        </div>
    );
}

export default OrderDetails;
