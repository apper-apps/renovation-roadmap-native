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
          </p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {professionals.map((professional) => (
<div key={professional.Id} className="professional-card group cursor-pointer flex flex-col h-full p-8">
              <div className="flex items-center mb-6">
                <img 
                  src={professional.logoUrl} 
                  alt={`${professional.name} logo`}
                  className="h-12 max-w-[120px] object-contain mr-4"
                />
                <div className="flex-grow">
                  <h3 className="text-2xl font-display font-bold text-primary mb-1">{professional.name}</h3>
                  <p className="text-accent font-semibold text-lg">{professional.category}</p>
                </div>
              </div>
              
              <div className="mb-6 flex-grow">
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  {professional.description}
                </p>
                
<div className="mb-6">
                  <h4 className="text-primary font-semibold mb-3 text-lg">Core Services:</h4>
                  <div className="space-y-2">
{professional?.services ? (
                      Array.isArray(professional.services) 
                        ? professional.services.map((service, index) => (
                            <div key={index} className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                              <span>{service}</span>
                            </div>
                          ))
                        : typeof professional.services === 'string'
                        ? professional.services.split(', ').map((service, index) => (
                            <div key={index} className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                              <span>{service.trim()}</span>
                            </div>
                          ))
                        : (
                            <div className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                              <span>Services information not available</span>
                            </div>
                          )
                    ) : (
                        <div className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                          <span>Services information not available</span>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
              
              <Button
                variant="primary"
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3"
                onClick={() => navigate(`/professional/${professional.Id}`)}
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