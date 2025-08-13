import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, size = "md" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${project.Id}`);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
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
{imageLoading && (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img 
        src={imageError ? "/api/placeholder/800/600" : project.imageUrl} 
        alt={project.title}
        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: imageLoading ? 'none' : 'block' }}
      />
      {imageError && !imageLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">🏠</div>
            <div className="text-sm">Image unavailable</div>
          </div>
        </div>
      )}
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