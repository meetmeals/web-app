import { useTranslation } from 'react-i18next';
import { FaHeart, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import styles from './package-card.module.scss';

type PackageCardProps = {
    packageId: number;
    packageImageUrl?: string;
    isFavorite: number;
    setFavorite: (packageId: number) => void;
    topBadgeType?: string;
    topBadgeText?: string;
    chefLogoUrl?: string;
    chefTitle: string;
    packageTitle: string;
    deliveryStartDate?: string;
    deliveryEndDate?: string;
    distance: number;
    price: number;
    isLoggedIn: boolean;
};

function PackageCard(props: PackageCardProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    function handlePackageClick() {
        navigate(`/packages/${props.packageId}`);
    }

    function handleFavoriteClick(e: React.MouseEvent<SVGElement>) {
        e.stopPropagation();
        props.setFavorite(props.packageId);
    }

    const ASSETS_BASE_URL = process.env.REACT_APP_ASSETS_BASE_URL;

    return (
        <div className={styles.container} onClick={handlePackageClick}>
            <section
                className={styles['container__header']}
                style={{
                    backgroundImage: props.packageImageUrl
                        ? `url('${ASSETS_BASE_URL}/${props.packageImageUrl}')`
                        : 'url("/img/meal-placeholder.png")',
                }}
            >
                <section className={styles['container__header__top']}>
                    {props.isLoggedIn && (
                        <FaHeart
                            className={
                                styles['container__header__top__favorite']
                            }
                            size="22px"
                            color={props.isFavorite ? '#ff7072' : 'transparent'}
                            onClick={(e) => handleFavoriteClick(e)}
                            {...(!props.isFavorite && {
                                style: { stroke: '#eee', strokeWidth: '35px' },
                            })}
                        />
                    )}
                    <span>{props.topBadgeText}</span>
                </section>
                <section className={styles['container__header__bottom']}>
                    <img
                        alt="Chef logo"
                        className={
                            styles['container__header__bottom__chef-img']
                        }
                        src={
                            props.chefLogoUrl
                                ? `${ASSETS_BASE_URL}/${props.chefLogoUrl}`
                                : '/img/icons/common/chef-img-placeholder.png'
                        }
                    />
                    <span
                        className={
                            styles['container__header__bottom__chef-name']
                        }
                    >
                        {props.chefTitle}
                    </span>
                </section>
            </section>
            <section className={styles['container__body']}>
                <section className={styles['container__body__package-info']}>
                    <p className={styles['container__body__package-info__row']}>
                        <img
                            alt="Dish name"
                            className={
                                styles[
                                    'container__body__package-info__row__dish'
                                ]
                            }
                            src="/img/icons/common/dish.png"
                        />
                        <span>{props.packageTitle}</span>
                    </p>
                    <p className={styles['container__body__package-info__row']}>
                        <FaClock size="22px" color="black" />
                        <span>
                            {t('app.tomorrow')} {t('app.from')}{' '}
                            {props.deliveryStartDate} {t('app.to')}{' '}
                            {props.deliveryEndDate}
                        </span>
                    </p>
                    <p className={styles['container__body__package-info__row']}>
                        <FaMapMarkerAlt size="22px" color="black" />
                        <span>
                            {props.distance.toString().trim().length > 0
                                ? `${props.distance} km`
                                : t('app.unknown')}
                        </span>
                    </p>
                </section>
                <p className={styles['container__body__package-price']}>
                    &euro; {props.price}
                </p>
            </section>
        </div>
    );
}

export default PackageCard;
