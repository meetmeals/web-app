import React from 'react';
import { useDispatch } from 'react-redux';

import { useIsMounted } from 'utilities/hooks';
import { setCountdownTimer } from 'stores/platform';

type CountdownTimerProps = {
  seconds: number;
  onFinish: () => void;
};

const TIMER_INTERVAL = 1000;

export default function CountdownTimer(props: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState<number>(props.seconds);
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  const { onFinish } = props;

  React.useEffect(() => {
    if (timeLeft === 0) {
      dispatch(setCountdownTimer(0));
      onFinish();
      return;
    }
    const timer = setTimeout(() => {
      if (timeLeft > 0 && isMounted()) {
        setTimeLeft((prev) => prev - 1);
      }
    }, TIMER_INTERVAL);

    return () => {
      dispatch(setCountdownTimer(timeLeft));
      clearTimeout(timer);
    };
  }, [dispatch, timeLeft, isMounted, onFinish]);

  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;

  const minutesLeftPaddedWithZero = minutesLeft.toString().padStart(2, '0');
  const secondsLeftPaddedWithZero = secondsLeft.toString().padStart(2, '0');

  return (
    <span>
      {minutesLeftPaddedWithZero}:{secondsLeftPaddedWithZero}
    </span>
  );
}
