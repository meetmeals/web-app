import { useTranslation } from 'react-i18next';

import StarRating from 'components/star-rating';

import styles from './comments.module.scss';

const data = [
    {
        id: 3,
        order_number: '206729',
        total_price: 10,
        date: '2023-10-03 21:20:07',
        restaurant_name: 'Chef Sara',
        logo: null,
        total_satisfaction: 10,
        desc_satisfaction:
            'My Comment Goes hereMy Comment Goes herMy Comment Goes herMy Comment Goes herMy Comment Goes herMy Comment Goes herMy Comment Goes herMy Comment Goes herMy Comment Goes herMy Comment Goes herMy Comment Goes herMy Comment Goes hereeeeeeeeeee',
    },
    {
        id: 4,
        order_number: '206729',
        total_price: 10,
        date: '2023-10-03 21:20:07',
        restaurant_name: 'Chef Sara',
        logo: null,
        total_satisfaction: 10,
        desc_satisfaction: 'My Comment Goes here',
    },
    {
        id: 5,
        order_number: '206729',
        total_price: 10,
        date: '2023-10-03 21:20:07',
        restaurant_name: 'Chef Sara',
        logo: null,
        total_satisfaction: 10,
        desc_satisfaction: 'My Comment Goes here',
    },
];

function Comments() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            {data.map((comment) => (
                <div className={styles['container__comment']} key={comment.id}>
                    <section className={styles['container__comment__top']}>
                        <section>
                            <img
                                alt="Chef icon"
                                src="/img/icons/common/chef-img-placeholder.png"
                            />
                            <span>{comment.restaurant_name}</span>
                        </section>
                    </section>
                    <section className={styles['container__comment__middle']}>
                        <section
                            className={
                                styles['container__comment__middle__left']
                            }
                        >
                            <section>
                                <p>
                                    {t('comments.price')}: &euro;
                                    {comment.total_price}
                                </p>
                                <p>
                                    {t('comments.orderNumber')}:{' '}
                                    {comment.order_number}
                                </p>
                            </section>
                        </section>
                        <section
                            className={
                                styles['container__comment__middle__right']
                            }
                        >
                            <p>{comment.date.split(' ')[0]}</p>
                        </section>
                    </section>
                    <div className={styles['container__comment__separator']} />
                    <section className={styles['container__comment__bottom']}>
                        <StarRating
                            rating={comment.total_satisfaction}
                            setRating={console.warn}
                        />
                        <p>{comment.desc_satisfaction}</p>
                    </section>
                </div>
            ))}
        </div>
    );
}

export default Comments;
