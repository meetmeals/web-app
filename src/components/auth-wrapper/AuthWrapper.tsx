import { useTranslation } from 'react-i18next';

import Login from 'components/login';
import Modal from 'components/modal';
import OtpWrapper from 'components/otp-wrapper';
import Register from 'components/register';
import { AuthStep } from 'models/common';

type AuthWrapperProps = {
    onClose: () => void;
    step: AuthStep;
};

function AuthWrapper(props: AuthWrapperProps) {
    const { t } = useTranslation();

    if (props.step === AuthStep.LOGIN) {
        return (
            <Modal title={t('login.welcomeBack')} handleClose={props.onClose}>
                <Login />
            </Modal>
        );
    }
    if (props.step === AuthStep.REGISTER) {
        return (
            <Modal
                title={t('register.createAccount')}
                handleClose={props.onClose}
            >
                <Register />
            </Modal>
        );
    }

    if (props.step === AuthStep.OTP) {
        return (
            <Modal title={t('login.welcomeBack')} handleClose={props.onClose}>
                <OtpWrapper />
            </Modal>
        );
    }

    return null;
}

export default AuthWrapper;
