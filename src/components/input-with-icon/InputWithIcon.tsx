import classNames from 'classnames';
import { FieldMetaProps } from 'formik';
import { ReactNode } from 'react';

import styles from './input-with-icon.module.scss';

type InputWithIconProps = {
    icon: ReactNode;
    meta: FieldMetaProps<string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

function InputWithIcon(props: InputWithIconProps) {
    return (
        <div className={styles['custom-input']}>
            <span className={styles['custom-input__icon']}>{props.icon}</span>
            <input
                className={classNames(styles['custom-input__input'], {
                    [styles['custom-input__input--error']]:
                        props.meta.touched && props.meta.error,
                })}
                {...props}
            />
        </div>
    );
}

export default InputWithIcon;
