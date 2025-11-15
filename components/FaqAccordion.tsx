"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { QA } from '@/types';

const FaqItem = ({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="text-md font-semibold text-gray-800">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="text-sm text-gray-600 prose max-w-none">{answer}</div>
        </div>
      </div>
    </div>
  );
};

export default function FaqAccordion({
  qa,
  title,
  fullWidth = false,
}: {
  qa: QA[];
  title?: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "" : "max-w-3xl mx-auto"}>
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {qa.map((item, i) => (
        <FaqItem key={i} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
