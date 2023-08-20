import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import CountdownTimer from 'components/countdown-timer/CountdownTimer';
import LanguagePicker from 'components/language-picker';
import { RootState } from 'stores';
import apiClient from 'utilities/api-client';

import styles from './temp.module.scss';
import Modal from 'components/modal/Modal';

function Temp() {
  const { countdownTimer, language } = useSelector(
    (state: RootState) => state.platform,
  );
  const { t } = useTranslation();
  const [isModalopen, setModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function loadProducts() {
      const products = await apiClient.products.fetchProducts();
      console.log(products);
    }
    loadProducts();
  }, []);

  return (
    <div className={styles.container}>
      <p>{t('hello_world')}</p>
      <p>Current Language: {language}</p>
      <LanguagePicker />
      <p onClick={() => setModalOpen(true)}>Open modal</p>
      <CountdownTimer
        seconds={countdownTimer || 120}
        onFinish={() => console.log('Timer stopped')}
      />
      {isModalopen ? (
        <Modal title="Test" handleClose={() => setModalOpen(false)}>
          <p>Hello world</p>
        </Modal>
      ) : null}
    </div>
  );
}

export default Temp;
