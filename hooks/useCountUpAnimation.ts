import { useState, useEffect, useRef } from 'react';

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const useCountUpAnimation = (targetValue: number, duration: number = 500): number => {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef<number>(targetValue);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }

      const elapsedTime = timestamp - startTimeRef.current;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentValue = startValueRef.current + (targetValue - startValueRef.current) * easedProgress;
      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure the final value is exactly the target value
        setDisplayValue(targetValue);
        startValueRef.current = targetValue;
      }
    };

    // Only start animation if the target value has changed
    if (startValueRef.current !== targetValue) {
        startTimeRef.current = undefined; // Reset start time for new animation
        startValueRef.current = displayValue; // Start from the current displayed value
        requestRef.current = requestAnimationFrame(animate);
    } else {
        // If target is the same, just ensure display is correct
        setDisplayValue(targetValue);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [targetValue, duration, displayValue]); // Rerun effect if targetValue or duration changes

  return displayValue;
};
