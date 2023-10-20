import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

import styles from './expandable-text.module.scss';

type ExpandableTextProps = {
    text: string;
    descriptionLength: number;
};

function ExpandableText(props: ExpandableTextProps) {
    const [isExpanded, setExpanded] = React.useState<boolean>(false);
    const { t } = useTranslation();

    function toggleExpand() {
        setExpanded((prev) => !prev);
    }

    return (
        <div className={styles.container}>
            <div
                dangerouslySetInnerHTML={{
                    __html: isExpanded
                        ? props.text
                        : `${props.text.slice(0, props.descriptionLength)}...`,
                }}
            />
            {props.text.length > 120 && (
                <p
                    className={styles['container__toggle-expand']}
                    onClick={toggleExpand}
                >
                    <button className={styles['container__toggle-expand__btn']}>
                        {isExpanded ? t('app.showLess') : t('app.showMore')}
                    </button>
                    {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
                </p>
            )}
        </div>
    );
}

export default ExpandableText;
