import classNames from 'classnames';
import React from 'react';

import { isTouchDevice } from 'utilities/helpers';
import { useIsMounted } from 'utilities/hooks';

import styles from './swipeable-button.module.scss';

type SwipeableButtonProps = {
    language: string;
    text: string;
    sliderText: string;
    unlockedText: string;
    color: string;
    onSuccess: () => void;
    onFailure: () => void;
};

function SwipeableButton(props: SwipeableButtonProps) {
    const [isUnlocked, setUnlocked] = React.useState<boolean>(false);
    const isMounted = useIsMounted();

    const slider = React.useRef<HTMLDivElement>(null);
    const container = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef<boolean>(false);
    const sliderLeft = React.useRef<number>(0);
    const containerWidth = React.useRef<number>(0);
    const startX = React.useRef<number>(0);

    React.useEffect(() => {
        if (isTouchDevice) {
            document.addEventListener('touchmove', handleOnDrag);
            document.addEventListener('touchend', handleStopDrag);
        } else {
            document.addEventListener('mousemove', handleOnDrag);
            document.addEventListener('mouseup', handleStopDrag);
        }

        if (container.current)
            containerWidth.current = container.current?.clientWidth - 50;

        return () => {
            if (isTouchDevice) {
                document.removeEventListener('touchmove', handleOnDrag);
                document.removeEventListener('touchend', handleStopDrag);
            } else {
                document.removeEventListener('mousemove', handleOnDrag);
                document.removeEventListener('mouseup', handleStopDrag);
            }
        };
    }, []);

    function handleOnDrag(e: TouchEvent | MouseEvent) {
        if (!isMounted() || isUnlocked) return;
        if (isDragging.current) {
            if (isTouchDevice && e instanceof TouchEvent) {
                sliderLeft.current = Math.min(
                    Math.max(0, e.touches[0].clientX - startX.current),
                    containerWidth.current,
                );
            } else if (!isTouchDevice && e instanceof MouseEvent) {
                sliderLeft.current = Math.min(
                    Math.max(0, e.clientX - startX.current),
                    containerWidth.current,
                );
            }
            updateSliderStyle();
        }
    }

    function handleStopDrag() {
        if (!isMounted() || isUnlocked) return;
        if (isDragging.current) {
            isDragging.current = false;
            if (sliderLeft.current > containerWidth.current * 0.9) {
                sliderLeft.current = containerWidth.current;
                if (props.onSuccess) {
                    props.onSuccess();
                    onSuccess();
                }
            } else {
                sliderLeft.current = 0;
                if (props.onFailure) {
                    props.onFailure();
                }
            }
            updateSliderStyle();
        }
    }

    function handleStartDrag(e: React.MouseEvent<HTMLDivElement>) {
        if (!isMounted() || isUnlocked) return;
        isDragging.current = true;
        if (!isTouchDevice) {
            startX.current = e.clientX;
        }
    }

    function handleTouchStartDrag(e: React.TouchEvent<HTMLDivElement>) {
        if (!isMounted() || isUnlocked) return;
        isDragging.current = true;
        if (isTouchDevice) {
            startX.current = e.touches[0].clientX;
        }
    }
    function updateSliderStyle() {
        if (!isMounted() || isUnlocked) return;
        if (slider.current)
            slider.current.style.left = sliderLeft.current + 50 + 'px';
    }

    function onSuccess() {
        if (container.current)
            container.current.style.width =
                container.current.clientWidth + 'px';
        setUnlocked(true);
    }

    function getText() {
        return isUnlocked ? props.unlockedText : props.text;
    }

    return (
        <div className={styles.button}>
            <div
                className={classNames(styles['button__container'], {
                    [styles['button__container--unlocked']]: isUnlocked,
                })}
                ref={container}
            >
                <div
                    className={styles['button__container__slider']}
                    onMouseDown={handleStartDrag}
                    style={{ background: props.color }}
                    onTouchStart={handleTouchStartDrag}
                    ref={slider}
                >
                    <span
                        className={classNames(
                            styles['button__container__slider__text'],
                            {
                                [styles['button__container__slider__text--nl']]:
                                    props.language === 'nl',
                            },
                        )}
                    >
                        {props.sliderText}
                    </span>
                    <span
                        className={styles['button__container__slider__arrow']}
                    ></span>
                    <span
                        className={styles['button__container__slider__circle']}
                        style={{ background: props.color }}
                    ></span>
                </div>
                <div className={styles['button__container__text']}>
                    {getText()}
                </div>
            </div>
        </div>
    );
}

export default SwipeableButton;
