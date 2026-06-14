import { useState, useEffect } from 'react';

export function useTypewriter(text: string, speed: number = 38, startDelay: number = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Reset state when inputs change
    setDisplayed('');
    setDone(false);

    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setDisplayed((prev) => {
          const nextLength = prev.length + 1;
          if (nextLength <= text.length) {
            return text.slice(0, nextLength);
          } else {
            setDone(true);
            clearInterval(intervalId);
            return prev;
          }
        });
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
