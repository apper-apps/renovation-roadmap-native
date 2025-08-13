import { useParams } from "react-router-dom";
import QuizInterface from "@/components/organisms/QuizInterface";
import ApperIcon from "@/components/ApperIcon";

const QuizPage = () => {
  const { id } = useParams();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Quizzes
          </button>
        </div>

        <QuizInterface quizId={id} />
      </div>
    </div>
  );
};

export default QuizPage;