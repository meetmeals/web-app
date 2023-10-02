import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';

import styles from './multi-range-slider.module.scss';

type MultiRangeSliderProps = {
    min: number;
    max: number;
    initialMin: number;
    initialMax: number;
    onChange: Dispatch<SetStateAction<{ min: number; max: number }>>;
};

function MultiRangeSlider(props: MultiRangeSliderProps) {
    const [minVal, setMinVal] = React.useState<number>(props.initialMin);
    const [maxVal, setMaxVal] = React.useState<number>(props.initialMax);
    const minValRef = React.useRef<HTMLInputElement>(null);
    const maxValRef = React.useRef<HTMLInputElement>(null);
    const range = React.useRef<HTMLDivElement>(null);

    // Convert to percentage
    const getPercent = React.useCallback(
        (value: number) =>
            Math.round(((value - props.min) / (props.max - props.min)) * 100),
        [props.min, props.max],
    );

    // Set width of the range to decrease from the left side
    React.useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value);

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    React.useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    React.useEffect(() => {
        props.onChange({ min: minVal, max: maxVal });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minVal, maxVal, props.onChange]);

    return (
        <div className={styles.container}>
            <input
                type="range"
                min={props.min}
                max={props.max}
                value={minVal}
                ref={minValRef}
                onChange={(event) => {
                    const value = Math.min(+event.target.value, maxVal - 1);
                    setMinVal(value);
                    event.target.value = value.toString();
                }}
                className={classNames(
                    styles['container__thumb'],
                    styles['container__thumb--zindex-3'],
                    {
                        [styles['container__thumb--zindex-5']]:
                            minVal > props.max - 100,
                    },
                )}
            />
            <input
                type="range"
                min={props.min}
                max={props.max}
                value={maxVal}
                ref={maxValRef}
                onChange={(event) => {
                    const value = Math.max(+event.target.value, minVal + 1);
                    setMaxVal(value);
                    event.target.value = value.toString();
                }}
                className={classNames(
                    styles['container__thumb'],
                    styles['container__thumb--zindex-4'],
                )}
            />

            <div className={styles['container__slider']}>
                <div className={styles['container__slider__track']} />
                <div
                    ref={range}
                    className={styles['container__slider__range']}
                />
            </div>
        </div>
    );
}

export default MultiRangeSlider;
