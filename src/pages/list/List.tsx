import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import BottomSidebar from 'components/bottom-sidebar';
import MultiRangeSlider from 'components/multi-range-slider';
import NationalityPicker from 'components/nationality-picker';
import PackageCard from 'components/package-card';
import {
    FilterResponseInterface,
    PackageLikeResponseInterface,
    FilterPackage,
    CustomerPreference,
} from 'models/packages';
import { RootState } from 'stores';
import apiClient from 'utilities/api-client';
import { ThemeColor } from 'utilities/constants';
import { calculateDistance } from 'utilities/geometry';
import { debounce } from 'utilities/helpers';
import { useLocation } from 'utilities/hooks';

import styles from './list.module.scss';

const FETCH_LIMIT_SIZE = 25;
const MIN_DELIVERY_RANGE = 0;
const MAX_DELIVERY_RANGE = 95;

function List() {
    const [packages, setPackages] = React.useState<Array<FilterPackage>>([]);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [hasNextPage, setHasNextPage] = React.useState<boolean>(false);
    const [searchText, setSearchText] = React.useState<string>('');
    const [filterTries, setFilterTries] = React.useState<number>(0);
    const [isFilterSectionOpen, setFilterSectionOpen] =
        React.useState<boolean>(false);
    const [deliveryTime, setDeliveryTime] = React.useState<{
        min: number;
        max: number;
    }>({ min: MIN_DELIVERY_RANGE, max: MAX_DELIVERY_RANGE });
    const [customerPreference, setCustomerPreference] =
        React.useState<CustomerPreference>(CustomerPreference.Other);
    const { isLoggedIn, token } = useSelector((root: RootState) => root.user);
    const { location, error } = useLocation();

    const { t } = useTranslation();
    const navigate = useNavigate();

    React.useEffect(() => {
        async function filter() {
            setLoading(true);
            const filterResponse: FilterResponseInterface =
                await apiClient.packages.filter(
                    {
                        limit: FETCH_LIMIT_SIZE,
                        offset: currentPage * FETCH_LIMIT_SIZE,
                        text_input: searchText,
                        customer_preference: customerPreference,
                        start_time: formatDeliveryTime(deliveryTime.min),
                        end_time: formatDeliveryTime(deliveryTime.max),
                    },
                    {
                        Authorization: `Bearer ${token}`,
                    },
                );
            switch (filterResponse.status) {
                case 200:
                    setPackages((prevPackages) => [
                        ...prevPackages,
                        ...filterResponse.data,
                    ]);
                    setHasNextPage(filterResponse.has_next_page);
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
        filter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filterTries, token]);

    async function handleFavoriteChange(packageId: number) {
        const packageLikeResponse: PackageLikeResponseInterface =
            await apiClient.packages.packageLike(
                { package_id: packageId },
                { Authorization: `Bearer ${token}` },
            );
        switch (packageLikeResponse.status) {
            case 200:
                setPackages((prev) =>
                    prev.map((filterPackage: FilterPackage) => {
                        if (filterPackage.id !== packageId)
                            return filterPackage;
                        return {
                            ...filterPackage,
                            is_like: filterPackage.is_like === 0 ? 1 : 0,
                        };
                    }),
                );
                break;
            case 400:
                break;
            case 422:
                break;
            default:
                break;
        }
    }

    function formatDeliveryTime(deliveryTimeInput: number) {
        const deliveryTimeInMinutes = deliveryTimeInput * 15;
        const deliveryTimeHours = Math.floor(deliveryTimeInMinutes / 60);
        const deliveryTimeMinutes = deliveryTimeInMinutes % 60;
        return `${deliveryTimeHours}:${deliveryTimeMinutes
            .toString()
            .padStart(2, '0')}`;
    }

    function handleVegType(type: CustomerPreference) {
        setCustomerPreference(type);
    }

    function handleCancel() {
        // Reset search params
        setDeliveryTime({ min: MIN_DELIVERY_RANGE, max: MAX_DELIVERY_RANGE });
        handleVegType(CustomerPreference.Other);
        setFilterSectionOpen(false);
    }

    function handleApply() {
        setFilterSectionOpen(false);
        setFilterTries((prev) => prev + 1);
        setPackages([]);
        setCurrentPage(0);
    }

    function handlePackageClick(packageId: number) {
        const filterPackage = packages.find(
            (filterPackage) => filterPackage.id === packageId,
        );
        navigate(`/packages/${packageId}`, { state: filterPackage });
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

    function handleTextInputBlur() {
        setPackages([]);
        setCurrentPage(0);
        setFilterTries((prev) => prev + 1);
    }

    let content = null;
    // if (isLoading) {
    //     content = (
    //         <p className={styles['container__loading']}>
    //             {t('app.loading')} <span></span>
    //         </p>
    //     );
    // }
    if (packages.length === 0 && !isLoading) {
        content = (
            <p className={styles['container__loading']}>
                {t('packages.notFound')}
            </p>
        );
    } else {
        content = packages.map((filterPackage: FilterPackage) => {
            let distance: string | undefined = undefined;
            if (!error && location.latitude && location.longitude) {
                if (filterPackage.lat && filterPackage.long) {
                    distance = calculateDistance(location, {
                        latitude: parseFloat(filterPackage.lat),
                        longitude: parseFloat(filterPackage.long),
                    }).toFixed(2);
                }
            }
            const props = {
                isFavorite: filterPackage.is_like,
                setFavorite: handleFavoriteChange,
                packageTitle: filterPackage.PackageName,
                price: filterPackage.main_price,
                topBadgeType: '',
                topBadgeText: '',
                chefLogoUrl: filterPackage.logo,
                chefTitle: filterPackage.restaurant_name,
                packageId: filterPackage.id,
                deliveryStartDate: filterPackage.start_time,
                deliveryEndDate: filterPackage.end_time,
                distance,
                isLoggedIn,
                packageImageUrl: filterPackage.food_img,
                handlePackageClick,
            };
            return <PackageCard key={filterPackage.id} {...props} />;
        });
    }

    const deliveryStartTime = formatDeliveryTime(deliveryTime.min);
    const deliveryEndTime = formatDeliveryTime(deliveryTime.max);

    return (
        <div className={styles.container} onScroll={debounce(handleScroll)}>
            <div className={styles['container__filter']}>
                <div className={styles['container__filter__search']}>
                    <input
                        type="text"
                        className={styles['container__filter__search__input']}
                        name="searchText"
                        placeholder={t('app.search')}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleTextInputBlur();
                        }}
                    />
                    <FaSearch
                        size="24px"
                        color="#015248"
                        className={styles['container__filter__search__icon']}
                    />
                </div>
                <span>
                    <FaFilter
                        size="22px"
                        color="#eee"
                        className={styles['container__filter__filter-icon']}
                        onClick={() => setFilterSectionOpen((prev) => !prev)}
                    />
                </span>
            </div>
            {content}
            <BottomSidebar
                isOpen={isFilterSectionOpen}
                setOpen={setFilterSectionOpen}
                height={600}
            >
                <div className={styles['container__bottom-sidebar']}>
                    <p className={styles['container__bottom-sidebar__header']}>
                        {t('app.advancedSearch')}
                    </p>
                    <div
                        className={
                            styles['container__bottom-sidebar__delivery-time']
                        }
                    >
                        <p
                            className={
                                styles[
                                    'container__bottom-sidebar__delivery-time__title'
                                ]
                            }
                        >
                            {t('app.deliveryTime')}
                        </p>
                        <p
                            className={
                                styles[
                                    'container__bottom-sidebar__delivery-time__range'
                                ]
                            }
                        >
                            {deliveryStartTime} - {deliveryEndTime}
                        </p>
                        {isFilterSectionOpen && (
                            <MultiRangeSlider
                                min={MIN_DELIVERY_RANGE}
                                initialMin={deliveryTime.min}
                                max={MAX_DELIVERY_RANGE}
                                initialMax={deliveryTime.max}
                                onChange={setDeliveryTime}
                            />
                        )}
                    </div>
                    <div
                        className={
                            styles['container__bottom-sidebar__separator']
                        }
                    />
                    <div
                        className={
                            styles['container__bottom-sidebar__package-type']
                        }
                    >
                        <p
                            className={
                                styles[
                                    'container__bottom-sidebar__package-type__title'
                                ]
                            }
                        >
                            {t('app.packageType')}
                        </p>
                        <NationalityPicker theme={ThemeColor.WHITE} />
                    </div>
                    <div
                        className={
                            styles['container__bottom-sidebar__separator']
                        }
                    />
                    <div className={styles['container__bottom-sidebar__vegan']}>
                        <p
                            className={
                                styles[
                                    'container__bottom-sidebar__vegan__title'
                                ]
                            }
                        >
                            {t('app.vegetarian')}
                        </p>
                        <section
                            className={
                                styles[
                                    'container__bottom-sidebar__vegan__section'
                                ]
                            }
                        >
                            <button
                                className={classNames(
                                    styles[
                                        'container__bottom-sidebar__vegan__section__btn'
                                    ],
                                    {
                                        [styles[
                                            'container__bottom-sidebar__vegan__section__btn--selected'
                                        ]]:
                                            customerPreference ===
                                            CustomerPreference.Vegetarian,
                                    },
                                )}
                                onClick={() =>
                                    handleVegType(CustomerPreference.Vegetarian)
                                }
                            >
                                {t('app.imVegetarian')}
                            </button>
                            <button
                                className={classNames(
                                    styles[
                                        'container__bottom-sidebar__vegan__section__btn'
                                    ],
                                    {
                                        [styles[
                                            'container__bottom-sidebar__vegan__section__btn--selected'
                                        ]]:
                                            customerPreference ===
                                            CustomerPreference.Vegan,
                                    },
                                )}
                                onClick={() =>
                                    handleVegType(CustomerPreference.Vegan)
                                }
                            >
                                {t('app.imVegan')}
                            </button>
                        </section>
                    </div>
                    <div
                        className={styles['container__bottom-sidebar__footer']}
                    >
                        <button
                            className={
                                styles['container__bottom-sidebar__footer__btn']
                            }
                            onClick={handleCancel}
                        >
                            {t('app.reset')}
                        </button>
                        <button
                            className={
                                styles['container__bottom-sidebar__footer__btn']
                            }
                            onClick={handleApply}
                        >
                            {t('app.apply')}
                        </button>
                    </div>
                </div>
            </BottomSidebar>
        </div>
    );
}

export default List;
