import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { PackageViewStatus } from 'utilities/constants';

import styles from './package-card.module.scss';

type PackageCardProps = {
    packageId: number;
    packageImageUrl?: string;
    isFavorite: number;
    setFavorite: (packageId: number) => void;
    topBadgeType?: string;
    chefLogoUrl?: string;
    chefTitle: string;
    packageTitle: string;
    deliveryStartDate?: string;
    deliveryEndDate?: string;
    distance?: string;
    price: number;
    isLoggedIn: boolean;
    handlePackageClick: (packageId: number) => void;
    shouldShrinkView?: boolean;
};

function PackageCard(props: PackageCardProps) {
    const { t } = useTranslation();

    function handleFavoriteClick(e: React.MouseEvent<SVGElement>) {
        e.stopPropagation();
        props.setFavorite(props.packageId);
    }

    const ASSETS_BASE_URL = process.env.REACT_APP_ASSETS_BASE_URL;
    const isPackageDisabled =
        props.topBadgeType && ['1', '2', '6'].includes(props.topBadgeType);

    let topBadgeText: string;
    switch (props.topBadgeType) {
        case '3':
            topBadgeText = `${props.topBadgeType} ${t('app.remaining')}`;
            break;
        default:
            topBadgeText = props.topBadgeType
                ? t(PackageViewStatus[props.topBadgeType].transKey)
                : '';
    }

    return (
        <div
            className={classNames(styles.container, {
                [styles['container__fix-width']]: props.shouldShrinkView,
            })}
            onClick={() => props.handlePackageClick(props.packageId)}
        >
            <section
                className={styles['container__header']}
                style={{
                    backgroundImage: props.packageImageUrl
                        ? `url('${ASSETS_BASE_URL}/${props.packageImageUrl}')`
                        : 'url("/img/meal-placeholder.png")',
                    ...(isPackageDisabled && { opacity: 0.4 }),
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
                    {props.topBadgeType && (
                        <span
                            className={styles['container__header__top__status']}
                            style={{
                                backgroundColor:
                                    PackageViewStatus[props.topBadgeType].color,
                            }}
                        >
                            {topBadgeText}
                        </span>
                    )}
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
                            {isPackageDisabled
                                ? t('app.nothingForTomorrow')
                                : `${t('app.tomorrow')} ${t('app.from')}  ${
                                    props.deliveryStartDate
                                } ${t('app.to')}  ${props.deliveryEndDate}`}
                        </span>
                    </p>
                    <p className={styles['container__body__package-info__row']}>
                        {props.distance && (
                            <>
                                <FaMapMarkerAlt size="22px" color="black" />
                                <span>
                                    {props.distance.toString().trim().length > 0
                                        ? `${props.distance} km`
                                        : t('app.unknown')}
                                </span>
                            </>
                        )}
                    </p>
                </section>
                <p
                    className={classNames(
                        styles['container__body__package-price'],
                        {
                            [styles['container__body__package-price--shrink']]:
                                props.shouldShrinkView,
                        },
                    )}
                >
                    &euro;{props.price}
                </p>
            </section>
        </div>
    );
}

export default PackageCard;
