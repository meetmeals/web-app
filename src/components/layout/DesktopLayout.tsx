import { ReactNode } from 'react';

import styles from './desktop-layout.module.scss';

type DesktopLayoutProps = {
  children: ReactNode;
};

function DesktopLayout(props: DesktopLayoutProps) {
  return <div className={styles.container}>{props.children}</div>;
}

export default DesktopLayout;
