import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import NewsletterSignup from "@/components/molecules/NewsletterSignup";
import { getRoadmapStages } from "@/services/api/roadmapService";
import { getProfessionals } from "@/services/api/professionalService";

const RenovationRoadmapPage = () => {
  const [stages, setStages] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [activeStage, setActiveStage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [stagesData, professionalsData] = await Promise.all([
        getRoadmapStages(),
        getProfessionals()
      ]);
      setStages(stagesData);
      setProfessionals(professionalsData);
    } catch (err) {
      setError("Failed to load roadmap data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const getProfessionalById = (id) => {
    return professionals.find(prof => prof.Id === id);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
            Your Renovation Roadmap
          </h1>
<p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate your renovation journey with confidence. Our step-by-step roadmap shows you 
            each stage of the standard renovation process, what to expect and which professionals you may need at each stage.
          </p>
        </div>

        {/* Interactive Roadmap */}
        <div className="max-w-6xl mx-auto mb-16">
          {/* Timeline */}
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-8 top-16 h-full w-0.5 bg-gradient-to-b from-primary via-secondary to-accent hidden lg:block"></div>

            <div className="space-y-8">
              {stages.map((stage, index) => (
                <div key={stage.Id} className="relative">
                  {/* Stage Number */}
                  <div 
                    className={`absolute left-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl cursor-pointer transition-all duration-300 ${
                      index === activeStage 
                        ? "bg-gradient-to-br from-accent to-warning scale-110 shadow-lg"
                        : "bg-gradient-to-br from-primary to-secondary hover:scale-105"
                    }`}
                    onClick={() => setActiveStage(index)}
                  >
                    {index + 1}
                  </div>

                  {/* Stage Content */}
                  <div className="ml-24 card">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <h3 className="text-2xl font-display font-bold text-primary mb-2 lg:mb-0">
                        {stage.title}
                      </h3>
                      <div className="text-sm text-gray-500">
                        <ApperIcon name="Clock" className="h-4 w-4 inline mr-1" />
                        {stage.duration}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6">
                      {stage.description}
                    </p>

                    {/* Key Activities */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Activities:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {stage.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-center text-gray-700">
                            <ApperIcon name="CheckCircle" className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Associated Professionals */}
                    {stage.professionalIds && stage.professionalIds.length > 0 && (
                      <div>
<h4 className="font-semibold text-gray-900 mb-4">Professionals You Could Work With:</h4>
                        <div className="space-y-3">
                          {stage.professionalIds.map((profId) => {
                            const professional = getProfessionalById(profId);
                            return professional ? (
                              <button
                                key={profId}
                                onClick={() => navigate(`/professional/${profId}`)}
                                className="w-full flex items-center justify-between bg-gray-50 hover:bg-primary/5 px-4 py-3 rounded-lg transition-colors group border border-gray-200 hover:border-primary/20"
                              >
                                <span className="text-sm font-semibold text-gray-800 group-hover:text-primary">
                                  A {professional.type.toLowerCase()} like <span className="font-bold text-primary">{professional.name}</span>
                                </span>
                                <img 
                                  src={professional.logoUrl} 
                                  alt={`${professional.name} logo`}
                                  className="h-8 max-w-[80px] object-contain ml-3"
                                />
                              </button>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-primary mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Take our quiz to find out which professional you should contact first, 
              or download our comprehensive renovation workbook.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
<Button 
                variant="accent"
                onClick={() => navigate("/quiz/1")}
              >
                <ApperIcon name="Play" className="h-4 w-4 mr-2" />
                Take Our Quiz
              </Button>
              <Button 
                variant="primary"
                onClick={() => navigate("/be-inspired")}
              >
                <ApperIcon name="Image" className="h-4 w-4 mr-2" />
                View Projects
              </Button>
            </div>
          </div>
        </div>

        {/* Lead Magnet Newsletter */}
        <NewsletterSignup showLeadMagnet={true} />
      </div>
    </div>
  );
};

export default RenovationRoadmapPage;