import React, { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  skip?: boolean;
  as?: 'p' | 'span' | 'div';
}

const TypewriterText: React.FC<Props> = ({
  text, speed = 30, className = '', onComplete, skip = false, as: Tag = 'p'
}) => {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<number>();
  const idxRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const textRef = useRef(text);

  // Keep callback ref current without causing re-renders
  onCompleteRef.current = onComplete;
  textRef.current = text;

  // === MAIN TYPING EFFECT ===
  // Only re-runs when `text` changes (new dialogue), NOT on every parent render
  useEffect(() => {
    setDisplayed('');
    setIsComplete(false);
    idxRef.current = 0;

    if (skip || speed <= 0) {
      setDisplayed(text);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    const chars = text.split('');
    const type = () => {
      if (idxRef.current < chars.length) {
        setDisplayed(chars.slice(0, idxRef.current + 1).join(''));
        idxRef.current++;
        let delay = speed;
        const ch = chars[idxRef.current - 1];
        if (ch === '。' || ch === '！' || ch === '？' || ch === '\n') delay = speed * 4;
        else if (ch === '，' || ch === '；' || ch === '：') delay = speed * 2;
        timerRef.current = window.setTimeout(type, delay);
      } else {
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    };
    timerRef.current = window.setTimeout(type, 100);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  // === SKIP EFFECT ===
  // Reacts when parent sets `skip=true` (user clicked to skip typing)
  useEffect(() => {
    if (skip && !isComplete) {
      clearTimeout(timerRef.current);
      setDisplayed(textRef.current);
      setIsComplete(true);
      onCompleteRef.current?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  const handleClick = () => {
    if (isComplete) return;
    clearTimeout(timerRef.current);
    setDisplayed(textRef.current);
    setIsComplete(true);
    onCompleteRef.current?.();
  };

  return (
    <Tag className={className} onClick={handleClick}>
      {displayed}
      {!isComplete && <span className="typewriter-cursor" />}
    </Tag>
  );
};

export default TypewriterText;
