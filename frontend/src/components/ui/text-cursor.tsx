"use client";

import { useEffect, useState } from "react";

interface TextCursorProps {
  words: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

export function TextCursor({
  words,
  typingSpeed = 90,
  pauseDuration = 2200,
  className = "",
  cursorClassName = "bg-primary",
}: TextCursorProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetWord = words[currentWordIndex] || "";

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < targetWord.length) {
            setCurrentText(targetWord.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(targetWord.slice(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? typingSpeed / 2 : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, pauseDuration]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{currentText}</span>
      <span
        className={`ml-1 inline-block h-[1.1em] w-[2px] animate-pulse rounded-full align-middle ${cursorClassName}`}
        aria-hidden="true"
      />
    </span>
  );
}
