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
import { FaInbox } from 'react-icons/fa';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { CustomErrorMessage } from 'components/error-message';
import InputWithIcon from 'components/input-with-icon';
import LoadingSpinner from 'components/loading-spinner';

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

type LoginProps = {
    onRegisterClicked: () => void;
};

function Login(props: LoginProps) {
    const [isLoading, setLoading] = React.useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const { t } = useTranslation();

    function handleLogin(values: LoginValuesInterface) {
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
                                                icon={<FaInbox />}
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
            <div className={styles['no-account']}>
                <p
                    onClick={props.onRegisterClicked}
                    className={styles['no-account__p']}
                >
                    {t('login.noAccount')}
                </p>
            </div>
        </div>
    );
}

export default Login;
