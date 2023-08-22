import styles from './loading-spinner.module.scss';

function LoadingSpinner() {
  return (
    <img
      className={styles['loading-spinner']}
      alt="Loading spinner"
      src="/img/icons/loading-spinner.svg"
    />
  );
}

export default LoadingSpinner;
