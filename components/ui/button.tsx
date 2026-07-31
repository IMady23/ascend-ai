import React from 'react';

export function Button({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`px-4 py-2 bg-emerald-500 text-primary rounded-md hover:bg-emerald-600 ${className || ''}`} {...props}>
      {children}
    </button>
  );
}
