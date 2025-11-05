"use client";

import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export default function FormInput({ label, id, icon, ...props }: FormInputProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full bg-gray-800 border border-gray-600 rounded-lg py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${icon ? 'pl-10' : 'pl-4'} pr-4`}
          {...props}
        />
      </div>
    </div>
  );
}