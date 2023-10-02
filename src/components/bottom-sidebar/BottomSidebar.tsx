import React, { Dispatch, SetStateAction } from 'react';

import { useClickOutside } from 'utilities/hooks';

import styles from './bottom-sidebar.module.scss';

type BottomSidebarProps = {
    children: JSX.Element;
    height: number;
    isOpen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

function BottomSidebar(props: BottomSidebarProps) {
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    useClickOutside(wrapperRef, () => {
        props.setOpen(false);
    });

    return (
        <div
            className={styles.container}
            style={{ maxHeight: props.isOpen ? props.height : 0 }}
            ref={wrapperRef}
        >
            <div className={styles['container__header']}>
                <div className={styles['container__header__separator']} />
            </div>
            {props.children}
        </div>
    );
}

export default BottomSidebar;
