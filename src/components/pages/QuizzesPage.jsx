import { useState, useEffect } from "react";
import QuizCard from "@/components/molecules/QuizCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getQuizzes } from "@/services/api/quizService";

const QuizzesPage = () => {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
            Renovation Quizzes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Not sure where to start with your renovation? Take our interactive quizzes to get 
            personalized recommendations and discover the best professionals for your project.
          </p>
        </div>

        {/* Featured Quiz */}
        {quizzes.length > 0 && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="bg-accent text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                    <h2 className="text-3xl font-display font-bold text-primary mb-4">
                      {quizzes[0].title}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {quizzes[0].description}
                    </p>
                    <div className="flex items-center text-gray-500 mb-6">
                      <span className="flex items-center mr-6">
                        <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                        {quizzes[0].estimatedTime} minutes
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-info rounded-full mr-2"></span>
                        {quizzes[0].questions?.length || 8} questions
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src={quizzes[0].imageUrl} 
                      alt={quizzes[0].title}
                      className="w-full h-64 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Quizzes Grid */}
        <div>
          <h2 className="text-2xl font-display font-bold text-primary mb-8 text-center">
            All Quizzes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.Id} quiz={quiz} />
            ))}
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
              <button 
                onClick={() => window.location.href = '/faq'}
                className="btn-primary"
              >
                View FAQ
              </button>
              <button 
                onClick={() => window.location.href = '/renovation-roadmap'}
                className="btn-secondary"
              >
                Renovation Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzesPage;