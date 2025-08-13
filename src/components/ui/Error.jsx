import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry, className }) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="bg-error/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-error" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message || "We couldn't load the content. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
        >
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;