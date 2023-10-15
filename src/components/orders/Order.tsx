import StarRating from 'components/star-rating';

import { NullableNumber, NullableString } from 'models/common';

import styles from './order.module.scss';

type OrderProps = {
    orderId: number;
    packageId: number;
    status: string;
    restaurantId: number;
    delivery_date: NullableString;
    restaurant_name: string;
    logo: NullableString;
    date: NullableString;
    total_satisfaction: NullableNumber;
    package_name: string;
    food_img: NullableString;
    handlePackageClick: (packageId: number) => void;
};

const ASSETS_BASE_URL = process.env.REACT_APP_ASSETS_BASE_URL;

function Order(props: OrderProps) {
    return (
        <div
            className={styles.container}
            onClick={() => props.handlePackageClick(props.orderId)}
        >
            <div className={styles['container__package-img']}>
                <img
                    alt="Package icon"
                    src={`${ASSETS_BASE_URL}/${props.food_img}`}
                    className={styles['container__package-img__img']}
                />
            </div>
            <div className={styles['container__order-details']}>
                <section className={styles['container__order-details__chef']}>
                    <h2
                        className={
                            styles['container__order-details__chef__name']
                        }
                    >
                        {props.restaurant_name}
                    </h2>
                </section>
                <section className={styles['container__order-details__status']}>
                    {props.status}
                </section>
                {props.total_satisfaction !== null && (
                    <section
                        className={styles['container__order-details__rating']}
                    >
                        <StarRating
                            rating={props.total_satisfaction}
                            setRating={console.warn}
                        />
                    </section>
                )}
            </div>
        </div>
    );
}

export default Order;
