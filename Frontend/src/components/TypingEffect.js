import React, { useEffect, useState } from 'react';


const TypingEffect = ({ phrases }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 100; // Adjust the typing speed here

  useEffect(() => {
    const type = () => {
      const currentPhrase = phrases[index];
      setText(isDeleting ? currentPhrase.substring(0, text.length - 1) : currentPhrase.substring(0, text.length + 1));

      if (!isDeleting && text === currentPhrase) {
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setIndex((index + 1) % phrases.length);
      }
    };

    const timer = setTimeout(type, typingSpeed);

    return () => clearTimeout(timer);
  }, [index, text, isDeleting, phrases, typingSpeed]);

  return (
    <div className="typing-effect">
      {text}
    </div>
  );
};

export default TypingEffect;
