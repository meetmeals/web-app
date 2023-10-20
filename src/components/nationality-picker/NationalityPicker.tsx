import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { nationalities, ThemeColor } from 'utilities/constants';

import styles from './nationality-picker.module.scss';

type NationalityPickerProps = {
    theme: ThemeColor;
    selected: string;
    setNationality: (selectedNationality: string) => void;
};

function NationalityPicker(props: NationalityPickerProps) {
    const { t } = useTranslation();

    function handleNationalityChange(nationality: string) {
        props.setNationality(nationality);
    }

    return (
        <div
            className={classNames(styles['nationality-picker'], {
                [styles['nationality-picker--white']]:
                    props.theme === ThemeColor.WHITE,
            })}
        >
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
                                        'nationality-picker__content__item__span__white'
                                    ]]: props.theme === ThemeColor.WHITE,
                                },
                                {
                                    [styles[
                                        'nationality-picker__content__item__span--selected'
                                    ]]:
                                        props.selected ===
                                        nationality.translationKey,
                                },
                                {
                                    [styles[
                                        'nationality-picker__content__item__span__white--selected'
                                    ]]:
                                        props.selected ===
                                            nationality.translationKey &&
                                        props.theme === ThemeColor.WHITE,
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
