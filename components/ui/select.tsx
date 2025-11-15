// components/ui/select.tsx
"use client";
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type SelectContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  onValueChange?: (value: string) => void;
  placeholder?: string;
};

const SelectContext = createContext<SelectContextType | null>(null);

const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("useSelect must be used within a Select provider");
  }
  return context;
};

export const Select = ({
  children,
  onValueChange,
  value: controlledValue,
  defaultValue = "",
  placeholder,
}: {
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(controlledValue ?? defaultValue);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedValue(controlledValue);
    }
  }, [controlledValue]);

  const handleValueChange = (value: string) => {
    if (controlledValue === undefined) {
      setSelectedValue(value);
    }
    if (onValueChange) {
      onValueChange(value);
    }
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, selectedValue, setSelectedValue: handleValueChange, onValueChange: handleValueChange, placeholder }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { isOpen, setIsOpen } = useSelect();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <button
      ref={ref}
      onClick={() => setIsOpen(!isOpen)}
      className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left border border-gray-300 rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 ${className}`}
    >
      {children}
      <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>
  );
};

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { selectedValue, placeholder: contextPlaceholder } = useSelect();
  return <span>{selectedValue || placeholder || contextPlaceholder}</span>;
};

export const SelectContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { isOpen } = useSelect();
  if (!isOpen) return null;
  return (
    <div
      className={`absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-1 ${className}`}
    >
      {children}
    </div>
  );
};

export const SelectItem = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) => {
  const { setSelectedValue } = useSelect();
  return (
    <div
      onClick={() => setSelectedValue(value)}
      className={`px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
    >
      {children}
    </div>
  );
};
