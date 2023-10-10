import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import LoadingOverlay from 'components/loading-overlay';
import PackageCard from 'components/package-card';
import {
    FavoritePackage,
    FavoritesResponseInterface,
    PackageLikeResponseInterface,
} from 'models/packages';
import { RootState } from 'stores';
import { setToast, Toast } from 'stores/user';
import apiClient from 'utilities/api-client';
import { calculateDistance } from 'utilities/geometry';
import { useLocation } from 'utilities/hooks';

import styles from './favorites.module.scss';

function Favorites() {
    const [packages, setPackages] = React.useState<Array<FavoritePackage>>([]);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [isFavoriteChangeLoading, setFavoriteChangeLoading] =
        React.useState<boolean>(false);
    const { isLoggedIn, token } = useSelector((root: RootState) => root.user);
    const { location, error } = useLocation();

    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        async function fetchFavorites() {
            setLoading(true);
            const favoritesResponse: FavoritesResponseInterface =
                await apiClient.packages.favorites(
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
                    {
                        Authorization: `Bearer ${token}`,
                    },
                );
            switch (favoritesResponse.status) {
                case 200:
                    setPackages((prevPackages) => [
                        ...prevPackages,
                        ...favoritesResponse.data,
                    ]);
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
        fetchFavorites();
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
                    prev.filter(
                        (favoritePackage: FavoritePackage) =>
                            favoritePackage.package_id !== packageId,
                    ),
                );
                dispatch(
                    setToast({ toast: Toast.DislikePackageFromFavorites }),
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

    function handlePackageClick(packageId: number) {
        const selectedPackage = packages.find(
            (favoritePackage) => favoritePackage.package_id === packageId,
        );
        navigate(`/packages/${packageId}`, { state: selectedPackage });
    }

    let content = null;
    if (packages.length === 0 && !isLoading) {
        content = (
            <p className={styles['container__loading']}>
                {t('packages.notFound')}
            </p>
        );
    } else {
        content = packages.map((favoritePackage: FavoritePackage) => {
            let distance: string | undefined = undefined;
            if (!error && location.latitude && location.longitude) {
                if (favoritePackage.lat && favoritePackage.long) {
                    distance = calculateDistance(location, {
                        latitude: parseFloat(favoritePackage.lat),
                        longitude: parseFloat(favoritePackage.long),
                    }).toFixed(2);
                }
            }
            const props = {
                isFavorite: favoritePackage.is_like,
                setFavorite: handleFavoriteChange,
                packageTitle: favoritePackage.PackageName,
                price: favoritePackage.main_price,
                topBadgeType: '',
                topBadgeText: '',
                chefLogoUrl: favoritePackage.logo,
                chefTitle: favoritePackage.restaurant_name,
                packageId: favoritePackage.package_id,
                deliveryStartDate: favoritePackage.start_time,
                deliveryEndDate: favoritePackage.end_time,
                distance,
                isLoggedIn,
                packageImageUrl: favoritePackage.food_img,
                handlePackageClick,
            };
            return <PackageCard key={favoritePackage.id} {...props} />;
        });
    }
    return (
        <div className={styles.container}>
            {isFavoriteChangeLoading && <LoadingOverlay />}
            {content}
        </div>
    );
}

export default Favorites;
