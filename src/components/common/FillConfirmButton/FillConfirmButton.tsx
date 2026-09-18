import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface FillConfirmButtonProps {
  onComplete: () => void;
  duration?: number; // duration in seconds for click mode (default 1.2s)
  holdDuration?: number; // duration in seconds for hold mode (default 1.5s)
  holdToConfirm?: boolean; // toggle hold mode vs click mode
  label?: React.ReactNode;
  fillingLabel?: React.ReactNode;
  successLabel?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onProgressChange?: (progress: number) => void;
  enableConfetti?: boolean;
}

export const FillConfirmButton: React.FC<FillConfirmButtonProps> = ({
  onComplete,
  duration = 1.2,
  holdDuration = 1.5,
  holdToConfirm = false,
  label = 'Xác Nhận Đổi Ngay',
  fillingLabel,
  successLabel = 'Đổi Điểm Thành Công!',
  icon,
  disabled = false,
  className = '',
  onProgressChange,
  enableConfetti = true,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFilling, setIsFilling] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const rafRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const isCompletedRef = useRef<boolean>(false);

  // Sync ref with state & external callback
  const updateProgress = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    progressRef.current = clamped;
    setProgress(clamped);
    onProgressChange?.(clamped);
  }, [onProgressChange]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Trigger confetti burst around modal/button
  const triggerConfetti = useCallback(() => {
    if (!enableConfetti) return;
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#f59e0b', '#ea580c', '#10b981', '#3b82f6', '#8b5cf6'],
        disableForReducedMotion: true,
      });
    } catch {
      // Fallback silently if canvas is unavailable
    }
  }, [enableConfetti]);

  // Trigger success state and morphing
  const handleSuccess = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setIsFilling(false);
    setIsSuccess(true);
    setIsShaking(true);

    // Stop shaking after 220ms
    setTimeout(() => {
      setIsShaking(false);
    }, 220);

    triggerConfetti();

    // Call onComplete after 400ms transition
    setTimeout(() => {
      onComplete();
    }, 450);
  }, [onComplete, triggerConfetti]);

  // --------------------------------------------------------------------------
  // Mode 1: Click-to-Fill (Default 1.2s)
  // --------------------------------------------------------------------------
  const startClickFill = useCallback(() => {
    if (disabled || isFilling || isSuccess || isCompletedRef.current) return;

    setIsFilling(true);
    const startMs = performance.now();
    const totalMs = duration * 1000;

    const step = (now: number) => {
      const elapsed = now - startMs;
      const current = Math.min(1, elapsed / totalMs);
      updateProgress(current);

      if (current < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        handleSuccess();
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [disabled, isFilling, isSuccess, duration, updateProgress, handleSuccess]);

  // --------------------------------------------------------------------------
  // Mode 2: Hold-to-Confirm (1.5s hold, spring back on early release)
  // --------------------------------------------------------------------------
  const startHold = useCallback(() => {
    if (disabled || isSuccess || isCompletedRef.current) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    setIsFilling(true);
    const totalMs = holdDuration * 1000;
    const initialProgress = progressRef.current;
    const startMs = performance.now() - (initialProgress * totalMs);

    const step = (now: number) => {
      const elapsed = now - startMs;
      const current = Math.min(1, elapsed / totalMs);
      updateProgress(current);

      if (current < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        handleSuccess();
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [disabled, isSuccess, holdDuration, updateProgress, handleSuccess]);

  const stopHold = useCallback(() => {
    if (isSuccess || isCompletedRef.current) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    setIsFilling(false);

    // Spring / smooth bounce back to 0
    const startMs = performance.now();
    const currentP = progressRef.current;
    const decayMs = 280; // Rapid spring recoil

    const stepDecay = (now: number) => {
      const elapsed = now - startMs;
      const factor = Math.min(1, elapsed / decayMs);
      // Ease-out deceleration
      const decayed = currentP * (1 - factor);
      updateProgress(decayed);

      if (factor < 1 && decayed > 0.01) {
        rafRef.current = requestAnimationFrame(stepDecay);
      } else {
        updateProgress(0);
      }
    };

    rafRef.current = requestAnimationFrame(stepDecay);
  }, [isSuccess, updateProgress]);

  // Dynamic labels based on state and mode
  const defaultFillingLabel = holdToConfirm
    ? `Đang giữ để xác nhận (${Math.round(progress * 100)}%)...`
    : 'Đang xử lý đổi quà...';

  const currentLabel = isSuccess
    ? successLabel
    : isFilling
    ? (fillingLabel || defaultFillingLabel)
    : label;

  const defaultIcon = isSuccess ? (
    <CheckCircle size={17} />
  ) : isFilling ? (
    <Sparkles size={17} />
  ) : (
    icon || <Gift size={17} />
  );

  return (
    <motion.button
      type="button"
      disabled={disabled || isSuccess}
      aria-label={typeof label === 'string' ? label : 'Fill Confirm Button'}
      onClick={!holdToConfirm ? startClickFill : undefined}
      onPointerDown={holdToConfirm ? startHold : undefined}
      onPointerUp={holdToConfirm ? stopHold : undefined}
      onPointerLeave={holdToConfirm ? stopHold : undefined}
      onContextMenu={(e) => holdToConfirm && e.preventDefault()}
      animate={
        isShaking
          ? {
              x: [-3, 3, -2, 2, -1, 1, 0],
              scale: [1, 1.04, 1],
              transition: { duration: 0.22 },
            }
          : isSuccess
          ? { scale: [1, 1.03, 1] }
          : {}
      }
      className={`fill-button ${isFilling ? 'fill-button--filling' : ''} ${
        holdToConfirm ? 'fill-button--hold-mode' : ''
      } ${isSuccess ? 'fill-button--success' : ''} ${
        isShaking ? 'fill-button--shake' : ''
      } ${className}`}
      style={{ willChange: 'transform' }}
    >
      {/* Liquid Fill Track (GPU hardware accelerated via scaleX) */}
      <span className="fill-button__liquid-track">
        <span
          className="fill-button__liquid-progress"
          style={{
            transform: `scaleX(${progress})`,
            willChange: 'transform',
          }}
        />
      </span>

      {/* Button Inner Content (Elevated z-index) */}
      <span className="fill-button__content">
        <span className="fill-button__icon">{defaultIcon}</span>
        <span className="fill-button__label">{currentLabel}</span>
      </span>
    </motion.button>
  );
};
