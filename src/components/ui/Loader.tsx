interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loader = ({ size = 'md', className = '' }: LoaderProps) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizes[size]} ${className}`}
      />
    </div>
  );
};

export default Loader;
