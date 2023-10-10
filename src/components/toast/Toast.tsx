import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegWindowClose } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from 'stores';
import { setToast, Toast as ToastType } from 'stores/user';
import { useClickOutside } from 'utilities/hooks';

import styles from './toast.module.scss';

const TOAST_DELAY_MS = 5000;

function Toast() {
    const { toast } = useSelector((root: RootState) => root.user);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleClose = React.useCallback(
        function () {
            dispatch(setToast({ toast: ToastType.None }));
        },
        [dispatch],
    );

    React.useEffect(() => {
        if (toast === ToastType.None) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            handleClose();
        }, TOAST_DELAY_MS);
    }, [toast, handleClose]);

    useClickOutside(wrapperRef, () => {
        handleClose();
    });

    if (toast === ToastType.None) return null;

    let content: JSX.Element;
    switch (toast) {
        case ToastType.Login:
            content = <p>{t('toast.login')}</p>;
            break;
        case ToastType.Logout:
            content = <p>{t('toast.logout')}</p>;
            break;
        case ToastType.LikePackageFromPackages:
            content = (
                <p>
                    {t('toast.likedFromPackages')}{' '}
                    <Link to="/account?tab=favorites">
                        {t('app.favorites')}
                    </Link>
                </p>
            );
            break;
        case ToastType.DislikePackageFromPackages:
            content = (
                <p>
                    {t('toast.dislikedFromPackages')}{' '}
                    <Link to="/account?tab=favorites">
                        {t('app.favorites')}
                    </Link>
                </p>
            );
            break;
        case ToastType.LikePackageFromFavorites:
            content = <p>{t('toast.likedFromFavorites')}</p>;
            break;
        case ToastType.DislikePackageFromFavorites:
            content = <p>{t('toast.dislikedFromFavorites')}</p>;
            break;
    }

    return (
        <div className={styles.container} ref={wrapperRef}>
            <div className={styles['container__body']}>
                <div className={styles['container__body__children']}>
                    {content}
                </div>
                <FaRegWindowClose
                    className={styles['container__body__close-btn']}
                    size="22px"
                    color="white"
                    onClick={handleClose}
                />
            </div>
        </div>
    );
}

export default Toast;
