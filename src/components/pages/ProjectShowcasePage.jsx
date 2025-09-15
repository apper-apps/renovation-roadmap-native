import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "@/services/api/projectService";
import { getProfessionals } from "@/services/api/professionalService";
import ApperIcon from "@/components/ApperIcon";
import ProjectCard from "@/components/molecules/ProjectCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const ProjectShowcasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [projectData, professionalsData] = await Promise.all([
        getProjectById(parseInt(id)),
        getProfessionals()
      ]);
      
      if (!projectData) {
        setError("Project not found");
        return;
      }
      
      setProject(projectData);
      setProfessionals(professionalsData);
    } catch (err) {
      setError("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!project) return <Error message="Project not found" />;

  const getProjectProfessionals = () => {
    if (!project.professionalIds) return [];
    return professionals.filter(prof => project.professionalIds.includes(prof.Id));
  };

  const projectProfessionals = getProjectProfessionals();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate("/be-inspired")}
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Gallery
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Hero Image */}
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8">
<img 
              src={project.image_url_c || project.imageUrl || "/api/placeholder/800/600"} 
              alt={project.title_c || project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
                  {project.title}
                </h1>
                <p className="text-lg md:text-xl opacity-90">
                  {project.subtitle || "A stunning renovation transformation"}
                </p>
              </div>
</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Project Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="card">
                <h2 className="text-2xl font-display font-bold text-primary mb-6">
                  Project Overview
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Project Details */}
              <div className="card">
                <h2 className="text-2xl font-display font-bold text-primary mb-6">
                  Project Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                      <ApperIcon name="Calendar" className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Duration</h3>
                      <p className="text-gray-600">{project.duration || "6-12 months"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-secondary/10 p-2 rounded-lg flex-shrink-0">
                      <ApperIcon name="MapPin" className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                      <p className="text-gray-600">{project.location || "Waikato Region"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-accent/10 p-2 rounded-lg flex-shrink-0">
                      <ApperIcon name="Home" className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Project Type</h3>
                      <p className="text-gray-600">{project.category || "Full Renovation"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-success/10 p-2 rounded-lg flex-shrink-0">
                      <ApperIcon name="CheckCircle" className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Status</h3>
                      <p className="text-gray-600">Completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="card">
                <h2 className="text-2xl font-display font-bold text-primary mb-6">
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(project.features || [
                    "Modern design aesthetic",
                    "Energy-efficient systems",
                    "High-quality materials",
                    "Functional layout optimization",
                    "Sustainable building practices",
                    "Smart home integration"
                  ]).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <ApperIcon name="Check" className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Professionals */}
              {projectProfessionals.length > 0 && (
                <div className="card">
                  <h3 className="text-xl font-display font-bold text-primary mb-4">
                    Project Team
                  </h3>
                  <div className="space-y-4">
                    {projectProfessionals.map((professional) => (
                      <div key={professional.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={professional.logoUrl} 
                          alt={`${professional.name} logo`}
                          className="h-10 max-w-[80px] object-contain"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{professional.name}</h4>
                          <p className="text-sm text-gray-600">{professional.category}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/professional/${professional.Id}`)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="card bg-gradient-to-br from-primary/5 to-secondary/5">
                <h3 className="text-xl font-display font-bold text-primary mb-4">
                  Start Your Project
                </h3>
                <p className="text-gray-600 mb-6">
                  Inspired by this transformation? Let our trusted professionals help bring your vision to life.
                </p>
                <div className="space-y-3">
                  <Button 
                    variant="accent" 
                    className="w-full"
                    onClick={() => navigate("/quiz/who-to-call-first")}
                  >
                    <ApperIcon name="Play" className="h-4 w-4 mr-2" />
                    Take Our Quiz
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/")}
                  >
                    <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                    View Professionals
                  </Button>
                </div>
              </div>

              {/* Share */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Share This Project
                </h3>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)}
                  >
                    <ApperIcon name="Facebook" className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(project.title)}`)}
                  >
                    <ApperIcon name="Twitter" className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`)}
                  >
                    <ApperIcon name="Linkedin" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcasePage;