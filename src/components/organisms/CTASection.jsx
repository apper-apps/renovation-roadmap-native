import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import NewsletterSignup from "@/components/molecules/NewsletterSignup";

const CTASection = () => {
  const navigate = useNavigate();

  return (
<section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
{/* Main CTA */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              Ready to Start Your Dream Project?
            </h2>
<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Take our quick quiz to discover which professional you should contact first, 
              or contact JCC Build for a free consultation to get the conversation going.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="accent" 
                size="lg"
onClick={() => navigate("/quiz/who-to-call-first")}
              >
                <ApperIcon name="Play" className="h-5 w-5 mr-2" />
                Take Our Quiz
              </Button>
<Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate("/professional/1")}
>
                <ApperIcon name="User" className="h-5 w-5 mr-2" />
                Contact JCC Build
              </Button>
            </div>
          </div>

          {/* Newsletter Signup */}
          <NewsletterSignup showLeadMagnet={true} />
        </div>
      </div>
    </section>
  );
};

export default CTASection;