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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
            Meet Your Expert Team
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get to know the professionals who could bring your renovation vision to life. 
            Each brings unique expertise and a commitment to excellence.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {professionals.map((professional) => (
            <div key={professional.Id} className="text-center group">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105 mb-4">
                <img 
src={professional.logoUrl} 
                  alt={`${professional.name} logo`}
                  className="h-12 max-w-full object-contain mx-auto"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/professional/${professional.Id}`)}
                className="w-full"
              >
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
                View Profile
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