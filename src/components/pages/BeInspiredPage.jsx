import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/components/molecules/ProjectCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getProjects } from "@/services/api/projectService";
import { getProfessionals } from "@/services/api/professionalService";

const BeInspiredPage = () => {
  const [projects, setProjects] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [projectsData, professionalsData] = await Promise.all([
        getProjects(),
        getProfessionals()
      ]);
      setProjects(projectsData);
      setProfessionals(professionalsData);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = [
    { id: "all", name: "All Projects", icon: "Grid3x3" },
    { id: "kitchen", name: "Kitchens", icon: "ChefHat" },
    { id: "bathroom", name: "Bathrooms", icon: "Droplets" },
    { id: "living", name: "Living Spaces", icon: "Sofa" },
    { id: "exterior", name: "Exterior", icon: "Home" },
    { id: "commercial", name: "Commercial", icon: "Building2" },
  ];

const filteredProjects = selectedFilter === "all" 
    ? projects 
    : projects.filter(project => 
        project.category?.toLowerCase()?.includes(selectedFilter.toLowerCase()) ||
        project.title?.toLowerCase()?.includes(selectedFilter.toLowerCase())
      );

  const featuredProjects = filteredProjects.filter(project => project.featured);
  const regularProjects = filteredProjects.filter(project => !project.featured);
  const displayProjects = [...featuredProjects, ...regularProjects];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
            Be Inspired
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore stunning renovation projects completed by our trusted professionals in the Waikato region. 
            Get inspired for your own transformation.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedFilter(category.id)}
              className={`flex items-center px-4 py-2 rounded-full font-medium transition-all ${
                selectedFilter === category.id
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-primary/5 hover:border-primary/20"
              }`}
            >
              <ApperIcon name={category.icon} className="h-4 w-4 mr-2" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Featured Project */}
{displayProjects.length > 0 && displayProjects[0] && (
          <div className="mb-12">
            <div className="relative h-96 rounded-2xl overflow-hidden cursor-pointer group"
                 onClick={() => navigate(`/project/${displayProjects[0].Id}`)}>
              <img 
                src={displayProjects[0].imageUrl || "/api/placeholder/800/600"} 
                alt={displayProjects[0].title || "Project image"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="bg-accent text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
                    {displayProjects[0].featured ? "Featured Project" : "Latest Project"}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    {displayProjects[0].title}
                  </h2>
                  <p className="text-lg opacity-90 mb-4 line-clamp-2">
                    {displayProjects[0].description}
                  </p>
                  <div className="flex items-center">
                    <ApperIcon name="ArrowRight" className="h-5 w-5 mr-2" />
                    <span>View Project Details</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Empty 
            title="No projects found" 
            description={selectedFilter === "all" 
              ? "Check back soon for inspiring renovation projects." 
              : `No projects found in the "${categories.find(c => c.id === selectedFilter)?.name}" category.`}
            icon="Image"
            actionText="View All Projects"
            onAction={() => setSelectedFilter("all")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
{displayProjects.slice(1).map((project) => (
              <div key={project.Id} className="group">
                <ProjectCard project={project} size="md" />
                <div className="mt-4">
                  <h3 className="text-lg font-display font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                    {project.title || "Untitled Project"}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {project.description || "No description available"}
                  </p>
                  {project.professionalIds && Array.isArray(project.professionalIds) && project.professionalIds.length > 0 && (
                    <div className="mt-3 flex items-center">
                      <span className="text-xs text-gray-500 mr-2">By:</span>
                      <div className="flex -space-x-1">
                        {project.professionalIds.slice(0, 3).map((profId) => {
                          const professional = professionals?.find(p => p.Id === profId);
                          return professional ? (
                            <div key={profId} className="relative group/tooltip">
                              <img 
                                src={professional.logoUrl || "/api/placeholder/24/24"} 
                                alt={`${professional.name || "Professional"} logo`}
                                className="h-6 w-6 rounded-full border-2 border-white object-contain bg-white"
                              />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/tooltip:block">
                                <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                  {professional.name || "Unknown Professional"}
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })}
                        {project.professionalIds.length > 3 && (
                          <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{project.professionalIds.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16">
          <div className="card bg-gradient-to-r from-primary/5 to-secondary/5 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-primary mb-4">
              Ready to Start Your Own Project?
            </h3>
            <p className="text-gray-600 mb-6">
              Inspired by what you see? Take our quiz to find the right professional for your vision, 
              or explore our renovation roadmap to understand the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/quiz/who-to-call-first")}
                className="btn-accent"
              >
                <ApperIcon name="Play" className="h-4 w-4 mr-2" />
                Take Our Quiz
              </button>
              <button 
                onClick={() => navigate("/renovation-roadmap")}
                className="btn-primary"
              >
                <ApperIcon name="Map" className="h-4 w-4 mr-2" />
                View Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeInspiredPage;