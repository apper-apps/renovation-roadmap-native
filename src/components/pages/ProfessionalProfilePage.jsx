import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ContactForm from "@/components/organisms/ContactForm";
import ProjectCard from "@/components/molecules/ProjectCard";
import ApperIcon from "@/components/ApperIcon";
import { getProfessionalById } from "@/services/api/professionalService";
import { getProjects } from "@/services/api/projectService";

const ProfessionalProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [professionalData, projectsData] = await Promise.all([
        getProfessionalById(parseInt(id)),
        getProjects()
      ]);
      
      if (!professionalData) {
        setError("Professional not found");
        return;
      }
      
      setProfessional(professionalData);
      // Filter projects that include this professional
      const relatedProjects = projectsData.filter(project => 
        project.professionalIds && project.professionalIds.includes(parseInt(id))
      );
      setProjects(relatedProjects);
    } catch (err) {
      setError("Failed to load professional profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!professional) return <Error message="Professional not found" />;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Professional Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="card text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="flex-shrink-0">
<img 
                    src={professional.logoUrl} 
                    alt={`${professional.name} logo`}
                    className="h-16 max-w-[160px] object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full inline-block mb-3">
                    {professional.category}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
                    {professional.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    {professional.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="primary"
                      onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      <ApperIcon name="MessageCircle" className="h-4 w-4 mr-2" />
                      Get In Touch
                    </Button>
<Button
                      variant="outline"
                      onClick={() => window.open(professional.website, "_blank")}
                      className="bg-accent text-white border-accent hover:bg-accent/90"
                    >
                      <ApperIcon name="ExternalLink" className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="card">
              <h2 className="text-2xl font-display font-bold text-primary mb-6">
                Core Services
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {professional.services || professional.description}
                </p>
              </div>
            </div>

            {/* Projects Showcase */}
            {projects.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-primary">
                    Featured Projects
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/be-inspired")}
                  >
                    <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
                    View All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.slice(0, 4).map((project) => (
                    <div key={project.Id} className="group">
                      <ProjectCard project={project} size="md" />
                      <div className="mt-3">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Choose Section */}
            <div className="card">
              <h2 className="text-2xl font-display font-bold text-primary mb-6">
                Why Choose {professional.name}?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-success/10 p-2 rounded-lg flex-shrink-0">
                    <ApperIcon name="Shield" className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Trusted & Reliable</h3>
                    <p className="text-sm text-gray-600">Invited professionals with proven track records</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-info/10 p-2 rounded-lg flex-shrink-0">
                    <ApperIcon name="MapPin" className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Local Expertise</h3>
                    <p className="text-sm text-gray-600">Deep knowledge of Waikato region requirements</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-warning/10 p-2 rounded-lg flex-shrink-0">
                    <ApperIcon name="Award" className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Quality Focused</h3>
                    <p className="text-sm text-gray-600">Commitment to excellence in every project</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-accent/10 p-2 rounded-lg flex-shrink-0">
                    <ApperIcon name="Users" className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Client Focused</h3>
                    <p className="text-sm text-gray-600">Personalized service and clear communication</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="lg:col-span-1">
            <div className="sticky top-8">
              <ContactForm professional={professional} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfilePage;