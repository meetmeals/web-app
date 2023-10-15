import classNames from 'classnames';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import BottomSidebar from 'components/bottom-sidebar';
import LoadingSpinner from 'components/loading-spinner';
import { ConstantTextResponseData } from 'models/constant-text';
import { RootState } from 'stores';
import { setToast, Toast } from 'stores/user';
import apiClient from 'utilities/api-client';

import styles from './contact-us.module.scss';

const PROBLEM_TEXT_MAX_LENGTH = 600;
const PROBLEM_TEXT_ROWS = 8;

const getEmailSchema = (t: TFunction) =>
    Yup.string()
        .trim()
        .email(t('validations.validEmail') as string)
        .max(255)
        .required(t('validations.emailRequired') as string);

function ContactUs() {
    const [email, setEmail] = React.useState<string>('');
    const [emailError, setEmailError] = React.useState<string>('');
    const [helpText, setHelpText] = React.useState<ConstantTextResponseData>();
    const [issueTitleId, setIssueTitleId] = React.useState<number>(-1);
    const [problemId, setProblemId] = React.useState<number>(-1);
    const [problemText, setProblemText] = React.useState<string>('');
    const [isIssueSelectOpen, setIssueSelectOpen] =
        React.useState<boolean>(false);
    const [isProblemSelectOpen, setProblemSelectOpen] =
        React.useState<boolean>(false);
    const [isSaveLoading, setSaveLoading] = React.useState<boolean>(false);
    const [hasFormChanged, setFormChanged] = React.useState<boolean>(false);

    const { isLoggedIn, info } = useSelector((root: RootState) => root.user);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const problemFile1Ref = React.useRef<HTMLInputElement>(null);
    const problemFile2Ref = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        async function fetchConstantText() {
            const constantTextResponse = await apiClient.constantText.default(
                {},
            );
            switch (constantTextResponse.status) {
                case 200:
                    setHelpText(constantTextResponse.data);
                    break;
            }
        }
        fetchConstantText();
    }, []);

    React.useEffect(() => {
        setFormChanged(
            issueTitleId > 0 && problemId > 0 && emailError.length === 0,
        );
    }, [issueTitleId, problemId, emailError]);

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isSaveLoading) return;
        setSaveLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            formData.append('issue_title_id', issueTitleId.toString());
            formData.append('problem_id', problemId.toString());
            formData.append('problem_text', problemText);
            formData.append('email', isLoggedIn ? info.email! : email);
            const saveCustomerContactResponse =
                await apiClient.contactUs.saveCustomerContact(formData);
            switch (saveCustomerContactResponse.status) {
                case 200:
                    dispatch(setToast({ toast: Toast.SaveCustomerContact }));
                    // Reset form
                    if (problemFile1Ref.current)
                        problemFile1Ref.current.value = '';
                    if (problemFile2Ref.current)
                        problemFile2Ref.current.value = '';
                    setIssueTitleId(-1);
                    setProblemId(-1);
                    setProblemText('');
                    if (!isLoggedIn) setEmail('');
                    break;
            }
        } catch (e) {
            console.warn(e);
        } finally {
            setSaveLoading(false);
        }
    }

    let submitBtnContent: JSX.Element | string;
    if (isSaveLoading) {
        submitBtnContent = (
            <span>
                <LoadingSpinner />
            </span>
        );
    } else {
        submitBtnContent = t('contactUs.send');
    }

    return (
        <div className={styles.container}>
            <h1 className={styles['container__header']}>
                {t('contactUs.header')}
            </h1>
            <form
                className={styles['container__form']}
                onSubmit={handleFormSubmit}
            >
                {!isLoggedIn && (
                    <div className={styles['container__form__email']}>
                        <input
                            className={classNames(
                                styles['container__form__email__input'],
                                {
                                    [styles[
                                        'container__form__email__input--error'
                                    ]]: emailError,
                                },
                            )}
                            type="text"
                            placeholder={t('login.emailPlaceholder')}
                            value={email}
                            onChange={async (e) => {
                                const text = e.target.value;
                                try {
                                    await getEmailSchema(t).validate(text);
                                    setEmailError('');
                                } catch (e) {
                                    setEmailError(
                                        (e as Yup.ValidationError).message,
                                    );
                                } finally {
                                    setEmail(text);
                                }
                            }}
                        />
                        {emailError && (
                            <p
                                className={
                                    styles['container__form__email__error']
                                }
                            >
                                {emailError}
                            </p>
                        )}
                    </div>
                )}
                <div className={styles['container__form__issue']}>
                    <p
                        className={styles['container__form__issue__p']}
                        onClick={() => setIssueSelectOpen((prev) => !prev)}
                    >
                        {issueTitleId > 0
                            ? helpText?.help_title.find(
                                  (issue) => issue.id === issueTitleId,
                              )?.text
                            : t('contactUs.selectIssue')}
                    </p>
                    <BottomSidebar
                        isOpen={isIssueSelectOpen}
                        setOpen={setIssueSelectOpen}
                        height={600}
                    >
                        <div
                            className={
                                styles['container__bottom-sidebar__issue']
                            }
                        >
                            <p
                                className={
                                    styles['container__bottom-sidebar__header']
                                }
                            >
                                {t('contactUs.issue')}
                            </p>
                            <div
                                className={
                                    styles[
                                        'container__bottom-sidebar__issue__list'
                                    ]
                                }
                            >
                                {helpText?.help_title.map((issue) => (
                                    <p
                                        key={issue.id}
                                        className={classNames(
                                            styles[
                                                'container__bottom-sidebar__issue__list__item'
                                            ],
                                            {
                                                [styles[
                                                    'container__bottom-sidebar__issue__list__item--selected'
                                                ]]: issueTitleId === issue.id,
                                            },
                                        )}
                                        onClick={() => {
                                            setIssueTitleId(issue.id);
                                            setProblemId(-1);
                                            setIssueSelectOpen(false);
                                        }}
                                    >
                                        {issue.text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </BottomSidebar>
                </div>
                {issueTitleId > 0 && (
                    <div className={styles['container__form__problem']}>
                        <p
                            className={styles['container__form__problem__p']}
                            onClick={() =>
                                setProblemSelectOpen((prev) => !prev)
                            }
                        >
                            {problemId > 0
                                ? helpText?.help_title
                                      .find(
                                          (issue) => issue.id === issueTitleId,
                                      )
                                      ?.subject.find(
                                          (subject) => subject.id === problemId,
                                      )?.fa_title
                                : t('contactUs.chooseProblem')}
                        </p>
                        <BottomSidebar
                            isOpen={isProblemSelectOpen}
                            setOpen={setProblemSelectOpen}
                            height={600}
                        >
                            <div
                                className={
                                    styles['container__bottom-sidebar__problem']
                                }
                            >
                                <p
                                    className={
                                        styles[
                                            'container__bottom-sidebar__header'
                                        ]
                                    }
                                >
                                    {t('contactUs.problem')}
                                </p>
                                <div
                                    className={
                                        styles[
                                            'container__bottom-sidebar__problem__list'
                                        ]
                                    }
                                >
                                    {helpText?.help_title
                                        .find(
                                            (issue) =>
                                                issue.id === issueTitleId,
                                        )
                                        ?.subject.map((subject) => (
                                            <p
                                                key={subject.id}
                                                className={classNames(
                                                    styles[
                                                        'container__bottom-sidebar__problem__list__item'
                                                    ],
                                                    {
                                                        [styles[
                                                            'container__bottom-sidebar__problem__list__item--selected'
                                                        ]]:
                                                            problemId ===
                                                            subject.id,
                                                    },
                                                )}
                                                onClick={() => {
                                                    setProblemId(subject.id);
                                                    setProblemSelectOpen(false);
                                                }}
                                            >
                                                {subject.fa_title}
                                            </p>
                                        ))}
                                </div>
                            </div>
                        </BottomSidebar>
                    </div>
                )}
                <div className={styles['container__form__files']}>
                    <h3 className={styles['container__form__files__header']}>
                        {t('contactUs.addFiles')}
                    </h3>
                    <section className={styles['container__form__files__body']}>
                        <input
                            ref={problemFile1Ref}
                            type="file"
                            accept="image/*"
                            name="problem_file1"
                        />
                        <input
                            ref={problemFile2Ref}
                            type="file"
                            accept="image/*"
                            name="problem_file2"
                        />
                    </section>
                </div>
                <div className={styles['container__form__text-area']}>
                    <h3
                        className={styles['container__form__text-area__header']}
                    >
                        {t('contactUs.problemTextTitle')}
                    </h3>
                    <textarea
                        className={styles['container__form__text-area__el']}
                        rows={PROBLEM_TEXT_ROWS}
                        maxLength={PROBLEM_TEXT_MAX_LENGTH}
                        autoComplete="off"
                        value={problemText}
                        onChange={(e) => setProblemText(e.target.value)}
                        placeholder={t('contactUs.problemTextPlaceholder')}
                    />
                    <p
                        className={
                            styles['container__form__text-area__remaining']
                        }
                    >
                        {`${problemText.length}/${PROBLEM_TEXT_MAX_LENGTH}`}
                    </p>
                </div>
                <div className={styles['container__form__submit']}>
                    <button
                        type="submit"
                        className={classNames(
                            styles['container__form__submit__btn'],
                            {
                                [styles[
                                    'container__form__submit__btn--loading'
                                ]]: isSaveLoading,
                            },
                        )}
                        disabled={
                            !hasFormChanged ||
                            (!isLoggedIn &&
                                (email.length === 0 || emailError.length > 0))
                        }
                    >
                        {submitBtnContent}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ContactUs;
