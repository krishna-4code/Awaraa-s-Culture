"use client";

import React from "react";
import { MessageCircle, ArrowRight } from "lucide-react";

interface InstagramOrderButtonProps {
  onClick: (e: React.FormEvent) => void;
  isProcessing: boolean;
  disabled?: boolean;
  className?: string;
}

export function InstagramOrderButton({
  onClick,
  isProcessing,
  disabled = false,
  className = "",
}: InstagramOrderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isProcessing || disabled}
      aria-busy={isProcessing}
      className={`cpg-button-primary w-full justify-center py-4 text-sm mt-2 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed bg-[#E1306C] hover:bg-[#C13584] text-white border-transparent cursor-pointer transition-all ${className}`}
    >
      {isProcessing ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Preparing Order for Instagram...
        </span>
      ) : (
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span>Order via Instagram</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </button>
  );
}
