import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const NewsletterSignup = ({ showLeadMagnet = false }) => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    if (showLeadMagnet && !consent) {
      toast.error("Please agree to receive our newsletter");
      return;
    }

    setLoading(true);
    
    try {
      // Simulate newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(showLeadMagnet ? 
        "Thank you! Check your email for the Renovation Workbook." : 
        "Successfully subscribed to our newsletter!"
      );
      
      setEmail("");
      setConsent(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className={`bg-white rounded-xl p-8 shadow-lg ${showLeadMagnet ? 'max-w-4xl' : 'max-w-md'} mx-auto`}>
      {showLeadMagnet ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Workbook Image Space */}
          <div className="order-2 lg:order-1">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 h-80 flex items-center justify-center">
              <div className="text-center">
                <ApperIcon name="BookOpen" className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Workbook Preview Image</p>
                <p className="text-sm text-gray-500 mt-2">3D render of renovation workbook will be placed here</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="mb-6">
              <h3 className="text-3xl font-display font-bold text-primary mb-3">
                Download Your Free Renovation Workbook
              </h3>
              <p className="text-lg text-gray-600">
Get our handy workbook to help you plan your next renovation project, plus sign up to the JCC Build monthly newsletter.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  I agree to receive the Renovation Roadmap newsletter with renovation tips, project showcases, and updates. You can unsubscribe at any time.
                </label>
              </div>

              <Button 
                type="submit" 
                variant="accent" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                )}
                Get Free Workbook
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-display font-bold text-primary mb-2">
              Keep up to date with latest renovation trends
            </h3>
            <p className="text-gray-600">
              Subscribe to the JCC Build newsletter for expert renovation tips, local building news, and inspiring project showcases.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <Button 
              type="submit" 
              variant="accent" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
              )}
              Subscribe
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewsletterSignup;