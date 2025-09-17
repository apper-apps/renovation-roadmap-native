import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getProjects = async () => {
  await delay(300);
  return [...projects];
};

export const getProjectById = async (id) => {
  await delay(250);
  return projects.find(project => project.Id === id) || null;
};

export const getFeaturedProjects = async () => {
  await delay(300);
  return projects.filter(project => project.featured);
};

export const getProjectsByProfessional = async (professionalId) => {
  await delay(300);
  return projects.filter(project => 
    project.professionalIds && 
    Array.isArray(project.professionalIds) && 
    project.professionalIds.includes(professionalId)
  );
};

export const createProject = async (projectData) => {
  await delay(400);
  const maxId = projects.length > 0 ? Math.max(...projects.map(p => p.Id)) : 0;
  const newProject = {
    ...projectData,
    Id: maxId + 1,
    featured: false
  };
  projects.push(newProject);
  return { ...newProject };
};

export const updateProject = async (id, updates) => {
  await delay(350);
  const index = projects.findIndex(project => project.Id === id);
  if (index === -1) {
    throw new Error("Project not found");
  }
  projects[index] = { ...projects[index], ...updates };
  return { ...projects[index] };
};

export const deleteProject = async (id) => {
  await delay(300);
  const index = projects.findIndex(project => project.Id === id);
  if (index === -1) {
    throw new Error("Project not found");
  }
  const deleted = projects.splice(index, 1)[0];
  return { ...deleted };
};