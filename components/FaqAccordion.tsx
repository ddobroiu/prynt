"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { QA } from "@/types";

interface FaqAccordionProps {
  qa: QA[];
}

export default function FaqAccordion({ qa }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {qa.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
            >
              <span className="text-sm font-bold text-gray-900">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="p-4 pt-0 text-sm text-gray-600">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}