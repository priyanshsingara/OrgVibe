import { useEffect, useState, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export function ScrambleText({ text, className }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    let iteration = 0;
    
    clearInterval(intervalRef.current);
    
    const speed = Math.max(0.5, text.length / 25);
    
    intervalRef.current = setInterval(() => {
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
        clearInterval(intervalRef.current);
      }
      
      iteration += speed;
    }, 30);

    return () => clearInterval(intervalRef.current);
  }, [text]);

  return (
    // Use CSS Grid to stack the text perfectly. 
    // This allows the container to size based on the LARGEST content (either ghost or animated),
    // preventing the "clash" where animated text overflows.
    <h1 
      className={`${className} grid`} 
      style={{ gridTemplateAreas: '"stack"' }}
    >
      <span className="invisible" style={{ gridArea: 'stack' }}>{text}</span>
      <span style={{ gridArea: 'stack' }}>{displayText}</span>
    </h1>
  );
}
