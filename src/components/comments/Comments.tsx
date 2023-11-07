import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import LoadingOverlay from 'components/loading-overlay';
import StarRating from 'components/star-rating';
import {
    SatisfactionInterface,
    SatisfactionListResponseInterface,
} from 'models/satisfactions';
import { RootState } from 'stores';
import { setLoggedIn } from 'stores/user';
import apiClient from 'utilities/api-client';
import { ASSETS_BASE_URL } from 'utilities/constants';
import { debounce } from 'utilities/helpers';

import styles from './comments.module.scss';

function Comments() {
    const [comments, setComments] = React.useState<
        Array<SatisfactionInterface>
    >([]);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [hasNextPage, setHasNextPage] = React.useState<boolean>(false);

    const { token } = useSelector((root: RootState) => root.user);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    React.useEffect(() => {
        async function fetchComments() {
            if (currentPage === 1) setLoading(true);
            try {
                const commentsResponse: SatisfactionListResponseInterface =
                    await apiClient.satisfactions.satisfactionList(
                        {
                            Authorization: `Bearer ${token}`,
                        },
                        currentPage,
                    );
                switch (commentsResponse.status) {
                    case 200:
                        setComments((prevComments) => [
                            ...prevComments,
                            ...commentsResponse.data.data,
                        ]);
                        setHasNextPage(
                            commentsResponse.data.next_page_url === null
                                ? false
                                : true,
                        );
                        break;
                    case 400:
                        break;
                    case 401:
                        dispatch(setLoggedIn({ isLoggedIn: false }));
                        break;
                    default:
                        break;
                }
            } catch (e) {
                console.warn(e);
            } finally {
                setLoading(false);
            }
        }
        fetchComments();
    }, [currentPage, dispatch, token]);

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

    if (isLoading) return <LoadingOverlay />;

    let content = null;
    if (comments.length === 0 && !isLoading) {
        content = (
            <div className={styles['container__loading']}>
                <img
                    alt="No comments yet"
                    src="/img/icons/common/not-found.jpg"
                />
                <p>{t('comments.notFound')}</p>
            </div>
        );
    } else {
        content = comments.map((comment: SatisfactionInterface) => {
            const imgSrc = comment?.logo
                ? `${ASSETS_BASE_URL}${comment?.logo}`
                : '/img/icons/common/chef-img-placeholder.png';
            return (
                <div className={styles['container__comment']} key={comment.id}>
                    <section className={styles['container__comment__top']}>
                        <section>
                            <img alt="Chef icon" src={imgSrc} />
                            <span>{comment?.restaurant_name}</span>
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
                                    {comment?.total_price}
                                </p>
                                <p>
                                    {t('comments.orderNumber')}:{' '}
                                    {comment?.order_number}
                                </p>
                            </section>
                        </section>
                        <section
                            className={
                                styles['container__comment__middle__right']
                            }
                        >
                            <p>{comment?.date.split(' ')[0]}</p>
                        </section>
                    </section>
                    <div className={styles['container__comment__separator']} />
                    <section className={styles['container__comment__bottom']}>
                        <StarRating
                            rating={comment?.total_satisfaction}
                            setRating={console.warn}
                        />
                        <p>{comment?.desc_satisfaction}</p>
                    </section>
                </div>
            );
        });
    }

    return (
        <div className={styles.container} onScroll={debounce(handleScroll)}>
            {content}
        </div>
    );
}

export default Comments;
