import { useState, useEffect } from "react";
import FAQItem from "@/components/molecules/FAQItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getFAQs } from "@/services/api/faqService";

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadFAQs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getFAQs();
      setFaqs(data);
    } catch (err) {
      setError("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFAQs} />;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions about renovation projects, our professionals, 
            and how Renovation Roadmap can help you.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 && searchTerm ? (
            <Empty 
              title="No results found" 
              description={`No FAQs found matching "${searchTerm}". Try a different search term.`}
              icon="Search"
            />
          ) : filteredFAQs.length === 0 && !searchTerm ? (
            <Empty 
              title="No FAQs available" 
              description="Check back soon for frequently asked questions about renovation projects."
              icon="HelpCircle"
            />
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <FAQItem key={faq.Id} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-16">
          <div className="card bg-gradient-to-r from-primary/5 to-secondary/5 text-center max-w-2xl mx-auto">
            <ApperIcon name="HelpCircle" className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-primary mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Didn't find what you were looking for? Take our quiz to get personalized recommendations 
              or contact one of our professionals directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/quiz/who-to-call-first'}
                className="btn-accent"
              >
                <ApperIcon name="Play" className="h-4 w-4 mr-2" />
                Take Our Quiz
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-primary"
              >
                <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                View Professionals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;