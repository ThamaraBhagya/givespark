// /components/ui/button.tsx
import React from 'react';

// Define the properties (props) the Button component can accept
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // You can add more props here later (e.g., variant, size, loadingState)
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, ...props }, ref) => {
    return (
      <button
        className={`
          inline-flex items-center justify-center 
          rounded-md text-sm font-medium 
          transition-colors 
          h-10 px-4 py-2 
          bg-indigo-600 text-white 
          hover:bg-indigo-700 
          disabled:opacity-50 disabled:cursor-not-allowed 
          ${className} 
        `}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };