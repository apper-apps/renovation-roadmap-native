import { useState, useEffect } from "react";
import ProjectCard from "@/components/molecules/ProjectCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getProjects } from "@/services/api/projectService";

const ProjectShowcase = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProjects();
      setProjects(data.filter(project => project.featured));
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProjects} />;

  return (
<section className="pt-8 pb-16 bg-white">
      <div className="container mx-auto px-4">

        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`flex space-x-6 ${!isPaused ? 'animate-slide' : ''}`}>
            {/* First set of projects */}
            {projects.map((project) => (
              <ProjectCard key={project.Id} project={project} size="lg" />
            ))}
            {/* Duplicate for seamless loop */}
            {projects.map((project) => (
              <ProjectCard key={`duplicate-${project.Id}`} project={project} size="lg" />
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Hover over projects to pause the slideshow and view details
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;