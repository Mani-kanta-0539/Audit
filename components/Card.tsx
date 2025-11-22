
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, noPadding = false }) => {
  return (
    <div
      className={`bg-light-card dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-gray-800 shadow-soft hover:shadow-md transition-shadow duration-300 ${noPadding ? '' : 'p-6 md:p-8'} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
