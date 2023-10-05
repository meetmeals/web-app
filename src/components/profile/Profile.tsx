import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import LoadingSpinner from 'components/loading-spinner/LoadingSpinner';
import { ProfileUser, UserProfileResponseInterface } from 'models/account';
import { RootState } from 'stores';
import apiClient from 'utilities/api-client';

import styles from './profile.module.scss';

function Profile() {
    const [user, setUser] = React.useState<ProfileUser>();
    const [file, setFile] = React.useState<File>();
    const [profilePictureSrc, setProfilePictureSrc] = React.useState<string>(
        '/img/icons/common/upload-profile.png',
    );
    const [form, setForm] = React.useState({
        firstName: '',
        lastName: '',
        mobile: '',
    });
    const [hasFormChanged, setFormChanged] = React.useState<boolean>(false);
    // const [isLoading, setLoading] = React.useState<boolean>(false);
    const [isSaveLoading, setSaveLoading] = React.useState<boolean>(false);
    const [formError, setFormError] = React.useState<{
        firstName: string;
        lastName: string;
    }>({ firstName: '', lastName: '' });
    const { token } = useSelector((root: RootState) => root.user);

    const { t } = useTranslation();
    const imgUploadInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        async function getProfile() {
            const profileResponse: UserProfileResponseInterface =
                await apiClient.account.profile({
                    Authorization: `Bearer ${token}`,
                });
            switch (profileResponse.status) {
                case 200:
                    setUser(profileResponse.user);
                    break;
                case 401:
                    // [TODO]: Log out user
                    break;
            }
        }
        getProfile();
    }, [token]);

    React.useEffect(() => {
        if (user?.fName && user?.lName)
            setForm({
                firstName: user?.fName,
                lastName: user?.lName,
                mobile: user?.mobile || '',
            });
        // eslint-disable-next-line no-useless-escape
        if (user?.userImage && user.userImage !== null)
            setProfilePictureSrc(user?.userImage);
    }, [user]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(file);
        if (e.target.files?.length) {
            setFile(e.target.files[0]);
            setProfilePictureSrc(URL.createObjectURL(e.target.files[0]));
            setFormChanged(true);
        }
    }

    function handleProfilePictureClick() {
        if (imgUploadInputRef?.current) imgUploadInputRef.current.click();
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (e.target.name === 'firstName')
            if (e.target.value.length === 0)
                setFormError((prev) => ({
                    ...prev,
                    firstName: 'register.firstNameRequired',
                }));
            else setFormError((prev) => ({ ...prev, firstName: '' }));

        if (e.target.name === 'lastName')
            if (e.target.value.length === 0)
                setFormError((prev) => ({
                    ...prev,
                    lastName: 'register.lastNameRequired',
                }));
            else setFormError((prev) => ({ ...prev, lastName: '' }));

        setFormChanged(true);
    }

    function handleProfileSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isSaveLoading) return;
        const formData = new FormData(e.currentTarget);
        console.log(formData.get('firstName'));
        console.log(formData.get('lastName'));
        console.log(formData.get('mobile'));
        console.log(formData.get('profilePicture'));
        setSaveLoading(true);
    }

    // eslint-disable-next-line no-useless-escape
    const hasProfilePicture = user?.userImage && user.userImage !== null;

    let submitBtnContent: JSX.Element | string;
    if (isSaveLoading) {
        submitBtnContent = (
            <span>
                <LoadingSpinner />
            </span>
        );
    } else {
        submitBtnContent = t('account.save');
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleProfileSave}>
                <div className={styles['container__img-container']}>
                    <div
                        className={styles['container__img-container__img']}
                        style={{
                            backgroundImage: `url(${profilePictureSrc})`,
                            backgroundSize: 'cover',
                        }}
                        onClick={handleProfilePictureClick}
                    />
                    <input
                        className={
                            styles['container__img-container__img-input']
                        }
                        name="profilePicture"
                        type="file"
                        onChange={handleFileChange}
                        ref={imgUploadInputRef}
                    />
                    <p className={styles['container__img-container__img-text']}>
                        {hasProfilePicture
                            ? t('account.changeProfile')
                            : t('account.setProfile')}
                    </p>
                </div>
                <div className={styles['container__form-container']}>
                    <input
                        className={classNames(
                            styles['container__form-container__input'],
                            {
                                [styles[
                                    'container__form-container__input--error'
                                ]]: formError.firstName,
                            },
                        )}
                        name="firstName"
                        placeholder={t('register.firstName')}
                        value={form.firstName}
                        onChange={handleInputChange}
                    />
                    {formError.firstName && (
                        <p
                            className={
                                styles['container__form-container__error']
                            }
                        >
                            {t('validations.firstNameRequired')}
                        </p>
                    )}
                    <input
                        className={classNames(
                            styles['container__form-container__input'],
                            {
                                [styles[
                                    'container__form-container__input--error'
                                ]]: formError.lastName,
                            },
                        )}
                        name="lastName"
                        placeholder={t('register.lastName')}
                        value={form.lastName}
                        onChange={handleInputChange}
                    />
                    {formError.lastName && (
                        <p
                            className={
                                styles['container__form-container__error']
                            }
                        >
                            {t('validations.lastNameRequired')}
                        </p>
                    )}
                    <input
                        className={styles['container__form-container__input']}
                        name="mobile"
                        placeholder={t('register.mobile')}
                        value={form.mobile}
                        onChange={handleInputChange}
                    />
                    <div
                        className={styles['container__form-container__submit']}
                    >
                        <button
                            type="submit"
                            className={classNames(
                                styles[
                                    'container__form-container__submit__btn'
                                ],
                                {
                                    [styles[
                                        'container__form-container__submit__btn--loading'
                                    ]]: isSaveLoading,
                                },
                            )}
                            disabled={
                                !hasFormChanged ||
                                formError.firstName.length !== 0 ||
                                formError.lastName.length !== 0
                            }
                        >
                            {submitBtnContent}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Profile;
