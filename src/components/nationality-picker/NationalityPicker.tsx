import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from 'stores';
import { setSelectedNationality } from 'stores/user';
import { nationalities } from 'utilities/constants';

import styles from './nationality-picker.module.scss';

function NationalityPicker() {
    const { selectedNationality } = useSelector(
        (state: RootState) => state.user,
    );
    const dispatch = useDispatch();
    const { t } = useTranslation();

    function handleNationalityChange(nationality: string) {
        dispatch(setSelectedNationality({ selectedNationality: nationality }));
    }

    return (
        <div className={styles['nationality-picker']}>
            <section className={styles['nationality-picker__content']}>
                {nationalities.map((nationality) => (
                    <section
                        key={nationality.translationKey}
                        className={styles['nationality-picker__content__item']}
                        onClick={() =>
                            handleNationalityChange(nationality.translationKey)
                        }
                    >
                        <img
                            className={
                                styles['nationality-picker__content__item__img']
                            }
                            src={`/img/icons/nationalities/${nationality.icon}`}
                            alt={nationality.translationKey}
                        />
                        <span
                            className={classNames(
                                styles[
                                    'nationality-picker__content__item__span'
                                ],
                                {
                                    [styles[
                                        'nationality-picker__content__item__span--selected'
                                    ]]:
                                        selectedNationality ===
                                        nationality.translationKey,
                                },
                            )}
                        >
                            {t(`nationalities.${nationality.translationKey}`)}
                        </span>
                    </section>
                ))}
            </section>
        </div>
    );
}

export default NationalityPicker;
