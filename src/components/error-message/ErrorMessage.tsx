import styles from './error-message.module.scss';

type ErrorMessageProps = {
    message: string;
};

function ErrorMessage(props: ErrorMessageProps) {
    return (
        <div className={styles['error-message']}>
            <img alt="Error message" src="/img/icons/error.svg" />
            {props.message}
        </div>
    );
}

export default ErrorMessage;
