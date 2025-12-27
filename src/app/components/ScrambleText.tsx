import { useEffect, useState, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export function ScrambleText({ text, className }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    let iteration = 0;
    
    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    const scramble = () => {
      // Calculate progress (0 to 1)
      const progress = Math.min(iteration / text.length, 1);
      
      // Update text
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            
            if (index < iteration) {
              return text[index];
            }
            
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        return; // Animation complete
      }

      // Calculate next delay - start fast, end slow
      // Using quadratic easing for smooth deceleration
      const baseDelay = 25;
      const addedDelay = 60; // Max added delay at the end
      const nextDelay = baseDelay + (progress * progress * addedDelay);
      
      // Scale increment based on text length so animation duration is consistent
      // Target: ~15-20 frames total regardless of text length
      // Minimum increment of 0.5 for very short text
      const increment = Math.max(0.5, text.length / 15);
      iteration += increment;
      
      timeoutRef.current = setTimeout(scramble, nextDelay);
    };

    scramble();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text]);

  return (
    // Use relative positioning for the container so the absolute overlay
    // sits exactly on top of the ghost text.
    // overflow-hidden prevents the scramble text from visually overlapping other elements.
    <h1 
      className={`${className} relative block overflow-hidden`} 
    >
      {/* Ghost text - invisible but defines the layout size */}
      <span className="invisible">{text}</span>
      
      {/* Animated text - absolute positioned over the ghost text */}
      <span className="absolute top-0 left-0 w-full">{displayText}</span>
    </h1>
  );
}
