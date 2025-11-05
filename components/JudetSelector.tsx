"use client";

import { SelectHTMLAttributes } from 'react';

interface JudetSelectorProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function JudetSelector({ label, id, options, value, onChange, ...props }: JudetSelectorProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 pl-3 pr-10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        {...props}
      >
        <option value="" disabled>Selectează un județ</option>
        {options.map((judet) => (
          <option key={judet} value={judet}>
            {judet}
          </option>
        ))}
      </select>
    </div>
  );
}