"use client";

import { Dispatch, SetStateAction, ReactNode } from 'react';

interface FormInputProps<T> {
  name: keyof T;
  label: string;
  icon: ReactNode;
  state: T;
  setState: Dispatch<SetStateAction<T>>;
  type?: string;
  required?: boolean;
}

export default function FormInput<T>({
  name,
  label,
  icon,
  state,
  setState,
  type = 'text',
  required = true
}: FormInputProps<T>) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [name]: e.target.value });
  };

  return (
    <div className="relative">
      <label htmlFor={String(name)} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          {icon}
        </span>
        <input
          type={type}
          id={String(name)}
          name={String(name)}
          value={String(state[name] || '')}
          onChange={handleChange}
          required={required}
          className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
}