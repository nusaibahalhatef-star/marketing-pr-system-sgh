import React from 'react';
export const Dialog = ({ open, children }) => open ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">{children}</div> : null;
export const DialogContent = ({ children, className = '' }) => <div className={`relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg ${className}`}>{children}</div>;
export const DialogHeader = ({ children, className = '' }) => <div className={`mb-4 flex flex-col space-y-1.5 text-right ${className}`}>{children}</div>;
export const DialogTitle = ({ children, className = '' }) => <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
export const DialogDescription = ({ children, className = '' }) => <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
export const DialogFooter = ({ children, className = '' }) => <div className={`mt-6 flex justify-end gap-2 ${className}`}>{children}</div>;
