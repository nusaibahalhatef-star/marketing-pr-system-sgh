import React from 'react';
export const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const variants = {
    default: 'bg-[#004A99] text-white hover:bg-[#003366]',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-12 px-8'
  };
  return (
    <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
