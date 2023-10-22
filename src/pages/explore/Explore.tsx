import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PackageCard from 'components/package-card';
import LoadingOverlay from 'components/loading-overlay';
import {
    PackageLikeResponseInterface,
    SurfingPackage,
    SurfingPackageItem,
    SurfingResponseInterface,
} from 'models/packages';
import { RootState } from 'stores';
import { setToast, Toast } from 'stores/user';
import apiClient from 'utilities/api-client';
import { nationalities } from 'utilities/constants';
import { calculateDistance } from 'utilities/geometry';
import { useLocation } from 'utilities/hooks';

import styles from './explore.module.scss';

function Explore() {
    const [packages, setPackages] = React.useState<Array<SurfingPackage>>([]);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [isFavoriteChangeLoading, setFavoriteChangeLoading] =
        React.useState<boolean>(false);
    const { isLoggedIn, token } = useSelector((root: RootState) => root.user);

    const { location, error } = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    React.useEffect(() => {
        async function surfing() {
            try {
                const surfingResonse: SurfingResponseInterface =
                    await apiClient.packages.surfing(
                        {
                            ...(!error &&
                                location.latitude && {
                                customer_latitude: location.latitude,
                            }),
                            ...(!error &&
                                location.longitude && {
                                customer_longitude: location.longitude,
                            }),
                        },
                        { Authorization: `Bearer ${token}` },
                    );
                switch (surfingResonse.status) {
                    case 200:
                        setPackages(surfingResonse.data);
                        break;
                    case 400:
                        break;
                    case 422:
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
        surfing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

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
                    prev.map((surfingPackage: SurfingPackage) => {
                        return {
                            package_type_id: surfingPackage.package_type_id,
                            package_type_name: surfingPackage.package_type_name,
                            packages: surfingPackage.packages.map(
                                (surfingPackageItem: SurfingPackageItem) => {
                                    if (surfingPackageItem.id !== packageId)
                                        return surfingPackageItem;
                                    const isLike =
                                        surfingPackageItem.is_like === 0
                                            ? 1
                                            : 0;
                                    dispatch(
                                        setToast({
                                            toast: isLike
                                                ? Toast.LikePackageFromPackages
                                                : Toast.DislikePackageFromPackages,
                                        }),
                                    );
                                    return {
                                        ...surfingPackageItem,
                                        is_like: isLike,
                                    };
                                },
                            ),
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

    function findPackageById(packageId: number): SurfingPackageItem | null {
        let foundPackage = null;
        packages.forEach((surfingPackage: SurfingPackage) => {
            surfingPackage.packages.forEach(
                (surfingPackageItem: SurfingPackageItem) => {
                    if (surfingPackageItem.id === packageId)
                        foundPackage = surfingPackageItem;
                    return;
                },
            );
        });
        return foundPackage;
    }

    function handlePackageClick(packageId: number) {
        const surfingPackage = findPackageById(packageId);
        if (surfingPackage)
            navigate(`/packages/${packageId}`, { state: surfingPackage });
    }

    if (isLoading) return <LoadingOverlay />;

    return (
        <div className={styles.container}>
            {isFavoriteChangeLoading && <LoadingOverlay />}
            {packages.map((surfingPackage: SurfingPackage) => {
                if (surfingPackage.packages.length > 0) {
                    const packageTypeTransKey = nationalities.find(
                        (nationality) =>
                            nationality.index ===
                            surfingPackage.package_type_id,
                    )?.translationKey;
                    return (
                        <div
                            key={surfingPackage.package_type_id}
                            className={styles['container__row']}
                        >
                            <h2 className={styles['container__row__header']}>
                                {t(`nationalities.${packageTypeTransKey}`)}
                            </h2>
                            <div className={styles['container__row__body']}>
                                {surfingPackage.packages.map(
                                    (
                                        surfingPackageItem: SurfingPackageItem,
                                    ) => {
                                        let distance: string | undefined =
                                            undefined;
                                        if (
                                            !error &&
                                            location.latitude &&
                                            location.longitude
                                        ) {
                                            if (
                                                surfingPackageItem.lat &&
                                                surfingPackageItem.long
                                            ) {
                                                distance = calculateDistance(
                                                    location,
                                                    {
                                                        latitude: parseFloat(
                                                            surfingPackageItem.lat,
                                                        ),
                                                        longitude: parseFloat(
                                                            surfingPackageItem.long,
                                                        ),
                                                    },
                                                ).toFixed(2);
                                            }
                                        }
                                        const props = {
                                            isFavorite:
                                                surfingPackageItem.is_like,
                                            setFavorite: handleFavoriteChange,
                                            packageTitle:
                                                surfingPackageItem.PackageName,
                                            price: surfingPackageItem.main_price,
                                            topBadgeType:
                                                surfingPackageItem.status.toString(),
                                            chefLogoUrl:
                                                surfingPackageItem.logo,
                                            chefTitle:
                                                surfingPackageItem.restaurant_name,
                                            packageId: surfingPackageItem.id,
                                            deliveryStartDate:
                                                surfingPackageItem.start_time,
                                            deliveryEndDate:
                                                surfingPackageItem.end_time,
                                            distance,
                                            isLoggedIn,
                                            packageImageUrl:
                                                surfingPackageItem.food_img,
                                            handlePackageClick,
                                            shouldShrinkView: true,
                                        };
                                        return (
                                            <PackageCard
                                                key={surfingPackageItem.id}
                                                {...props}
                                            />
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
}

export default Explore;
