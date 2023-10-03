import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocation } from 'react-router-dom';

import ExpandableText from 'components/expandable-text/ExpandableText';

import styles from './package-details.module.scss';

function PackageDetails() {
    const { state } = useLocation();

    const { t } = useTranslation();

    const ASSETS_BASE_URL = process.env.REACT_APP_ASSETS_BASE_URL;

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
            <div className={styles['container__buy']}>{t('app.buy')}</div>
        </div>
    );
}

export default PackageDetails;
