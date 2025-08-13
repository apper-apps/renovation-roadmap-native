import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

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
    <section className="relative py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            Your Renovation Journey{" "}
            <span className="bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed max-w-3xl mx-auto">
            Whether you're considering minor updates or major renovations, interior or exterior, 
            get the peace of mind that comes from partnering with trusted renovation experts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="accent" 
              size="lg"
              onClick={handleTakeQuiz}
              className="group"
            >
              <ApperIcon name="Play" className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Take Our Quiz
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleViewProfessionals}
              className="text-white border-white hover:bg-white hover:text-primary"
            >
              <ApperIcon name="Users" className="h-5 w-5 mr-2" />
              View Professionals
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-white/75">
            <div className="flex items-center">
              <ApperIcon name="Shield" className="h-5 w-5 mr-2" />
              <span className="text-sm">Trusted Experts</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="MapPin" className="h-5 w-5 mr-2" />
              <span className="text-sm">Waikato Region</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Award" className="h-5 w-5 mr-2" />
              <span className="text-sm">Award Winning</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;