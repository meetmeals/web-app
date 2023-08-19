import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import LanguagePicker from 'components/language-picker';
import { RootState } from 'stores';
import apiClient from 'utilities/api-client';

import styles from './temp.module.scss';

function Temp() {
  const { language } = useSelector((state: RootState) => state.platform);
  const { t } = useTranslation();

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
    </div>
  );
}

export default Temp;
