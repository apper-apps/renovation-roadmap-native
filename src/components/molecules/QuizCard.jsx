import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();

  const handleTakeQuiz = () => {
    navigate(`/quiz/${quiz.Id}`);
  };

  return (
    <div className="card group cursor-pointer" onClick={handleTakeQuiz}>
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={quiz.imageUrl} 
          alt={quiz.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button variant="accent" size="sm" className="w-full">
              <ApperIcon name="Play" className="h-4 w-4 mr-2" />
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-display font-semibold text-primary mb-3 group-hover:text-accent transition-colors">
        {quiz.title}
      </h3>
      
      <p className="text-gray-600 mb-4">
        {quiz.description}
      </p>
      
      <div className="flex items-center text-sm text-gray-500">
        <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
        <span>{quiz.estimatedTime} minutes</span>
      </div>
    </div>
  );
};

export default QuizCard;