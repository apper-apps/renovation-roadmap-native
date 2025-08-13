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
<div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-display font-bold text-primary mb-2">
          {showLeadMagnet ? "Download Your Free Renovation Workbook" : "Keep up to date with latest renovation trends"}
        </h3>
        <p className="text-gray-600">
          {showLeadMagnet ? 
            "Get our comprehensive guide to planning your renovation project, plus expert tips delivered to your inbox." :
            "Subscribe to the JCC Build newsletter for expert renovation tips, local building news, and inspiring project showcases."
          }
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

        {showLeadMagnet && (
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
        )}

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
          {showLeadMagnet ? "Get Free Workbook" : "Subscribe"}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;