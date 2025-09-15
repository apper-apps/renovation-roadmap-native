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
<div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <HeroSection 
          title={heroSection?.title_c}
          description={heroSection?.description_c}
          backgroundImage={heroSection?.image_url_c}
        />
      </section>

      {/* Main Content Sections */}
      <div className="relative">
        {/* Project Showcase Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProjectShowcase />
          </div>
        </section>

        {/* Professional Categories Section */}
        <section className="py-16 bg-gray-50" id="professionals-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProfessionalCategories />
          </div>
        </section>

        {/* Expert Team Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ExpertTeam />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CTASection />
          </div>
        </section>
      </div>
      
      {/* Dynamic Database Sections */}
      {homePageSections.filter(section => section.section_order_c > 3).length > 0 && (
        <div className="border-t border-gray-200">
          {homePageSections.filter(section => section.section_order_c > 3).map((section, index) => (
            <section 
              key={section.Id} 
              className={`py-20 px-4 sm:px-6 lg:px-8 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {section.title_c}
                  </h2>
                  {section.description_c && (
                    <div className="prose prose-lg mx-auto text-gray-600 max-w-4xl">
                      <p className="text-xl leading-relaxed">
                        {section.description_c}
                      </p>
                    </div>
                  )}
                </div>
                {section.image_url_c && (
                  <div className="flex justify-center mt-12">
                    <div className="relative max-w-5xl w-full">
                      <img 
                        src={section.image_url_c} 
                        alt={section.title_c}
                        className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                        style={{ maxHeight: '600px' }}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;