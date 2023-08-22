import React from 'react';
import { useTranslation } from 'react-i18next';

import Login from 'components/login';
import Modal from 'components/modal';
import Register from 'components/register';

function LoginRegisterWrapper() {
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
  const [showLogin, setShowLogin] = React.useState<boolean>(true);

  const { t } = useTranslation();

  let view = null;
  if (isModalOpen) {
    if (showLogin) {
      view = (
        <Modal
          title={t('login.welcomeBack')}
          handleClose={() => setModalOpen(false)}
        >
          <Login onRegisterClicked={() => setShowLogin(false)} />
        </Modal>
      );
    } else {
      view = (
        <Modal
          title={t('register.createAccount')}
          handleClose={() => setModalOpen(false)}
        >
          <Register onLoginClicked={() => setShowLogin(true)} />
        </Modal>
      );
    }
  } else {
    view = (
      <button onClick={() => setModalOpen(true)}>{t('login.submit')}</button>
    );
  }

  return view;
}

export default LoginRegisterWrapper;
