import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import LanguagePicker from 'components/language-picker';
import { RootState } from 'stores';

import styles from './temp.module.scss';

function Temp() {
  const { language } = useSelector((state: RootState) => state.platform);
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <p>{t('hello_world')}</p>
      <p>Current Language: {language}</p>
      <LanguagePicker />
    </div>
  );
}

export default Temp;
