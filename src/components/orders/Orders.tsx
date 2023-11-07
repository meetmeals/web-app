import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { OrderInterface, OrdersResponseInterface } from 'models/orders';
import { RootState } from 'stores';
import apiClient from 'utilities/api-client';
import { debounce } from 'utilities/helpers';

import Order from './Order';
import OrderDetails from './OrderDetails';

import styles from './orders.module.scss';
import LoadingOverlay from 'components/loading-overlay/LoadingOverlay';

enum OrderType {
    Old,
    New,
}

function Orders() {
    const [orderType, setOrderType] = React.useState<OrderType>(OrderType.New);
    const [orders, setOrders] = React.useState<Array<OrderInterface>>([]);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [hasNextPage, setHasNextPage] = React.useState<boolean>(false);

    const { token } = useSelector((root: RootState) => root.user);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [orderId, setOrderId] = React.useState<string>('');
    const [searchParams, setSearchParams] = useSearchParams();

    React.useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            const ordersResponse: OrdersResponseInterface =
                await apiClient.orders[
                    orderType === OrderType.New
                        ? 'orderNewList'
                        : 'orderOldList'
                ](
                    {
                        Authorization: `Bearer ${token}`,
                    },
                    currentPage,
                );
            switch (ordersResponse.status) {
                case 200:
                    setOrders((prevOrders) => [
                        ...prevOrders,
                        ...ordersResponse.data.data,
                    ]);
                    setHasNextPage(
                        ordersResponse.data.next_page_url === null
                            ? false
                            : true,
                    );
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
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, orderType, token]);

    React.useEffect(() => {
        const orderIdParam = searchParams.get('order-id');

        if (!orderIdParam) {
            setOrderId('');
            return;
        }

        setOrderId(orderIdParam);
    }, [searchParams, setSearchParams]);

    function handleOrderTypeChange(orderType: OrderType) {
        setOrderType(orderType);
        setCurrentPage(1);
        setOrders([]);
    }

    function handleScroll(e: React.UIEvent<HTMLDivElement>) {
        const { target } = e;
        const div = target as HTMLDivElement;
        if (
            div.offsetHeight - (div.scrollHeight - div.scrollTop) < -200 ||
            isLoading
        )
            return;
        if (hasNextPage) setCurrentPage((prev) => prev + 1);
    }

    function handlePackageClick(orderId: number) {
        const selectedOrder = orders?.find(
            (order) => order.order_id === orderId,
        );
        navigate(`/account?tab=orders&order-id=${orderId}`, {
            state: selectedOrder,
        });
    }

    if (isLoading) return <LoadingOverlay />;

    let content = null;
    if (orders?.length === 0 && !isLoading) {
        content = (
            <p className={styles['container__not-found']}>
                {t('orders.notFound')}
            </p>
        );
    } else {
        content = orders?.map((order: OrderInterface) => {
            const props = {
                orderId: order.order_id,
                packageId: order.package_id,
                status: order.status,
                restaurantId: order.restaurant_id,
                delivery_date: order.delivery_date,
                restaurant_name: order.restaurant_name,
                logo: order.logo,
                date: order.date,
                total_satisfaction: order.total_satisfaction,
                package_name: order.package_name,
                food_img: order.food_img,
                handlePackageClick,
            };
            return <Order key={order.order_id} {...props} />;
        });
    }

    return (
        <div className={styles.container}>
            {orderId ? (
                <OrderDetails orderId={orderId} />
            ) : (
                <>
                    <section className={styles['container__choose-type']}>
                        <button
                            className={classNames(
                                styles['container__choose-type__btn'],
                                {
                                    [styles[
                                        'container__choose-type__btn--active'
                                    ]]: orderType === OrderType.New,
                                },
                            )}
                            onClick={() => handleOrderTypeChange(OrderType.New)}
                        >
                            {t('orders.new')}
                        </button>
                        <button
                            className={classNames(
                                styles['container__choose-type__btn'],
                                {
                                    [styles[
                                        'container__choose-type__btn--active'
                                    ]]: orderType === OrderType.Old,
                                },
                            )}
                            onClick={() => handleOrderTypeChange(OrderType.Old)}
                        >
                            {t('orders.history')}
                        </button>
                    </section>
                    <div
                        className={styles['container__content']}
                        onScroll={debounce(handleScroll)}
                    >
                        {content}
                    </div>
                </>
            )}
        </div>
    );
}

export default Orders;
