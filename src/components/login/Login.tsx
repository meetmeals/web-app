import classNames from 'classnames';
import {
    ErrorMessage,
    Field,
    FieldMetaProps,
    Form,
    Formik,
    FormikValues,
} from 'formik';
import { TFunction } from 'i18next';
import React from 'react';
import { FaInbox } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { CustomErrorMessage } from 'components/error-message';
import InputWithIcon from 'components/input-with-icon';
import LoadingSpinner from 'components/loading-spinner';
import { AuthStep } from 'models/common';
import { LoginResponseInterface } from 'models/auth';
import { setAuthenticating, setTempEmail } from 'stores/user';
import apiClient from 'utilities/api-client';

import styles from './login.module.scss';

interface LoginValuesInterface extends FormikValues {
    email: string;
}

function getLoginSchema(t: TFunction) {
    return Yup.object().shape({
        email: Yup.string()
            .trim()
            .email(t('validations.validEmail') as string)
            .max(255)
            .required(t('validations.emailRequired') as string),
    });
}

function Login() {
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const { t } = useTranslation();
    const dispatch = useDispatch();

    async function handleLogin(values: LoginValuesInterface) {
        setLoading(true);
        setErrorMessage('');
        const loginResponse: LoginResponseInterface =
            await apiClient.auth.login({ username: values.email });
        setLoading(false);
        switch (loginResponse.status) {
            case 200:
                dispatch(setTempEmail({ tempEmail: values.email }));
                dispatch(setAuthenticating({ authStep: AuthStep.OTP }));
                break;
            case 400:
                setErrorMessage(t('errors.user.notFound') as string);
                break;
            case 422:
                setErrorMessage(t('errors.user.invalidEmail') as string);
                break;
            default:
                setErrorMessage(t('errors.server.internal') as string);
                break;
        }
    }

    let submitBtnContent: JSX.Element | string;
    if (isLoading) {
        submitBtnContent = (
            <span>
                <LoadingSpinner />
            </span>
        );
    } else {
        submitBtnContent = t('login.submit');
    }

    const loginInitialValues: LoginValuesInterface = {
        email: '',
    };

    return (
        <div>
            <Formik
                initialValues={loginInitialValues}
                validationSchema={getLoginSchema(t)}
                onSubmit={handleLogin}
            >
                {(props) => (
                    <Form>
                        <div className={styles.form}>
                            {/* <!-- Email -->*/}
                            <div className={styles['form__email']}>
                                <p className={styles['form__input-label']}>
                                    {t('login.email')}
                                </p>
                                <Field name="email">
                                    {({
                                        field,
                                        meta,
                                    }: {
                                        field: object;
                                        meta: FieldMetaProps<string>;
                                    }) => (
                                        <div>
                                            <InputWithIcon
                                                icon={
                                                    <FaInbox color="#015248" />
                                                }
                                                type="text"
                                                placeholder={t(
                                                    'login.emailPlaceholder',
                                                )}
                                                meta={meta}
                                                {...field}
                                            />
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage name="email">
                                    {(message) => (
                                        <CustomErrorMessage message={message} />
                                    )}
                                </ErrorMessage>
                            </div>
                            <div
                                className={classNames(styles['form__error'], {
                                    [styles['form__error--visible']]:
                                        errorMessage,
                                })}
                            >
                                {errorMessage}
                            </div>
                            <div className={styles['form__submit']}>
                                <button
                                    type="submit"
                                    className={classNames(
                                        styles['form__submit__btn'],
                                        {
                                            [styles[
                                                'form__submit__btn--loading'
                                            ]]: isLoading,
                                        },
                                    )}
                                    disabled={!(props.isValid && props.dirty)}
                                >
                                    {submitBtnContent}
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
            <div className={styles['no-account']}>
                <p
                    onClick={() =>
                        dispatch(
                            setAuthenticating({ authStep: AuthStep.REGISTER }),
                        )
                    }
                    className={styles['no-account__p']}
                >
                    {t('login.noAccount')}
                </p>
            </div>
        </div>
    );
}

export default Login;
