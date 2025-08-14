import { useNavigate } from "react-router-dom";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleTakeQuiz = () => {
    navigate("/quiz/who-to-call-first");
  };

  const handleViewProfessionals = () => {
    document.getElementById("professionals-section")?.scrollIntoView({ 
      behavior: "smooth" 
    });
  };

  return (
<section
className="relative py-12 overflow-hidden border-b border-gray-100" style={{ backgroundColor: '#F7F9FB' }}>
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
        <div
            className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div
            className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
        <div
            className="absolute top-1/2 left-1/3 w-16 h-16 border border-white/20 rounded-full"></div>
    </div>
    <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
<h1
className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight drop-shadow-sm">
                <div style={{ color: '#000000' }}>Got a building project</div>
                <div style={{ color: '#0059E3' }}>on your mind?</div>
            </h1>
            <h2
                className="text-2xl md:text-3xl font-display font-semibold mb-6 text-gray-800 drop-shadow-sm">Do you know who to call?
                          </h2>
            <p
                className="text-xl md:text-2xl mb-8 text-gray-700 leading-relaxed max-w-3xl mx-auto">Whether you're considering minor updates or major renovations, interior or exterior, 
                            get the peace of mind that comes from partnering with trusted renovation experts.
                          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="accent" size="lg" onClick={handleTakeQuiz} className="group">
                    <ApperIcon
                        name="Play"
                        className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />Take Our Quiz
                                </Button>
<Button
                    variant="outline"
                    size="lg"
                    onClick={handleViewProfessionals}
                    className="text-primary border-primary hover:bg-primary hover:text-white">
                    <ApperIcon name="Users" className="h-5 w-5 mr-2" />View Professionals
                </Button>
            </div>
            <div
                className="mt-12 flex items-center justify-center space-x-8 text-white/75">
                <div className="flex items-center">
                    <ApperIcon name="Shield" className="h-5 w-5 mr-2" />
                    <span className="text-sm">Trusted Experts</span>
                </div>
                <div className="flex items-center">
                    <ApperIcon name="MapPin" className="h-5 w-5 mr-2" />
                    <span className="text-sm">Waikato Region</span>
                </div>
                <div className="flex items-center">
                </div>
            </div>
        </div>
    </div></section>
  );
};

export default HeroSection;