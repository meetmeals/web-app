import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'stores';
import DesktopModal from './DesktopModal';
import MobileModal from './MobileModal';

type ModalProps = {
    children: ReactNode;
    title: string;
    handleClose: () => void;
};

function Modal(props: ModalProps) {
    const { isMobile } = useSelector((state: RootState) => state.platform);

    return isMobile ? <MobileModal {...props} /> : <DesktopModal {...props} />;
}

export default Modal;
