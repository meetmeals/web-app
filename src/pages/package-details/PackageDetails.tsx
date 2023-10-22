import { Appearance, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaClock, FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import BottomSidebar from 'components/bottom-sidebar';
import CheckoutForm from 'components/checkout-form';
import ExpandableText from 'components/expandable-text';
import LoadingOverlay from 'components/loading-overlay';
import LoadingSpinner from 'components/loading-spinner';
import StarRating from 'components/star-rating';
import { AuthStep } from 'models/common';
import {
    InfoPackage,
    PackageInfoSatisfaction,
    PackageLikeResponseInterface,
} from 'models/packages';
import { OrderSubmitResponseInterface } from 'models/orders';
import { RootState } from 'stores';
import { Device } from 'stores/platform';
import { setAuthenticating, setToast, Toast } from 'stores/user';
import apiClient from 'utilities/api-client';
import { PackageViewStatus, stripePromise } from 'utilities/constants';
import { getMapsLink, Map } from 'utilities/geometry';

import styles from './package-details.module.scss';

enum PurchaseStep {
    Details,
    Checkout,
}

function PackageDetails() {
    const { packageId } = useParams();
    const [packageInfo, setPackageInfo] = React.useState<InfoPackage>();
    const [satisfaction, setSatisfaction] =
        React.useState<PackageInfoSatisfaction>();
    const { isLoggedIn, token } = useSelector((root: RootState) => root.user);
    const { language, device } = useSelector(
        (root: RootState) => root.platform,
    );
    const { state } = useLocation();
    const [isPackageInfoLoading, setPackageInfoLoading] =
        React.useState<boolean>(state === null);
    const [stripeClientSecret, setStripeClientSecret] =
        React.useState<string>('');
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [purchaseStep, setPurchaseStep] = React.useState<PurchaseStep>(
        PurchaseStep.Details,
    );
    const [shouldShowRouting, setShowRouting] = React.useState<boolean>(false);
    const [shouldShowPurchase, setShowPurchase] =
        React.useState<boolean>(false);
    const [packageCount, setPackageCount] = React.useState<number>(1);
    const [isFavoriteChangeLoading, setFavoriteChangeLoading] =
        React.useState<boolean>(false);

    const { t } = useTranslation();
    const dispatch = useDispatch();

    React.useEffect(() => {
        async function fetchPackageInfo() {
            if (packageId === undefined) return;
            try {
                const packageInfoResponse =
                    await apiClient.packages.packageInfo(packageId, {
                        ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
                    });
                switch (packageInfoResponse.status) {
                    case 200:
                        setPackageInfo(packageInfoResponse.data);
                        setSatisfaction(packageInfoResponse.satisfaction);
                        break;
                }
            } catch (e) {
                console.warn(e);
            } finally {
                setPackageInfoLoading(false);
            }
        }
        fetchPackageInfo();
    }, [isLoggedIn, packageId, token]);

    async function handleFavoriteClick(packageId: number) {
        setFavoriteChangeLoading(true);
        const packageLikeResponse: PackageLikeResponseInterface =
            await apiClient.packages.packageLike(
                { package_id: packageId },
                { Authorization: `Bearer ${token}` },
            );
        setFavoriteChangeLoading(false);
        switch (packageLikeResponse.status) {
            case 200:
                setPackageInfo((prev) => {
                    if (!prev) return undefined;
                    const isLike = prev?.is_like === 0 ? 1 : 0;
                    dispatch(
                        setToast({
                            toast: isLike
                                ? Toast.LikePackageFromPackages
                                : Toast.DislikePackageFromPackages,
                        }),
                    );
                    return {
                        ...prev,
                        is_like: isLike,
                    };
                });
                break;
            case 400:
                break;
            case 422:
                break;
            default:
                break;
        }
    }

    function handleBuy() {
        if (isPackageDisabled) return;
        setPurchaseStep(PurchaseStep.Details);
        setShowPurchase(true);
    }

    function handlePackageCountChange(operation: string) {
        setPackageCount((prev) =>
            operation === '-'
                ? prev - 1
                : prev === info.remaining
                    ? prev
                    : prev + 1,
        );
    }

    function handleCancelOrder() {
        setPackageCount(1);
        setPurchaseStep(PurchaseStep.Details);
        setShowPurchase(false);
    }

    async function handleNext() {
        if (isLoading) return;

        if (isLoggedIn) {
            setLoading(true);
            const orderSubmitResponse: OrderSubmitResponseInterface =
                await apiClient.orders.orderSubmit(
                    {
                        package_id: packageInfo?.id ?? state.id,
                        package_count: packageCount,
                        // [TODO]: Use correct user agent
                        user_os: 'mac',
                    },
                    {
                        Authorization: `Bearer ${token}`,
                    },
                );
            switch (orderSubmitResponse.status) {
                case 200:
                    setStripeClientSecret(
                        orderSubmitResponse.data.payment.client_secret,
                    );
                    setLoading(false);
                    setPurchaseStep(PurchaseStep.Checkout);
                    break;
                case 400:
                    break;
                case 422:
                    break;
                default:
                    break;
            }
        } else {
            dispatch(
                setAuthenticating({
                    authStep: AuthStep.LOGIN,
                }),
            );
        }
    }

    function handleCancelCheckout() {
        setPurchaseStep(PurchaseStep.Details);
    }

    if (isPackageInfoLoading) return <LoadingOverlay />;

    const ASSETS_BASE_URL = process.env.REACT_APP_ASSETS_BASE_URL;
    let options: StripeElementsOptions = {};
    let appearance: Appearance = {};
    if (stripeClientSecret) {
        appearance = {
            theme: 'stripe',
            variables: {
                colorPrimary: '#015248',
                colorText: '#eee',
            },
            rules: {
                '.Input': {
                    color: '#222',
                },
                '.RedirectText': {
                    padding: '1rem',
                },
            },
        };
        options = {
            clientSecret: stripeClientSecret,
            appearance,
            locale: language === 'en' ? 'en' : 'nl',
        };
    }

    const info = {
        foodImg: packageInfo?.food_img ?? state?.food_img,
        packageName: packageInfo?.PackageName ?? state?.PackageName,
        mainPrice: packageInfo?.main_price ?? state?.main_price,
        restaurantName: packageInfo?.restaurant_name ?? state?.restaurant_name,
        logo: packageInfo?.logo ?? state?.logo,
        lat: packageInfo?.lat ?? state?.lat,
        long: packageInfo?.long ?? state?.long,
        restaurantAddress:
            packageInfo?.restaurant_address ?? state?.restaurantAddress,
        startTime: packageInfo?.start_time ?? state?.start_time,
        endTime: packageInfo?.end_time ?? state?.end_time,
        desc: packageInfo?.desc ?? state?.desc,
        isLike: packageInfo?.is_like,
        status: packageInfo?.status ?? (state?.status as number),
        packageId: packageInfo?.id ?? state?.id,
        remaining:
            packageInfo?.remindPackage ?? (state?.remindPackage as number),
    };

    const routingMedia = [
        {
            name: 'Google Maps',
            link: getMapsLink(
                device,
                {
                    latitude: info.lat as string,
                    longitude: info.long as string,
                },
                Map.GoogleMaps,
            ),
            icon: '/img/icons/common/google-maps.png',
        },
        {
            name: 'Waze',
            link: getMapsLink(
                device,
                {
                    latitude: info.lat as string,
                    longitude: info.long as string,
                },
                Map.Waze,
            ),
            icon: '/img/icons/common/waze-white.png',
        },
    ];

    const isPackageDisabled = [1, 2, 6].includes(info.status);

    return (
        <div className={styles.container}>
            {isFavoriteChangeLoading && <LoadingOverlay />}
            <div
                className={styles['container__header']}
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, .1) 0, rgba(0, 0, 0, .6) 100%), url(${ASSETS_BASE_URL}/${info.foodImg})`,
                    ...(isPackageDisabled && { opacity: 0.4 }),
                }}
            >
                <div className={styles['container__header__top']}>
                    {isLoggedIn && (
                        <FaHeart
                            className={
                                styles['container__header__top__favorite']
                            }
                            size="24px"
                            color={info.isLike ? '#ff7072' : 'transparent'}
                            onClick={() =>
                                handleFavoriteClick(info.packageId as number)
                            }
                            {...(!info.isLike && {
                                style: { stroke: '#eee', strokeWidth: '35px' },
                            })}
                        />
                    )}
                    {info.status >= 0 && (
                        <span
                            className={styles['container__header__top__status']}
                            style={{
                                backgroundColor:
                                    PackageViewStatus[info.status.toString()]
                                        .color,
                            }}
                        >
                            {t(
                                PackageViewStatus[info.status.toString()]
                                    .transKey,
                            )}
                        </span>
                    )}
                </div>
                <div className={styles['container__header__bottom']}>
                    <section
                        className={
                            styles['container__header__bottom__chef-name']
                        }
                    >
                        {info.restaurantName}
                    </section>
                    <section
                        className={
                            styles['container__header__bottom__chef-logo']
                        }
                    >
                        <img
                            className={
                                styles[
                                    'container__header__bottom__chef-logo__img'
                                ]
                            }
                            src={
                                info.logo
                                    ? `${ASSETS_BASE_URL}/${info.logo}`
                                    : '/img/icons/common/chef-img-placeholder.png'
                            }
                            alt="Chef logo"
                        />
                    </section>
                </div>
            </div>
            <div className={styles['container__body']}>
                <div className={styles['container__body__package-info']}>
                    <div
                        className={styles['container__body__package-info__top']}
                    >
                        <span
                            className={
                                styles[
                                    'container__body__package-info__top__name'
                                ]
                            }
                        >
                            {info.packageName}
                        </span>
                        <span
                            className={
                                styles[
                                    'container__body__package-info__top__price'
                                ]
                            }
                        >
                            &euro; {info.mainPrice}
                        </span>
                    </div>
                    <div
                        className={
                            styles['container__body__package-info__bottom']
                        }
                    >
                        <FaClock size="20px" />
                        <span>
                            {isPackageDisabled
                                ? t('app.nothingForTomorrow')
                                : `${t('app.tomorrow')} ${t('app.from')} ${
                                    info.startTime
                                } ${t('app.to')} ${info.endTime}`}
                        </span>
                    </div>
                </div>
                <div className={styles['container__body__package-desc']}>
                    <p
                        className={
                            styles['container__body__package-desc__title']
                        }
                    >
                        {t('app.packageDetails')}
                    </p>
                    <ExpandableText descriptionLength={120} text={info.desc} />
                </div>
                <div className={styles['container__body__comments']}>
                    <h2>{t('packageInfo.whatOthersSay')}</h2>
                    <section
                        className={styles['container__body__comments__box']}
                    >
                        <div>
                            <p>{t('packageInfo.generalRating')}</p>
                            <StarRating rating={4} setRating={() => {}} />
                        </div>
                        <div>
                            <p>{t('packageInfo.foodQuality')}</p>
                            <StarRating rating={4} setRating={() => {}} />
                        </div>
                    </section>
                    <section
                        className={styles['container__body__comments__box']}
                    >
                        <div>
                            <p>{t('packageInfo.foodVolume')}</p>
                            <StarRating rating={4} setRating={() => {}} />
                        </div>
                        <div>
                            <p>{t('packageInfo.sellerEncounter')}</p>
                            <StarRating rating={4} setRating={() => {}} />
                        </div>
                    </section>
                    <section
                        className={styles['container__body__comments__count']}
                    >
                        {t('packageInfo.outOf', {
                            count: satisfaction?.total_opinion_count,
                            s:
                                /* eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain */
                                satisfaction?.total_opinion_count! > 0
                                    ? 's'
                                    : '',
                        })}
                    </section>
                </div>
                <div className={styles['container__body__location']}>
                    <MapContainer
                        center={[
                            parseFloat(info.lat as string),
                            parseFloat(info.long as string),
                        ]}
                        zoom={15}
                        scrollWheelZoom={false}
                        style={{
                            width: '95%',
                            height: '15rem',
                            marginLeft: '.8rem',
                        }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                            position={[
                                parseFloat(info.lat as string),
                                parseFloat(info.long as string),
                            ]}
                        >
                            <Popup>
                                {info.restaurantName}
                                <br />
                                <span
                                    className={
                                        styles[
                                            'container__body__location__map-address'
                                        ]
                                    }
                                    dangerouslySetInnerHTML={{
                                        __html: info.restaurantAddress,
                                    }}
                                />
                            </Popup>
                        </Marker>
                    </MapContainer>
                    <p
                        className={styles['container__body__location__address']}
                        dangerouslySetInnerHTML={{
                            __html: info.restaurantAddress,
                        }}
                    />
                    <button
                        className={styles['container__body__location__routing']}
                        onClick={() => setShowRouting((prev) => !prev)}
                    >
                        {t('app.routing')}
                    </button>
                    {shouldShowRouting && (
                        <BottomSidebar
                            isOpen={shouldShowRouting}
                            setOpen={setShowRouting}
                            height={600}
                        >
                            <div
                                className={
                                    styles['container__body__location__sidebar']
                                }
                            >
                                <p
                                    className={
                                        styles[
                                            'container__body__location__sidebar__header'
                                        ]
                                    }
                                >
                                    {t('app.selectRouting')}
                                </p>
                                <section
                                    className={
                                        styles[
                                            'container__body__location__sidebar__medium'
                                        ]
                                    }
                                >
                                    {routingMedia.map((medium) => (
                                        <p
                                            key={medium.name}
                                            className={
                                                styles[
                                                    'container__body__location__sidebar__medium__link'
                                                ]
                                            }
                                            onClick={() =>
                                                setShowRouting((prev) => !prev)
                                            }
                                        >
                                            <img
                                                alt="Routing medium icon"
                                                className={
                                                    styles[
                                                        'container__body__location__sidebar__medium__link__img'
                                                    ]
                                                }
                                                src={medium.icon}
                                            />
                                            <a
                                                className={
                                                    styles[
                                                        'container__body__location__sidebar__medium__link__text'
                                                    ]
                                                }
                                                href={medium.link}
                                                {...(device === Device.PC && {
                                                    target: '_blank',
                                                    rel: 'noopener noreferrer',
                                                })}
                                            >
                                                {medium.name}
                                            </a>
                                        </p>
                                    ))}
                                </section>
                            </div>
                        </BottomSidebar>
                    )}
                </div>
            </div>
            <div
                className={classNames(styles['container__buy'], {
                    [styles['container__buy--disabled']]: isPackageDisabled,
                })}
                onClick={handleBuy}
            >
                {t('app.buy')}
            </div>
            {shouldShowPurchase && (
                <BottomSidebar
                    isOpen={shouldShowPurchase}
                    setOpen={setShowPurchase}
                    height={600}
                >
                    <div className={styles['container__bottom-sidebar']}>
                        <p
                            className={
                                styles['container__bottom-sidebar__header']
                            }
                        >
                            {purchaseStep === PurchaseStep.Details
                                ? t('app.quantity')
                                : t('app.checkout')}
                        </p>
                        {purchaseStep === PurchaseStep.Details ? (
                            <div
                                className={
                                    styles[
                                        'container__bottom-sidebar__quantity'
                                    ]
                                }
                            >
                                <div
                                    className={
                                        styles[
                                            'container__bottom-sidebar__quantity__details'
                                        ]
                                    }
                                >
                                    <p
                                        className={
                                            styles[
                                                'container__bottom-sidebar__quantity__details__package-name'
                                            ]
                                        }
                                    >
                                        {info.packageName}
                                    </p>
                                    <p
                                        className={
                                            styles[
                                                'container__bottom-sidebar__quantity__details__time'
                                            ]
                                        }
                                    >
                                        <FaClock size="20px" />
                                        <span>
                                            {t('app.tomorrow')} {info.startTime}{' '}
                                            - {info.endTime}
                                        </span>
                                    </p>
                                </div>
                                <div
                                    className={
                                        styles[
                                            'container__bottom-sidebar__quantity__separator'
                                        ]
                                    }
                                />
                                <div
                                    className={
                                        styles[
                                            'container__bottom-sidebar__quantity__select'
                                        ]
                                    }
                                >
                                    <div
                                        className={
                                            styles[
                                                'container__bottom-sidebar__quantity__select__area'
                                            ]
                                        }
                                    >
                                        <section
                                            className={classNames(
                                                styles[
                                                    'container__bottom-sidebar__quantity__select__area__btn'
                                                ],
                                                {
                                                    [styles[
                                                        'container__bottom-sidebar__quantity__select__area__btn--disabled'
                                                    ]]: packageCount === 1,
                                                },
                                            )}
                                            onClick={() =>
                                                handlePackageCountChange('-')
                                            }
                                        >
                                            <FaMinus />
                                        </section>
                                        <span
                                            className={
                                                styles[
                                                    'container__bottom-sidebar__quantity__select__area__count'
                                                ]
                                            }
                                        >
                                            {packageCount}
                                        </span>
                                        <section
                                            className={
                                                styles[
                                                    'container__bottom-sidebar__quantity__select__area__btn'
                                                ]
                                            }
                                            onClick={() =>
                                                handlePackageCountChange('+')
                                            }
                                        >
                                            <FaPlus />
                                        </section>
                                    </div>
                                    <p
                                        className={
                                            styles[
                                                'container__bottom-sidebar__quantity__select__total'
                                            ]
                                        }
                                    >
                                        {t('app.totalPrice')}:{' '}
                                        {packageCount * info.mainPrice}
                                    </p>
                                </div>
                                <div
                                    className={
                                        styles[
                                            'container__bottom-sidebar__quantity__next'
                                        ]
                                    }
                                >
                                    <button
                                        className={
                                            styles[
                                                'container__bottom-sidebar__quantity__next__cancel'
                                            ]
                                        }
                                        onClick={handleCancelOrder}
                                    >
                                        {t('app.cancel')}
                                    </button>
                                    <button
                                        className={
                                            styles[
                                                'container__bottom-sidebar__quantity__next__ok'
                                            ]
                                        }
                                        onClick={handleNext}
                                    >
                                        {isLoading ? (
                                            <p>
                                                <span>
                                                    {t('app.processing')}
                                                </span>
                                                <LoadingSpinner />
                                            </p>
                                        ) : (
                                            t('app.finalizeOrder')
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm
                                    clientSecret={stripeClientSecret}
                                    handleBackClick={handleCancelCheckout}
                                />
                            </Elements>
                        )}
                    </div>
                </BottomSidebar>
            )}
        </div>
    );
}

export default PackageDetails;
