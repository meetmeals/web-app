import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import MobileMenuDrawer from 'components/mobile-menu-drawer';
import { RootState } from 'stores';
import { setMobileDrawerOpen } from 'stores/platform';
import { pages } from 'utilities/constants';

import styles from './mobile-header.module.scss';

function MobileHeader() {
    const { isMobileDrawerOpen } = useSelector(
        (state: RootState) => state.platform,
    );
    const dispatch = useDispatch();

    function handleToggleMobileMenuDrawer() {
        dispatch(
            setMobileDrawerOpen({
                isMobileDrawerOpen: !isMobileDrawerOpen,
            }),
        );
    }

    return (
        <header className={styles.header}>
            <MobileMenuDrawer
                isOpen={isMobileDrawerOpen}
                setOpen={handleToggleMobileMenuDrawer}
            />
            <nav className={styles['header__nav']}>
                <Link to={pages.explore.path}>
                    <img
                        alt="Meetmeals logo"
                        className={styles['header__nav__logo']}
                        src="/img/meetmeals-logo.png"
                    />
                </Link>
                <img
                    alt="Hamburger menu"
                    className={styles['header__nav__hamburger-menu']}
                    src="/img/icons/common/hamburger-menu.svg"
                    onClick={handleToggleMobileMenuDrawer}
                />
            </nav>
        </header>
    );
}

export default MobileHeader;
