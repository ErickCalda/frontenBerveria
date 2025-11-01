import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'white', 
  text = '', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 border-${color} border-t-transparent rounded-full animate-spin`}
        style={{
          borderColor: color === 'white' ? '#ffffff' : color,
          borderTopColor: 'transparent'
        }}
      ></div>
      {text && (
        <span className={`${textSizeClasses[size]} text-${color}`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;

