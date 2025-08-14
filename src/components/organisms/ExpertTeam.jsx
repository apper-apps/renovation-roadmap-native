import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { getProfessionals } from "@/services/api/professionalService";

const ExpertTeam = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const loadProfessionals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProfessionals();
      setProfessionals(data.filter(pro => pro.status === "active"));
    } catch (err) {
      setError("Failed to load professionals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfessionals();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfessionals} />;

  return (
<section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
<h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
            Meet Your Local Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Get to know the professionals who could bring your renovation vision to life. 
            Each brings unique expertise and a commitment to excellence.
          </p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {professionals.map((professional) => (
            <div key={professional.Id} className="professional-card group cursor-pointer flex flex-col h-full" onClick={() => navigate(`/professional/${professional.Id}`)}>
              <div className="text-center mb-4">
                <img 
                  src={professional.logoUrl} 
                  alt={`${professional.name} logo`}
                  className="h-12 max-w-full object-contain mx-auto mb-3"
                />
                <h3 className="text-lg font-display font-bold text-primary mb-1">{professional.name}</h3>
                <p className="text-accent font-medium mb-2">{professional.category}</p>
              </div>
              
              <div className="mb-4 flex-grow">
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                  {professional.description}
                </p>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Services:</p>
                  <p className="text-xs text-gray-600">{professional.services}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full group-hover:bg-accent group-hover:text-white transition-colors mt-auto"
              >
                View Full Profile
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button 
            variant="accent" 
            size="lg"
            onClick={() => navigate("/quiz/who-to-call-first")}
          >
            <ApperIcon name="HelpCircle" className="h-5 w-5 mr-2" />
            Not Sure Who to Call First? Take Our Quiz
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExpertTeam;