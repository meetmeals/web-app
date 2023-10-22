import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DesktopModal from 'components/modal';
import LoadingOverlay from 'components/loading-overlay';
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
import { setToast, Toast } from 'stores/user';
import apiClient from 'utilities/api-client';
import {
    DEFAULT_NATIONALITY,
    nationalities,
    ThemeColor,
} from 'utilities/constants';
import { calculateDistance } from 'utilities/geometry';
import { debounce } from 'utilities/helpers';
import { useLocation } from 'utilities/hooks';

import styles from './desktop-list.module.scss';

const FETCH_LIMIT_SIZE = 25;
const MIN_DELIVERY_RANGE = 0;
const MAX_DELIVERY_RANGE = 95;

function List() {
    const [packages, setPackages] = React.useState<Array<FilterPackage>>([]);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [isFavoriteChangeLoading, setFavoriteChangeLoading] =
        React.useState<boolean>(false);
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
    const [nationality, setNationality] =
        React.useState<string>(DEFAULT_NATIONALITY);
    const [customerPreference, setCustomerPreference] =
        React.useState<CustomerPreference>(CustomerPreference.Other);
    const { isLoggedIn, token } = useSelector((root: RootState) => root.user);
    const { location, error } = useLocation();

    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        async function filter() {
            setLoading(true);

            const selectedNationality = nationalities.find(
                (nationalityItem) =>
                    nationalityItem.translationKey === nationality,
            );
            const packageType = parseInt(selectedNationality?.index || '0');

            const filterResponse: FilterResponseInterface =
                await apiClient.packages.filter(
                    {
                        limit: FETCH_LIMIT_SIZE,
                        offset: currentPage * FETCH_LIMIT_SIZE,
                        text_input: searchText,
                        customer_preference: customerPreference,
                        start_time: formatDeliveryTime(deliveryTime.min),
                        end_time: formatDeliveryTime(deliveryTime.max),
                        package_type: packageType === 0 ? [] : [packageType],
                        ...(!error &&
                            location.latitude && {
                            customer_latitude: location.latitude,
                        }),
                        ...(!error &&
                            location.longitude && {
                            customer_longitude: location.longitude,
                        }),
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
        setFavoriteChangeLoading(true);
        const packageLikeResponse: PackageLikeResponseInterface =
            await apiClient.packages.packageLike(
                { package_id: packageId },
                { Authorization: `Bearer ${token}` },
            );
        setFavoriteChangeLoading(false);
        switch (packageLikeResponse.status) {
            case 200:
                setPackages((prev) =>
                    prev.map((filterPackage: FilterPackage) => {
                        if (filterPackage.id !== packageId)
                            return filterPackage;
                        const isLike = filterPackage.is_like === 0 ? 1 : 0;
                        dispatch(
                            setToast({
                                toast: isLike
                                    ? Toast.LikePackageFromPackages
                                    : Toast.DislikePackageFromPackages,
                            }),
                        );
                        return {
                            ...filterPackage,
                            is_like: isLike,
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
        setFilterSectionOpen(false);
        setDeliveryTime({ min: MIN_DELIVERY_RANGE, max: MAX_DELIVERY_RANGE });
        setNationality(DEFAULT_NATIONALITY);
        handleVegType(CustomerPreference.Other);
        setFilterTries((prev) => prev + 1);
        setPackages([]);
        setCurrentPage(0);
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
                topBadgeType: filterPackage.status.toString(),
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
            return (
                <div
                    className={styles['container__packages-container__package']}
                    key={filterPackage.id}
                >
                    <PackageCard {...props} />
                </div>
            );
        });
    }

    const deliveryStartTime = formatDeliveryTime(deliveryTime.min);
    const deliveryEndTime = formatDeliveryTime(deliveryTime.max);

    return (
        <div className={styles.container} onScroll={debounce(handleScroll)}>
            {isFavoriteChangeLoading && <LoadingOverlay />}
            <div
                className={classNames(styles['container__filter'], {
                    [styles['container__filter--open']]: isFilterSectionOpen,
                })}
            >
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
            <div className={styles['container__packages-container']}>
                {content}
            </div>
            {isFilterSectionOpen && (
                <DesktopModal
                    title={t('app.advancedSearch')}
                    handleClose={() => setFilterSectionOpen(false)}
                >
                    <div className={styles['container__modal']}>
                        <div
                            className={
                                styles['container__modal__delivery-time']
                            }
                        >
                            <p
                                className={
                                    styles[
                                        'container__modal__delivery-time__title'
                                    ]
                                }
                            >
                                {t('app.deliveryTime')}
                            </p>
                            <p
                                className={
                                    styles[
                                        'container__modal__delivery-time__range'
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
                            className={styles['container__modal__separator']}
                        />
                        <div
                            className={styles['container__modal__package-type']}
                        >
                            <p
                                className={
                                    styles[
                                        'container__modal__package-type__title'
                                    ]
                                }
                            >
                                {t('app.packageType')}
                            </p>
                            <NationalityPicker
                                selected={nationality}
                                setNationality={setNationality}
                                theme={ThemeColor.BLACK}
                            />
                        </div>
                        <div
                            className={styles['container__modal__separator']}
                        />
                        <div className={styles['container__modal__vegan']}>
                            <p
                                className={
                                    styles['container__modal__vegan__title']
                                }
                            >
                                {t('app.vegetarian')}
                            </p>
                            <section
                                className={
                                    styles['container__modal__vegan__section']
                                }
                            >
                                <button
                                    className={classNames(
                                        styles[
                                            'container__modal__vegan__section__btn'
                                        ],
                                        {
                                            [styles[
                                                'container__modal__vegan__section__btn--selected'
                                            ]]:
                                                customerPreference ===
                                                CustomerPreference.Vegetarian,
                                        },
                                    )}
                                    onClick={() =>
                                        handleVegType(
                                            CustomerPreference.Vegetarian,
                                        )
                                    }
                                >
                                    {t('app.imVegetarian')}
                                </button>
                                <button
                                    className={classNames(
                                        styles[
                                            'container__modal__vegan__section__btn'
                                        ],
                                        {
                                            [styles[
                                                'container__modal__vegan__section__btn--selected'
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
                                <button
                                    className={classNames(
                                        styles[
                                            'container__modal__vegan__section__btn'
                                        ],
                                        {
                                            [styles[
                                                'container__modal__vegan__section__btn--selected'
                                            ]]:
                                                customerPreference ===
                                                CustomerPreference.Other,
                                        },
                                    )}
                                    onClick={() =>
                                        handleVegType(CustomerPreference.Other)
                                    }
                                >
                                    {t('app.imNotVeg')}
                                </button>
                            </section>
                        </div>
                        <div className={styles['container__modal__footer']}>
                            <button
                                className={
                                    styles['container__modal__footer__btn']
                                }
                                onClick={handleCancel}
                            >
                                {t('app.reset')}
                            </button>
                            <button
                                className={
                                    styles['container__modal__footer__btn']
                                }
                                onClick={handleApply}
                            >
                                {t('app.apply')}
                            </button>
                        </div>
                    </div>
                </DesktopModal>
            )}
        </div>
    );
}

export default List;
