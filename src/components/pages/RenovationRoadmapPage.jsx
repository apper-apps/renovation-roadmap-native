import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import NewsletterSignup from "@/components/molecules/NewsletterSignup";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import { getProfessionalById, getProfessionals } from "@/services/api/professionalService";
import { getRoadmapStages } from "@/services/api/roadmapService";

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
        <div className="text-center mb-16">
            <h1
                className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-8">Your Renovation Roadmap
                          </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">Navigate your renovation journey with confidence. Our comprehensive step-by-step roadmap guides you 
                            through each stage of the renovation process, showing you what to expect and which professionals you may need at each stage.
                          </p>
        </div>
    </div>
    {/* Interactive Roadmap */}
    <div className="max-w-7xl mx-auto mb-20">
        {/* Timeline */}
        <div className="relative">
            {/* Enhanced Connection Line */}
            <div
                className="absolute left-10 top-20 h-full w-1 bg-gradient-to-b from-primary via-accent to-secondary rounded-full hidden lg:block shadow-lg"></div>
            <div className="space-y-12">
                {stages.map((stage, index) => <div key={stage.Id} className="relative">
                    {/* Enhanced Stage Number */}
                    <div
                        className={`absolute left-0 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl cursor-pointer transition-all duration-300 shadow-xl ${index === activeStage ? "bg-gradient-to-br from-accent via-warning to-accent scale-110 shadow-2xl animate-pulse" : "bg-gradient-to-br from-primary via-secondary to-primary hover:scale-105 hover:shadow-xl"}`}
                        onClick={() => setActiveStage(index)}>
                        {index + 1}
                    </div>
                    {/* Enhanced Stage Content */}
                    <div
                        className="ml-28 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                        {/* Header with gradient background */}
                        <div
                            className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-100">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                <h3
                                    className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 lg:mb-0">
                                    {stage.title}
                                </h3>
                                <div
                                    className="flex items-center text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                                    <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                                    <span className="font-medium">{stage.duration}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                                {stage.description}
                            </p>
                            {/* Enhanced Key Activities */}
                            <div className="mb-8">
                                <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <div
                                        className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full mr-3"></div>Key Activities
                                                            </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {stage.activities.map(
                                        (activity, idx) => <li key={idx} className="flex items-start bg-gray-50 p-3 rounded-lg">
                                            <ApperIcon
                                                name="CheckCircle"
                                                className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{activity}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            {/* Enhanced Associated Professionals */}
                            {stage.professionalIds && stage.professionalIds.length > 0 && <div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <div
                                        className="w-1 h-6 bg-gradient-to-b from-accent to-secondary rounded-full mr-3"></div>Professionals You Could Work With
                                                              </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {stage.professionalIds.map(profId => {
                                        const professional = getProfessionalById(profId);

                                        return professional ? <button
                                            key={profId}
                                            onClick={() => navigate(`/professional/${profId}`)}
                                            className="flex items-center justify-between bg-gradient-to-r from-white to-gray-50 hover:from-primary/5 hover:to-accent/5 p-4 rounded-xl transition-all duration-300 group border border-gray-200 hover:border-primary/30 hover:shadow-md">
                                            <div className="flex items-center">
                                                <div
                                                    className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full mr-3"></div>
                                                <span className="text-gray-800 group-hover:text-primary font-medium">A {professional.type.toLowerCase()}like <span className="font-bold text-primary">{professional.name}</span>
                                                </span>
                                            </div>
                                            <img
                                                src={professional.logoUrl}
                                                alt={`${professional.name} logo`}
                                                className="h-10 max-w-[100px] object-contain ml-4" />
                                        </button> : null;
                                    })}
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    </div>
    {/* CTA Section */}
    <div className="text-center mb-16">
        <div className="card max-w-2xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-primary mb-4">Ready to Start Your Journey?
                            </h3>
            <p className="text-gray-600 mb-6">Take our quiz to find out which professional you should contact first, 
                              or download our comprehensive renovation workbook.
                            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="accent" onClick={() => navigate("/quiz/1")}>
                    <ApperIcon name="Play" className="h-4 w-4 mr-2" />Take Our Quiz
                                  </Button>
                <Button variant="primary" onClick={() => navigate("/be-inspired")}>
                    <ApperIcon name="Image" className="h-4 w-4 mr-2" />View Projects
                                  </Button>
            </div>
        </div>
    </div>
    {/* Lead Magnet Newsletter */}
    <NewsletterSignup showLeadMagnet={true} />
</div>
  );
};

export default RenovationRoadmapPage;