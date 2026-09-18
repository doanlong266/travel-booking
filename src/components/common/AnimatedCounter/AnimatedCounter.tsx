import React, { useEffect, useState, useRef } from 'react';
import { animate } from 'framer-motion';

export interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number; // in seconds, default 1.2s
  progress?: number; // optional manual progress (0 to 1) for lockstep sync
  formatter?: (val: number) => string;
  className?: string;
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  duration = 1.2,
  progress,
  formatter = (val) => val.toLocaleString('vi-VN'),
  className = '',
  suffix = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(from !== undefined ? from : to);
  const prevValueRef = useRef<number>(from !== undefined ? from : to);

  // When manual progress is provided, calculate lockstep interpolation
  useEffect(() => {
    if (progress !== undefined) {
      const baseFrom = from !== undefined ? from : prevValueRef.current;
      const interpolated = Math.round(baseFrom + (to - baseFrom) * Math.min(1, Math.max(0, progress)));
      setDisplayValue(interpolated);
    }
  }, [progress, from, to]);

  // When progress is not provided, run smooth framer-motion animation on `to` change
  useEffect(() => {
    if (progress !== undefined) return;

    const startVal = prevValueRef.current;
    if (startVal === to) {
      setDisplayValue(to);
      return;
    }

    const controls = animate(startVal, to, {
      duration,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
      onComplete: () => {
        prevValueRef.current = to;
      },
    });

    return () => controls.stop();
  }, [to, duration, progress]);

  return (
    <span className={`animated-counter ${className}`}>
      {formatter(displayValue)}
      {suffix ? ` ${suffix}` : ''}
    </span>
  );
};
