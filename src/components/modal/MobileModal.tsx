import React, { ReactNode } from 'react';

import { useClickOutside } from 'utilities/hooks';

import styles from './mobile-modal.module.scss';

type MobileModalProps = {
    children: ReactNode;
    title: string;
    handleClose: () => void;
};

function MobileModal(props: MobileModalProps) {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    useClickOutside(wrapperRef, () => props.handleClose());

    return (
        <div className={styles.container}>
            <div className={styles.modal} ref={wrapperRef}>
                <section className={styles['modal__header']}>
                    <span className={styles['modal__header__title']}>
                        {props.title}
                    </span>
                    <span
                        className={styles['modal__header__close-btn']}
                        onClick={props.handleClose}
                    >
                        <img
                            alt="Close menu"
                            className={styles['modal__header__close-btn__img']}
                            src="/img/icons/common/close-menu.svg"
                        />
                    </span>
                </section>
                <section className={styles['modal__body']}>
                    {props.children}
                </section>
            </div>
        </div>
    );
}

export default MobileModal;
