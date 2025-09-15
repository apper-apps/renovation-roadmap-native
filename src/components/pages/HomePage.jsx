import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import homePageService from "@/services/api/homePageService";
import HeroSection from "@/components/organisms/HeroSection";
import ProjectShowcase from "@/components/organisms/ProjectShowcase";
import ProfessionalCategories from "@/components/organisms/ProfessionalCategories";
import ExpertTeam from "@/components/organisms/ExpertTeam";
import CTASection from "@/components/organisms/CTASection";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const HomePage = () => {
  const [homePageSections, setHomePageSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHomePageContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Initialize default sections if none exist, then fetch all sections
        await homePageService.initializeDefaultHomePage();
        const sections = await homePageService.getHomePageSections();
        setHomePageSections(sections || []);
      } catch (err) {
        console.error("Error loading home page content:", err);
        setError("Failed to load home page content");
        toast.error("Failed to load home page content");
      } finally {
        setLoading(false);
      }
    };

    loadHomePageContent();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  // Find specific sections by order or title
  const heroSection = homePageSections.find(section => 
    section.section_order_c === 1 || section.title_c?.toLowerCase().includes('hero')
  );

  return (
    <div>
      {/* Pass hero section data to HeroSection if available */}
      <HeroSection 
        title={heroSection?.title_c}
        description={heroSection?.description_c}
        backgroundImage={heroSection?.image_url_c}
      />
      <ProjectShowcase />
      <ProfessionalCategories />
      <ExpertTeam />
      <CTASection />
      
      {/* Display additional dynamic sections from database */}
      {homePageSections.filter(section => section.section_order_c > 3).map(section => (
        <div key={section.Id} className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {section.title_c}
              </h2>
              {section.description_c && (
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {section.description_c}
                </p>
              )}
            </div>
            {section.image_url_c && (
              <div className="flex justify-center">
                <img 
                  src={section.image_url_c} 
                  alt={section.title_c}
                  className="rounded-lg shadow-lg max-w-full h-auto"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;