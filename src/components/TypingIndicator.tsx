
import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-4 px-4 mb-4">
      <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center text-primary shadow-sm border border-primary/20">
        <span className="text-lg">🤖</span>
      </div>
      <div className="rounded-2xl bg-secondary px-4 py-3 text-secondary-foreground max-w-[70%]">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
