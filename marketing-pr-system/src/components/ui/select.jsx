import React from 'react';
export const Select = ({ value, onValueChange, children }) => {
  const handleChange = (e) => onValueChange(e.target.value);
  return <div className="relative w-full"><select value={value} onChange={handleChange} className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#004A99] appearance-none">{children}</select></div>;
};
export const SelectTrigger = ({ children, className = '' }) => <div className={`flex items-center justify-between ${className}`}>{children}</div>;
export const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
