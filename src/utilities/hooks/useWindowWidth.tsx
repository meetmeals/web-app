import React from 'react';

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = React.useState<number>(
    window.innerWidth,
  );

  React.useLayoutEffect(() => {
    function updateWidth() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return windowWidth;
}

export default useWindowWidth;
