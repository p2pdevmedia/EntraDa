import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
