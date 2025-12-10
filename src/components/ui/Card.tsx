import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50',
      bordered: 'bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700',
      elevated: 'bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50',
    };

    return (
      <div
        ref={ref}
        className={`${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
