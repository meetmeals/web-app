import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CountdownTimer from 'components/countdown-timer';
import LoadingSpinner from 'components/loading-spinner';
import { VerifyLoginResponseInterface } from 'models/auth';
import { AuthStep } from 'models/common';
import { RootState } from 'stores';
import { setCountdownTimer } from 'stores/platform';
import { setAuthenticating, setLoggedIn } from 'stores/user';
import apiClient from 'utilities/api-client';

import styles from './otp-wrapper.module.scss';

const OTP_LENGTH = 5;

function OtpWrapper() {
    const { countdownTimer } = useSelector(
        (state: RootState) => state.platform,
    );
    const { tempEmail } = useSelector((state: RootState) => state.user);
    const [otp, setOtp] = React.useState<string>('');
    const [shouldShowTimer, setShowTimer] = React.useState<boolean>(
        countdownTimer > 0,
    );
    const [shouldShowResend, setShowResend] = React.useState<boolean>(false);
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [retries, setRetries] = React.useState<number>(0);

    const { t } = useTranslation();
    const dispatch = useDispatch();

    let btnContent: JSX.Element | string;
    if (isLoading) {
        btnContent = (
            <span>
                <LoadingSpinner />
            </span>
        );
    } else {
        btnContent = retries > 0 ? t('app.resend') : t('app.submit');
    }

    const isBtnDisabled =
        otp.length !== OTP_LENGTH || isLoading || shouldShowTimer;

    async function handleSubmit() {
        setRetries(1);
        setLoading(true);
        setShowResend(false);
        const verifyLoginResponse: VerifyLoginResponseInterface =
            await apiClient.auth.verifyLogin({
                otp,
                username: tempEmail,
            });
        setShowTimer(true);
        setLoading(false);
        switch (verifyLoginResponse.status) {
            case 200:
                const token = verifyLoginResponse.data?.token;
                const info = verifyLoginResponse.data?.userInfo;
                dispatch(setLoggedIn({ isLoggedIn: true, token, info }));
                dispatch(setAuthenticating({ authStep: AuthStep.NONE }));
                dispatch(setCountdownTimer(0));
                break;
            case 400:
                setErrorMessage(t('errors.user.invalidOtp') as string);
                break;
            case 422:
                setErrorMessage(t('errors.user.invalidForm') as string);
                break;
            default:
                setErrorMessage(t('errors.server.internal') as string);
                break;
        }
    }

    return (
        <div className={styles.container}>
            <p className={styles['container__title']}>{t('otp.title')}</p>
            <input
                className={styles['container__input']}
                type="text"
                placeholder={t('otp.placeholder')}
                value={otp}
                onChange={(e) => {
                    if (
                        e.target.value.length === 0 ||
                        /^\d+$/.test(e.target.value)
                    )
                        setOtp(e.target.value);
                }}
                maxLength={OTP_LENGTH}
            />
            {shouldShowTimer && (
                <div className={styles['container__resend-in']}>
                    <span>{t('otp.resendIn')}:</span>
                    <CountdownTimer
                        seconds={countdownTimer || 120}
                        onFinish={() => {
                            setShowTimer(false);
                            setShowResend(true);
                        }}
                    />
                </div>
            )}
            {shouldShowResend && (
                <div className={styles['container__resend']}>
                    <span
                        onClick={() => {
                            dispatch(
                                setAuthenticating({ authStep: AuthStep.LOGIN }),
                            );
                        }}
                    >
                        {t('otp.changeEmail')}
                    </span>
                </div>
            )}
            <div
                className={classNames(styles['container__error'], {
                    [styles['container__error--visible']]: errorMessage,
                })}
            >
                <p>{errorMessage}</p>
            </div>
            <button
                className={styles['container__submit-btn']}
                disabled={isBtnDisabled}
                onClick={handleSubmit}
            >
                {btnContent}
            </button>
        </div>
    );
}

export default OtpWrapper;
