import React from 'react';

function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callbackFunction: () => void,
) {
  React.useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callbackFunction();
      }
    };

    document.addEventListener('mousedown', handleClickOutSide);

    return () => {
      document.removeEventListener('mousedown', handleClickOutSide);
    };
  }, [ref, callbackFunction]);
}

export default useClickOutside;
