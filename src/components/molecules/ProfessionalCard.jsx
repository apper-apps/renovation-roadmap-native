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
<div className="professional-card flex flex-col h-full">
      <div className="text-center mb-6">
        <div className="text-sm text-accent font-medium mb-2">
          A {professional.type} like...
        </div>
        <h3 className="text-3xl font-display font-bold text-primary mb-4" style={{ minHeight: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {professional.name}
        </h3>
        <div className="flex justify-center mb-4">
          <div className="relative h-12 max-w-[140px]">
            {logoLoading && (
              <div className="h-12 w-24 bg-gray-200 animate-pulse rounded"></div>
            )}
            {logoError ? (
              <div className="h-12 px-4 bg-gray-100 rounded flex items-center justify-center border">
                <span className="text-sm text-gray-500 font-medium">{professional.name}</span>
              </div>
            ) : (
              <img 
                src={professional.logoUrl} 
                alt={`${professional.name} logo`}
                className={`h-12 max-w-[140px] object-contain transition-opacity duration-300 ${logoLoading ? 'opacity-0' : 'opacity-100'}`}
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
      
<div className="flex flex-col gap-3 mt-auto">
        <Button 
          variant="primary" 
          className="flex-1 bg-accent hover:bg-accent/90"
          onClick={handleViewProfile}
        >
          <ApperIcon name="User" className="h-4 w-4 mr-2" />
          Learn More
        </Button>
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={handleVisitWebsite}
        >
          <ApperIcon name="ExternalLink" className="h-4 w-4 mr-2" />
          Visit Website
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalCard;