import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card">
      <button
        className="w-full text-left flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-display font-semibold text-primary pr-4">
          {question}
        </h3>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="h-5 w-5 text-primary flex-shrink-0 transition-transform duration-200"
        />
      </button>
      
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-gray-700 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;