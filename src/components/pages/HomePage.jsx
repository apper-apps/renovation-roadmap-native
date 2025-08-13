import HeroSection from "@/components/organisms/HeroSection";
import ProjectShowcase from "@/components/organisms/ProjectShowcase";
import ProfessionalCategories from "@/components/organisms/ProfessionalCategories";
import ExpertTeam from "@/components/organisms/ExpertTeam";
import CTASection from "@/components/organisms/CTASection";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <ProjectShowcase />
      <ProfessionalCategories />
      <ExpertTeam />
      <CTASection />
    </div>
  );
};

export default HomePage;