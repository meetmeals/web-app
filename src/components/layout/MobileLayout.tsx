import { ReactNode } from 'react';

type MobileLayoutProps = {
  children: ReactNode;
};

function MobileLayout(props: MobileLayoutProps) {
  return <div>{props.children}</div>;
}

export default MobileLayout;
