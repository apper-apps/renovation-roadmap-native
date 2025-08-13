import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ProfessionalCard = ({ professional }) => {
  const [logoError, setLogoError] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/professional/${professional.Id}`);
  };

  const handleVisitWebsite = () => {
    window.open(professional.website, "_blank");
  };

  const handleLogoError = () => {
    setLogoError(true);
    setLogoLoading(false);
  };

  const handleLogoLoad = () => {
    setLogoLoading(false);
  };
  return (
    <div className="professional-card">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-display font-bold text-primary mb-3">
          {professional.category}
        </h3>
<div className="flex items-center justify-center mb-4">
          <span className="text-gray-600 mr-2">like</span>
          <div className="relative h-8 max-w-[120px]">
            {logoLoading && (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            )}
            {logoError ? (
              <div className="h-8 px-3 bg-gray-100 rounded flex items-center justify-center border">
                <span className="text-xs text-gray-500 font-medium">{professional.name}</span>
              </div>
            ) : (
              <img 
                src={professional.logoUrl} 
                alt={`${professional.name} logo`}
                className={`h-8 max-w-[120px] object-contain transition-opacity duration-300 ${logoLoading ? 'opacity-0' : 'opacity-100'}`}
                onError={handleLogoError}
                onLoad={handleLogoLoad}
                style={{ display: logoLoading ? 'none' : 'block' }}
              />
            )}
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-6 text-center leading-relaxed">
        {professional.description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="primary" 
          className="flex-1"
          onClick={handleViewProfile}
        >
          <ApperIcon name="User" className="h-4 w-4 mr-2" />
          View Profile
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleVisitWebsite}
        >
          <ApperIcon name="ExternalLink" className="h-4 w-4 mr-2" />
          Website
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalCard;