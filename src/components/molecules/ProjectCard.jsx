import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, size = "md" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

const handleClick = () => {
    if (project?.Id) {
      navigate(`/project/${project.Id}`);
    }
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
{imageLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
<img 
        src={imageError ? "/api/placeholder/800/600" : (project.image_url_c || project.imageUrl || "/api/placeholder/800/600")} 
        alt={project.title_c || project.title || "Project image"}
        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: imageLoading ? 'none' : 'block' }}
      />
      
      {/* Gallery Indicator - Show if project has multiple images */}
      {project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0 && (
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          {project.gallery.length + 1}
        </div>
      )}
      {imageError && !imageLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">🏠</div>
            <div className="text-sm">Image unavailable</div>
          </div>
        </div>
      )}
      {isHovered && !imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
<div className="p-6 text-white">
            <h3 className="text-xl font-display font-semibold mb-2">
              {project.title_c || project.title || "Untitled Project"}
            </h3>
            <p className="text-sm opacity-90 line-clamp-2">
              {project.description_c || project.description || "No description available"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;