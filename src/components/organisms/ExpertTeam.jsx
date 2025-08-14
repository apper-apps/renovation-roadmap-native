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
              <div className="flex flex-col items-center text-center mb-6">
                <img 
                  src={professional.logoUrl} 
                  alt={`${professional.name} logo`}
                  className="h-20 max-w-[160px] object-contain mb-4"
                />
                <div>
                  <h3 className="text-2xl font-display font-bold text-primary mb-1">{professional.name}</h3>
                  <p className="text-accent font-semibold text-lg">{professional.category}</p>
                </div>
              </div>
              
              <div className="mb-6 flex-grow">
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
      </div>
    </section>
  );
};

export default ExpertTeam;