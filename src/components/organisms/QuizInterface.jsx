import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import { getProfessionals } from "@/services/api/professionalService";
import { getQuizById } from "@/services/api/quizService";

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

  // Progress saving effect - must be called before any early returns
  useEffect(() => {
    if (quiz?.Id) {
      const progressData = {
        currentQuestion,
        answers,
        timestamp: Date.now()
      };
      sessionStorage.setItem(`quiz_${quiz.Id}_progress`, JSON.stringify(progressData));
    }
  }, [currentQuestion, answers, quiz?.Id]);

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
    // Calculate scores based on all answers
    const scores = {};
    const responses = [];
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = quiz.questions.find(q => q.Id === parseInt(questionId));
      if (question && question.scoring) {
        responses.push({ questionId: parseInt(questionId), answer });
        Object.entries(question.scoring[answer] || {}).forEach(([category, points]) => {
          scores[category] = (scores[category] || 0) + points;
        });
      }
    });

    // Determine outcome based on quiz type and scores
    let outcome = null;
    let recommendedProfessionals = [];
    let outcomeData = null;

    if (quiz.outcomes && quiz.outcomes.length > 0) {
      // Find the outcome with highest score
      const topCategory = Object.entries(scores)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (topCategory) {
        const [category] = topCategory;
        
        // Find matching outcome
        outcome = quiz.outcomes.find(o => 
          o.type.includes(category) || 
          category.includes(o.type.split('_')[0])
        ) || quiz.outcomes[0];
        
        outcomeData = outcome;

        // Get recommended professionals based on outcome
        if (outcome.recommendedProfessionals) {
          recommendedProfessionals = professionals.filter(prof => 
            outcome.recommendedProfessionals.includes(prof.Id)
          );
        }
      }
    }

    // Fallback to professional-based scoring for "Who Should I Call First" quiz
    if (quiz.Id === 1 && recommendedProfessionals.length === 0) {
      const professionalScores = {};
      
      Object.entries(answers).forEach(([questionId, answer]) => {
        const question = quiz.questions.find(q => q.Id === parseInt(questionId));
        if (question && question.scoring) {
          Object.entries(question.scoring[answer] || {}).forEach(([category, points]) => {
            // Map categories to professional IDs
            let profId = null;
            if (category === 'builder') profId = 1;
            else if (category === 'architect') profId = 2; 
            else if (category === 'designer') profId = 3;
            
            if (profId) {
              professionalScores[profId] = (professionalScores[profId] || 0) + points;
            }
          });
        }
      });

      // Get top 2 professionals
      recommendedProfessionals = professionals
        .filter(prof => professionalScores[prof.Id] > 0)
        .sort((a, b) => (professionalScores[b.Id] || 0) - (professionalScores[a.Id] || 0))
        .slice(0, 2);
    }

    // Store detailed results
    const detailedResults = {
      outcome: outcomeData,
      professionals: recommendedProfessionals,
      scores,
      responses,
      completedAt: new Date().toISOString()
    };

    setResults(detailedResults);
    setShowResults(true);
    toast.success("Quiz completed! Here are your personalized recommendations.");

    // Record completion analytics
    if (window.gtag) {
      window.gtag('event', 'quiz_completed', {
        quiz_id: quiz.Id,
        quiz_title: quiz.title,
        outcome_type: outcomeData?.type || 'default'
      });
    }
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
    const { outcome, professionals } = results;
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-success/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-bounce-in">
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-3xl font-display font-bold text-primary mb-4">
            {outcome?.title || "Quiz Complete!"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {outcome?.description || "Based on your answers, here are your personalized recommendations:"}
          </p>
        </div>

        {/* Outcome Details */}
        {outcome && (
          <div className="card mb-8">
            {outcome.explanation && (
              <p className="text-gray-700 mb-4">{outcome.explanation}</p>
            )}
            
            {outcome.roadmapAlignment && (
              <div className="bg-primary/5 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-primary mb-2 flex items-center">
                  <ApperIcon name="Route" className="h-4 w-4 mr-2" />
                  Renovation Roadmap Alignment
                </h4>
                <p className="text-gray-700 text-sm">{outcome.roadmapAlignment}</p>
              </div>
            )}

            {outcome.traits && (
              <div className="mb-4">
                <h4 className="font-semibold text-primary mb-2">Your Traits:</h4>
                <div className="flex flex-wrap gap-2">
                  {outcome.traits.map((trait, index) => (
                    <span key={index} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {outcome.nextSteps && (
              <div className="mb-4">
                <h4 className="font-semibold text-primary mb-2">Next Steps:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {outcome.nextSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Professional Recommendations */}
        {professionals && professionals.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-2xl font-display font-bold text-primary mb-6 text-center">
              Recommended Professionals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {professionals.map((professional, index) => (
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
                      <ApperIcon name="UserCheck" className="h-4 w-4 mr-2" />
                      View Profile & Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center card mb-8">
            <h3 className="text-xl font-semibold text-primary mb-4">General Recommendations</h3>
            <p className="text-lg text-gray-600 mb-6">
              Based on your responses, we recommend starting with a consultation to discuss your specific needs.
            </p>
            <Button 
              variant="primary"
              onClick={() => navigate("/professional/1")}
            >
              <ApperIcon name="MessageCircle" className="h-4 w-4 mr-2" />
              Start with a Consultation
            </Button>
          </div>
        )}

        {/* Social Sharing */}
        <div className="card mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-display font-semibold text-primary mb-2">
              Share Your Results
            </h3>
            <p className="text-gray-600">
              Help others discover their renovation path!
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => shareResults('facebook')}
              className="flex-1 min-w-[120px]"
            >
              <ApperIcon name="Facebook" className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => shareResults('twitter')}
              className="flex-1 min-w-[120px]"
            >
              <ApperIcon name="Twitter" className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => shareResults('linkedin')}
              className="flex-1 min-w-[120px]"
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
                // Clear saved progress
                sessionStorage.removeItem(`quiz_${quiz.Id}_progress`);
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
              Explore More Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

// Handle conditional logic and determine next question
  const getNextQuestionIndex = (currentIndex, selectedAnswer) => {
    const currentQ = quiz.questions[currentIndex];
    
    if (currentQ.conditionalLogic && currentQ.conditionalLogic[selectedAnswer]) {
      const logic = currentQ.conditionalLogic[selectedAnswer];
      
      if (logic.skipTo === 'results') {
        return -1; // Signal to show results
      }
      
      if (logic.nextQuestion) {
        const nextQuestionId = logic.nextQuestion;
        const nextIndex = quiz.questions.findIndex(q => q.Id === nextQuestionId);
        return nextIndex !== -1 ? nextIndex : currentIndex + 1;
      }
    }
    
    return currentIndex + 1;
  };

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const canContinue = answers[currentQ.Id];

  // Save progress to session storage

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
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Question counter dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {quiz.questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index < currentQuestion 
                  ? 'bg-success' 
                  : index === currentQuestion 
                    ? 'bg-accent' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="card mb-8" role="main" aria-live="polite">
        <h2 className="text-2xl font-display font-bold text-primary mb-6">
          {currentQ.question}
        </h2>

        <fieldset className="space-y-3">
          <legend className="sr-only">
            Question {currentQuestion + 1}: {currentQ.question}
          </legend>
          
          {currentQ.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 ${
                answers[currentQ.Id] === option
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQ.Id}`}
                value={option}
                checked={answers[currentQ.Id] === option}
                onChange={(e) => handleAnswer(currentQ.Id, e.target.value)}
                className="mt-1 mr-4 text-primary focus:ring-primary focus:ring-offset-0"
                aria-describedby={`option-${index}-description`}
              />
              <span 
                className="text-gray-700 flex-1"
                id={`option-${index}-description`}
              >
                {option}
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          aria-label="Go to previous question"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center space-x-3">
          {/* Skip option for optional questions */}
          {currentQ.optional && (
            <Button
              variant="ghost"
              onClick={() => {
                const nextIndex = getNextQuestionIndex(currentQuestion, '');
                if (nextIndex === -1) {
                  calculateResults();
                } else if (nextIndex < quiz.questions.length) {
                  setCurrentQuestion(nextIndex);
                } else {
                  calculateResults();
                }
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip
            </Button>
          )}
          
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!canContinue}
            aria-label={
              currentQuestion === quiz.questions.length - 1 
                ? "Complete quiz and get results" 
                : "Continue to next question"
            }
          >
            {currentQuestion === quiz.questions.length - 1 ? (
              <>
                <ApperIcon name="CheckCircle" className="h-4 w-4 mr-2" />
                Get My Results
              </>
            ) : (
              <>
                Continue
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Help text for accessibility */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Use keyboard navigation: Tab to navigate options, Space to select, Enter to continue
        </p>
      </div>
    </div>
  );
};

export default QuizInterface;