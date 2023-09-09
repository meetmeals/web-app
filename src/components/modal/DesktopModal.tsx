import React, { ReactNode } from 'react';
import { FaRegWindowClose } from 'react-icons/fa';

import { useClickOutside } from 'utilities/hooks';

import styles from './desktop-modal.module.scss';

type DesktopModalProps = {
    children: ReactNode;
    title: string;
    handleClose: () => void;
};

function DesktopModal(props: DesktopModalProps) {
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
                        <FaRegWindowClose size="22px" />
                    </span>
                </section>
                <section className={styles['modal__body']}>
                    {props.children}
                </section>
            </div>
        </div>
    );
}

export default DesktopModal;
