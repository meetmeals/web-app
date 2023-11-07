import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import LoadingOverlay from 'components/loading-overlay';
import LoadingSpinner from 'components/loading-spinner';
import { ProfileUser, UserProfileResponseInterface } from 'models/account';
import { RootState } from 'stores';
import { setToast, setUserInfo, Toast } from 'stores/user';
import apiClient from 'utilities/api-client';

import styles from './profile.module.scss';

function Profile() {
    const [user, setUser] = React.useState<ProfileUser>();
    const [file, setFile] = React.useState<File>();
    const [profilePictureSrc, setProfilePictureSrc] = React.useState<string>(
        '/img/icons/common/upload-profile.png',
    );
    const [form, setForm] = React.useState({
        fName: '',
        lName: '',
        mobile: '',
    });
    const [hasFormChanged, setFormChanged] = React.useState<boolean>(false);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [isSaveLoading, setSaveLoading] = React.useState<boolean>(false);
    const [formError, setFormError] = React.useState<{
        fName: string;
        lName: string;
    }>({ fName: '', lName: '' });
    const { token } = useSelector((root: RootState) => root.user);
    const [refreshTries, setRefreshTries] = React.useState<number>(0);

    const { t } = useTranslation();
    const dispatch = useDispatch();
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
                    setLoading(false);
                    dispatch(
                        setUserInfo({
                            email: profileResponse.user.username,
                            fName: profileResponse.user.fName,
                            lName: profileResponse.user.lName,
                            mobile: profileResponse.user.mobile,
                            userImage: profileResponse.user.userImage,
                        }),
                    );
                    break;
                case 401:
                    // [TODO]: Log out user
                    break;
            }
        }
        getProfile();
    }, [dispatch, token, refreshTries]);

    React.useEffect(() => {
        if (user?.fName && user?.lName)
            setForm({
                fName: user?.fName,
                lName: user?.lName,
                mobile: user?.mobile || '',
            });
        // eslint-disable-next-line no-useless-escape
        if (user?.userImage && user.userImage !== null)
            setProfilePictureSrc(
                process.env.REACT_APP_ASSETS_BASE_URL + user?.userImage,
            );
    }, [user]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        // [TODO]: Restrict file upload size
        console.warn(file);
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
        if (e.target.name === 'fName')
            if (e.target.value.length === 0)
                setFormError((prev) => ({
                    ...prev,
                    fName: 'register.firstNameRequired',
                }));
            else setFormError((prev) => ({ ...prev, fName: '' }));

        if (e.target.name === 'lName')
            if (e.target.value.length === 0)
                setFormError((prev) => ({
                    ...prev,
                    lName: 'register.lastNameRequired',
                }));
            else setFormError((prev) => ({ ...prev, lName: '' }));

        setFormChanged(true);
    }

    async function handleProfileSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isSaveLoading) return;
        setSaveLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            console.log(formData);
            const editProfileResponse = await apiClient.account.editProfile(
                formData,
                { Authorization: `Bearer ${token}` },
            );
            switch (editProfileResponse.status) {
                case 200:
                    dispatch(setToast({ toast: Toast.ProfileUpdated }));
                    setRefreshTries((prev) => prev + 1);
                    break;
                case 401:
                    break;
            }
        } catch (e) {
            console.warn(e);
        } finally {
            setFormChanged(false);
            setSaveLoading(false);
        }
    }

    // eslint-disable-next-line no-useless-escape
    const hasProfilePicture = user?.userImage && user.userImage !== null;

    if (isLoading) return <LoadingOverlay />;
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
                        name="userImage"
                        type="file"
                        accept="image/*"
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
                                ]]: formError.fName,
                            },
                        )}
                        name="fName"
                        placeholder={t('register.firstName')}
                        value={form.fName}
                        onChange={handleInputChange}
                    />
                    {formError.fName && (
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
                                ]]: formError.lName,
                            },
                        )}
                        name="lName"
                        placeholder={t('register.lastName')}
                        value={form.lName}
                        onChange={handleInputChange}
                    />
                    {formError.lName && (
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
                                formError.fName.length !== 0 ||
                                formError.lName.length !== 0
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
