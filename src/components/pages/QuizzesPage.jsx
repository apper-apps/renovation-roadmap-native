import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import QuizCard from "@/components/molecules/QuizCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import { getQuizzes } from "@/services/api/quizService";

const QuizzesPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadQuizzes} />;
  if (quizzes.length === 0) return (
    <Empty 
      title="No quizzes available" 
      description="Check back soon for interactive quizzes to help guide your renovation journey."
      icon="HelpCircle"
    />
  );

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
{/* Quiz Section - White Background Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
              Take Our Quiz to Find Out Who You Need
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Not sure where to start? Our interactive quizzes will help you understand your project needs and connect you with the right professionals.
            </p>
          </div>

{/* Featured Quiz */}
          {quizzes.length > 0 && quizzes[0] && (
            <div className="mb-16">
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                        Featured
                      </div>
                      <div className="text-sm text-gray-600">
                        <ApperIcon name="Users" className="h-4 w-4 inline mr-1" />
                        {quizzes[0].completions || 0} completed
                      </div>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-primary mb-3">
                      {quizzes[0].title}
                    </h2>
                    <p className="text-gray-600 text-lg mb-6">
                      {quizzes[0].description}
                    </p>
                    <div className="flex items-center text-gray-600 mb-6">
                      <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                      <span>{quizzes[0].estimatedTime} minutes</span>
                      <span className="mx-3">•</span>
                      <ApperIcon name="HelpCircle" className="h-4 w-4 mr-2" />
                      <span>{quizzes[0].questions?.length || 0} questions</span>
                    </div>
                    <Button 
                      size="lg"
                      onClick={() => navigate(`/quiz/${quizzes[0].Id}`)}
                      className="bg-accent hover:bg-accent/90"
                    >
                      <ApperIcon name="ArrowRight" className="h-5 w-5 mr-2" />
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-display font-bold text-primary mb-8 text-center">
              All Quizzes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizzes.map((quiz) => (
                <QuizCard 
                  key={quiz.Id} 
                  quiz={quiz} 
                  onClick={() => navigate(`/quiz/${quiz.Id}`)} 
/>
              ))}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16">
          <div className="card bg-gradient-to-r from-primary/5 to-secondary/5 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-primary mb-4">
              Need More Help?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the right quiz for your situation? Check out our FAQ section 
              or view our renovation roadmap for comprehensive guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
<Button 
                onClick={() => navigate('/faq')}
                variant="primary"
              >
                View FAQ
              </Button>
              <Button 
                onClick={() => navigate('/renovation-roadmap')}
                variant="secondary"
              >
                Renovation Roadmap
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzesPage;