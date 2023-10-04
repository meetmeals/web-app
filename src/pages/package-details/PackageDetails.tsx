import { Appearance, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaClock, FaMinus, FaPlus } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import BottomSidebar from 'components/bottom-sidebar';
import CheckoutForm from 'components/checkout-form';
import ExpandableText from 'components/expandable-text';
import LoadingSpinner from 'components/loading-spinner';
import { AuthStep } from 'models/common';
import { OrderSubmitResponseInterface } from 'models/orders';
import { RootState } from 'stores';
import { setAuthenticating } from 'stores/user';
import apiClient from 'utilities/api-client';
import { stripePromise } from 'utilities/constants';

import styles from './package-details.module.scss';

enum PurchaseStep {
    Details,
    Checkout,
}

function PackageDetails() {
    const { isLoggedIn, token } = useSelector((root: RootState) => root.user);
    const { state } = useLocation();
    const [stripeClientSecret, setStripeClientSecret] =
        React.useState<string>('');
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [purchaseStep, setPurchaseStep] = React.useState<PurchaseStep>(
        PurchaseStep.Details,
    );
    const [shouldShowPurchase, setShowPurchase] =
        React.useState<boolean>(false);
    const [packageCount, setPackageCount] = React.useState<number>(1);

    const { t } = useTranslation();
    const dispatch = useDispatch();

    function handleBuy() {
        setPurchaseStep(PurchaseStep.Details);
        setShowPurchase(true);
    }

    function handlePackageCountChange(operation: string) {
        setPackageCount((prev) => (operation === '-' ? prev - 1 : prev + 1));
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
                        package_id: state.id,
                        package_count: packageCount,
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
        };
    }

    return (
        <div className={styles.container}>
            <div
                className={styles['container__header']}
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, .1) 0, rgba(0, 0, 0, .6) 100%), url(${ASSETS_BASE_URL}/${state.food_img})`,
                }}
            >
                <div className={styles['container__header__top']}>
                    <span>{state.PackageName}</span>
                    <span>{state.main_price}</span>
                </div>
                <div className={styles['container__header__bottom']}>
                    <section
                        className={
                            styles['container__header__bottom__chef-name']
                        }
                    >
                        {state.restaurant_name}
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
                                state.logo
                                    ? `${ASSETS_BASE_URL}/${state.logo}`
                                    : '/img/icons/common/chef-img-placeholder.png'
                            }
                            alt="Chef logo"
                        />
                    </section>
                </div>
            </div>
            <div className={styles['container__body']}>
                <div className={styles['container__body__package-info']}>
                    <span
                        className={
                            styles['container__body__package-info__name']
                        }
                    >
                        {state.PackageName}
                    </span>
                    <span
                        className={
                            styles['container__body__package-info__price']
                        }
                    >
                        &euro; {state.main_price}
                    </span>
                </div>
                <div className={styles['container__body__package-desc']}>
                    <p
                        className={
                            styles['container__body__package-desc__title']
                        }
                    >
                        {t('app.packageDetails')}
                    </p>
                    <ExpandableText
                        descriptionLength={120}
                        text={`<p>Aliquam maximus, purus vel tempus luctus, libero ipsum consectetur
purus, eu efficitur mi nunc sed purus. Etiam tristique sit amet
nisi vel rhoncus. Vestibulum porta, metus sit amet tincidunt
malesuada, dui sapien egestas magna, quis viverra turpis sapien a
dolor. Fusce ultrices eros eget tincidunt viverra. Ut a dapibus
erat, vel cursus odio. Phasellus erat enim, volutpat vel lacus eu,
aliquam sodales turpis. Fusce ipsum ex, vehicula tempor accumsan</p>
nec, gravida at eros. In aliquam, metus id mollis interdum, nunc
sem dignissim quam, non iaculis tortor erat nec eros. <p>Nunc
sollicitudin ac dolor eget lobortis. Aenean suscipit rutrum </p>dolor
in euismod. Curabitur quis dapibus lectus. Mauris enim leo,
condimentum ac elit sit amet, iaculis vulputate sem.
`}
                    />
                </div>
                <div className={styles['container__body__comments']}></div>
                <div className={styles['container__body__location']}>
                    <MapContainer
                        center={[
                            parseFloat(state.lat as string),
                            parseFloat(state.long as string),
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
                                parseFloat(state.lat as string),
                                parseFloat(state.long as string),
                            ]}
                        >
                            <Popup>
                                {state.restaurant_name}
                                <br />
                                <span
                                    className={
                                        styles[
                                            'container__body__location__map-address'
                                        ]
                                    }
                                    dangerouslySetInnerHTML={{
                                        __html: state.restaurant_address,
                                    }}
                                />
                            </Popup>
                        </Marker>
                    </MapContainer>
                    <p
                        className={styles['container__body__location__address']}
                        dangerouslySetInnerHTML={{
                            __html: state.restaurant_address,
                        }}
                    />
                    <a
                        className={styles['container__body__location__routing']}
                        href={`geo:${state.lat},${state.long}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('app.routing')}
                    </a>
                </div>
            </div>
            <div className={styles['container__buy']} onClick={handleBuy}>
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
                                        {state.PackageName}
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
                                            {t('app.tomorrow')}{' '}
                                            {state.start_time} -{' '}
                                            {state.end_time}
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
                                        {packageCount * state.main_price}
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
