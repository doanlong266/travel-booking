import { useEffect, useRef, useState, useCallback } from 'react';

interface UseChatScrollOptions {
  threshold?: number; // Distance in px from bottom to consider "at bottom"
}

export const useChatScroll = <T extends HTMLElement = HTMLDivElement>(
  dependencies: any[] = [],
  options: UseChatScrollOptions = {}
) => {
  const { threshold = 100 } = options;
  const scrollRef = useRef<T | null>(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsScrolledUp(distanceFromBottom > threshold);
  }, [threshold]);

  // Auto-scroll when dependencies change, only if user is already at the bottom
  useEffect(() => {
    if (!isScrolledUp) {
      scrollToBottom(true);
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    scrollRef,
    isScrolledUp,
    scrollToBottom,
    handleScroll
  };
};
