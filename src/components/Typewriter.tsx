import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const Typewriter = ({ text, delay = 0, speed = 50, className = '', onComplete }: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let mistakeChar = '';

    const type = () => {
      if (currentIndex >= text.length) {
        if (onComplete) onComplete();
        return;
      }

      const char = text[currentIndex];
      const shouldMakeMistake = !isDeleting && !mistakeChar && Math.random() > 0.9 && currentIndex < text.length - 1;

      if (shouldMakeMistake) {
        const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        mistakeChar = randomChar;
        setDisplayedText(currentText + randomChar);
        setTimeout(type, speed * 2);
      } else if (mistakeChar) {
        // Backspace the mistake
        mistakeChar = '';
        setDisplayedText(currentText);
        setTimeout(type, speed);
      } else {
        currentText += char;
        setDisplayedText(currentText);
        currentIndex++;
        setTimeout(type, speed);
      }
    };

    type();
  }, [started, text, speed, onComplete]);

  return <span className={className}>{displayedText}</span>;
};

export default Typewriter;
