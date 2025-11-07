
import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = +targetDate - +new Date();
  let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isOver: false
    };
  }

  return timeLeft;
};

export const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  return timeLeft;
};
