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
import { FaInbox, FaUser } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { CustomErrorMessage } from 'components/error-message';
import InputWithIcon from 'components/input-with-icon';
import LoadingSpinner from 'components/loading-spinner';
import { RegisterResponseInterface } from 'models/auth';
import { AuthStep } from 'models/common';
import { setAuthenticating, setTempEmail } from 'stores/user';
import apiClient from 'utilities/api-client';

import styles from './register.module.scss';

interface RegisterValuesInterface extends FormikValues {
    firstName: string;
    lastName: string;
    email: string;
}

function getRegisterSchema(t: TFunction) {
    return Yup.object().shape({
        firstName: Yup.string()
            .trim()
            .min(1)
            .max(128)
            .required(t('validations.firstNameRequired') as string),
        lastName: Yup.string()
            .trim()
            .min(1)
            .max(128)
            .required(t('validations.lastNameRequired') as string),
        email: Yup.string()
            .trim()
            .email(t('validations.validEmail') as string)
            .max(255)
            .required(t('validations.emailRequired') as string),
    });
}

function Register() {
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const { t } = useTranslation();
    const dispatch = useDispatch();

    async function handleRegister(values: RegisterValuesInterface) {
        setLoading(true);
        setErrorMessage('');
        const registerResponse: RegisterResponseInterface =
            await apiClient.auth.register({
                fName: values.firstName,
                lName: values.lastName,
                username: values.email,
            });
        setLoading(false);
        switch (registerResponse.status) {
            case 200:
                dispatch(setTempEmail({ tempEmail: values.email }));
                dispatch(setAuthenticating({ authStep: AuthStep.OTP }));
                break;
            case 400:
                setErrorMessage(t('errors.user.alreadyExists') as string);
                break;
            case 422:
                setErrorMessage(t('errors.user.invalidForm') as string);
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
        submitBtnContent = t('register.submit');
    }

    const registerInitialValues: RegisterValuesInterface = {
        firstName: '',
        lastName: '',
        email: '',
    };

    return (
        <div>
            <Formik
                initialValues={registerInitialValues}
                validationSchema={getRegisterSchema(t)}
                onSubmit={handleRegister}
            >
                {(props) => (
                    <Form>
                        <div className={styles.form}>
                            {/* <!-- First name -->*/}
                            <div className={styles['form__first-name']}>
                                <p className={styles['form__input-label']}>
                                    {t('register.firstName')}
                                </p>
                                <Field name="firstName">
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
                                                    <FaUser color="#015248" />
                                                }
                                                type="text"
                                                placeholder={t(
                                                    'register.firstNamePlaceholder',
                                                )}
                                                meta={meta}
                                                {...field}
                                            />
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage name="firstName">
                                    {(message) => (
                                        <CustomErrorMessage message={message} />
                                    )}
                                </ErrorMessage>
                            </div>
                            {/* <!-- Last name -->*/}
                            <div className={styles['form__last-name']}>
                                <p className={styles['form__input-label']}>
                                    {t('register.lastName')}
                                </p>
                                <Field name="lastName">
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
                                                    <FaUser color="#015248" />
                                                }
                                                type="text"
                                                placeholder={t(
                                                    'register.lastNamePlaceholder',
                                                )}
                                                meta={meta}
                                                {...field}
                                            />
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage name="lastName">
                                    {(message) => (
                                        <CustomErrorMessage message={message} />
                                    )}
                                </ErrorMessage>
                            </div>
                            {/* <!-- Email -->*/}
                            <div className={styles['form__email']}>
                                <p className={styles['form__input-label']}>
                                    {t('register.email')}
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
                                                    'register.emailPlaceholder',
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
            <div className={styles['already-have-account']}>
                <p
                    onClick={() =>
                        dispatch(
                            setAuthenticating({ authStep: AuthStep.LOGIN }),
                        )
                    }
                    className={styles['already-have-account__p']}
                >
                    {t('register.alreadyHaveAccount')}
                </p>
            </div>
        </div>
    );
}

export default Register;
