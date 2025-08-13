import mockProfessionals from "@/services/mockData/updatedProfessionals.json";

let professionals = [...mockProfessionals];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getProfessionals = async () => {
  await delay(300);
  return [...professionals];
};

export const getProfessionalById = async (id) => {
  await delay(250);
  return professionals.find(professional => professional.Id === id) || null;
};

export const createProfessional = async (professionalData) => {
  await delay(400);
  const newProfessional = {
    ...professionalData,
    Id: Math.max(...professionals.map(p => p.Id)) + 1,
    status: "active"
  };
  professionals.push(newProfessional);
  return { ...newProfessional };
};

export const updateProfessional = async (id, updates) => {
  await delay(350);
  const index = professionals.findIndex(professional => professional.Id === id);
  if (index === -1) {
    throw new Error("Professional not found");
  }
  professionals[index] = { ...professionals[index], ...updates };
  return { ...professionals[index] };
};

export const deleteProfessional = async (id) => {
  await delay(300);
  const index = professionals.findIndex(professional => professional.Id === id);
  if (index === -1) {
    throw new Error("Professional not found");
  }
  const deleted = professionals.splice(index, 1)[0];
  return { ...deleted };
};