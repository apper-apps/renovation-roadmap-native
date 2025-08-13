import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, size = "md" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${project.Id}`);
  };

  const sizeClasses = {
    sm: "w-64 h-48",
    md: "w-80 h-60",
    lg: "w-96 h-72"
  };

  return (
    <div 
      className={`project-card ${sizeClasses[size]} flex-shrink-0`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img 
        src={project.imageUrl} 
        alt={project.title}
        className="w-full h-full object-cover"
      />
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h3 className="text-xl font-display font-semibold mb-2">
              {project.title}
            </h3>
            <p className="text-sm opacity-90 line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;