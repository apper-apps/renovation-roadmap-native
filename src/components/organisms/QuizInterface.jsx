import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { getQuizById } from "@/services/api/quizService";
import { getProfessionals } from "@/services/api/professionalService";

const QuizInterface = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [quizData, professionalsData] = await Promise.all([
        getQuizById(quizId),
        getProfessionals()
      ]);
      setQuiz(quizData);
      setProfessionals(professionalsData);
    } catch (err) {
      setError("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [quizId]);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    if (!quiz.results) {
      setResults([]);
      setShowResults(true);
      return;
    }

    // Simple scoring system - in real app this would be more sophisticated
    const scores = {};
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = quiz.questions.find(q => q.Id === parseInt(questionId));
      if (question && question.scoring) {
        Object.entries(question.scoring[answer] || {}).forEach(([profId, points]) => {
          scores[profId] = (scores[profId] || 0) + points;
        });
      }
    });

    // Get top professionals based on scores
    const sortedProfessionals = professionals
      .filter(prof => scores[prof.Id] > 0)
      .sort((a, b) => (scores[b.Id] || 0) - (scores[a.Id] || 0))
      .slice(0, 2);

    setResults(sortedProfessionals);
    setShowResults(true);
    toast.success("Quiz completed! Here are your recommendations.");
  };

  const shareResults = (platform) => {
    const text = `I just completed the "${quiz.title}" quiz on Renovation Roadmap and got my professional recommendations!`;
    const url = window.location.href;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!quiz) return <Error message="Quiz not found" />;

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-success/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-bounce-in">
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-3xl font-display font-bold text-primary mb-4">
            Quiz Complete!
          </h2>
          <p className="text-lg text-gray-600">
            Based on your answers, here are the professionals we recommend you contact first:
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {results.map((professional, index) => (
              <div key={professional.Id} className="card text-center">
                <div className="relative">
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
                      Best Match
                    </div>
                  )}
                  <img 
                    src={professional.logoUrl} 
                    alt={`${professional.name} logo`}
                    className="h-16 max-w-[200px] object-contain mx-auto mb-4"
                  />
                  <h3 className="text-xl font-display font-semibold text-primary mb-2">
                    {professional.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {professional.category}
                  </p>
                  <Button 
                    variant="primary"
                    onClick={() => navigate(`/professional/${professional.Id}`)}
                    className="w-full"
                  >
                    View Profile & Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center card mb-8">
            <p className="text-lg text-gray-600 mb-4">
              Based on your project, you might benefit from consulting with multiple professionals. 
              We recommend starting with a builder who can guide you through the process.
            </p>
            <Button 
              variant="primary"
              onClick={() => navigate("/professional/1")}
            >
              Contact JCC Build
            </Button>
          </div>
        )}

        <div className="card">
          <div className="text-center mb-6">
            <h3 className="text-xl font-display font-semibold text-primary mb-2">
              Share Your Results
            </h3>
            <p className="text-gray-600">
              Let others know about Renovation Roadmap!
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => shareResults('facebook')}
            >
              <ApperIcon name="Facebook" className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => shareResults('twitter')}
            >
              <ApperIcon name="Twitter" className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => shareResults('linkedin')}
            >
              <ApperIcon name="Linkedin" className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="accent"
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setShowResults(false);
                setResults([]);
              }}
            >
              <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button 
              variant="primary"
              onClick={() => navigate("/quizzes")}
            >
              <ApperIcon name="List" className="h-4 w-4 mr-2" />
              More Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="card mb-8">
        <h2 className="text-2xl font-display font-bold text-primary mb-6">
          {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                answers[currentQ.Id] === option
                  ? "border-primary bg-primary/5"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQ.Id}`}
                value={option}
                checked={answers[currentQ.Id] === option}
                onChange={(e) => handleAnswer(currentQ.Id, e.target.value)}
                className="mr-4 text-primary"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!answers[currentQ.Id]}
        >
          {currentQuestion === quiz.questions.length - 1 ? (
            <>
              <ApperIcon name="CheckCircle" className="h-4 w-4 mr-2" />
              Get Results
            </>
          ) : (
            <>
              Next
              <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuizInterface;