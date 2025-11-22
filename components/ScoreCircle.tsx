
import React, { useEffect, useState } from 'react';

interface ScoreCircleProps {
  score: number;
  label: string;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, label }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setAnimatedScore(score));
    return () => cancelAnimationFrame(animation);
  }, [score]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 50) return 'text-error';
    if (s < 80) return 'text-warning';
    return 'text-accent';
  };
  
  const getStrokeColor = (s: number) => {
    if (s < 50) return 'stroke-error';
    if (s < 80) return 'stroke-warning';
    return 'stroke-accent';
  };

  const colorClass = getColor(score);
  const strokeColorClass = getStrokeColor(score);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="stroke-current text-gray-200 dark:text-gray-700"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className={`transform -rotate-90 origin-center transition-all duration-1000 ease-out ${strokeColorClass}`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center font-display font-bold text-3xl ${colorClass}`}>
          {score}
        </div>
      </div>
      <span className="font-semibold text-light-text dark:text-dark-text">{label}</span>
    </div>
  );
};

export default ScoreCircle;
