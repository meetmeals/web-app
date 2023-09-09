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
import { FaInbox, FaUser } from 'react-icons/fa';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { CustomErrorMessage } from 'components/error-message';
import InputWithIcon from 'components/input-with-icon';
import LoadingSpinner from 'components/loading-spinner';

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

type RegisterProps = {
    onLoginClicked: () => void;
};

function Register(props: RegisterProps) {
    const [isLoading, setLoading] = React.useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const { t } = useTranslation();

    function handleRegister(values: RegisterValuesInterface) {
        setLoading(true);
        console.log(values);
        setTimeout(() => {
            setLoading(false);
        }, 5000);
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
                                                icon={<FaUser />}
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
                                                icon={<FaUser />}
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
                                                icon={<FaInbox />}
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
                            {errorMessage && (
                                <div className={styles['form__error']}>
                                    {errorMessage}
                                </div>
                            )}
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
                    onClick={props.onLoginClicked}
                    className={styles['already-have-account__p']}
                >
                    {t('register.alreadyHaveAccount')}
                </p>
            </div>
        </div>
    );
}

export default Register;
