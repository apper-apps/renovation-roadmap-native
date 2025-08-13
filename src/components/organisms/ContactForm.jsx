import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import { createEnquiry } from "@/services/api/enquiryService";

const ContactForm = ({ professional }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const projectTypes = [
    "Kitchen Renovation",
    "Bathroom Renovation", 
    "Full Home Renovation",
    "Extension/Addition",
    "New Build",
    "Exterior Renovation",
    "Commercial Fitout",
    "Other"
  ];

  const budgetRanges = [
    "Under $50,000",
    "$50,000 - $100,000",
    "$100,000 - $250,000", 
    "$250,000 - $500,000",
    "$500,000+",
    "Prefer not to say"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      const enquiryData = {
        ...formData,
        professionalId: professional.Id
      };
      
      await createEnquiry(enquiryData);
      
      toast.success("Your enquiry has been sent successfully! The professional will contact you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        budget: "",
        message: ""
      });
      
    } catch (error) {
      toast.error("Failed to send enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-2xl font-display font-bold text-primary mb-2">
          Get in Touch with {professional.name}
        </h3>
        <p className="text-gray-600">
          Fill out the form below and they'll get back to you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Full Name"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your full name"
            required
          />
          
          <FormField
            label="Email Address"
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <FormField
          label="Phone Number"
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          placeholder="Enter your phone number (optional)"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="projectType">Project Type</Label>
            <select
              id="projectType"
              value={formData.projectType}
              onChange={(e) => handleInputChange("projectType", e.target.value)}
              className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select project type</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="budget">Budget Range</Label>
            <select
              id="budget"
              value={formData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select budget range</option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="message">
            Project Details
            <span className="text-error ml-1">*</span>
          </Label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Tell us about your project, timeline, and any specific requirements..."
            rows={5}
            className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
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
            <ApperIcon name="Send" className="h-4 w-4 mr-2" />
          )}
          Send Enquiry
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;