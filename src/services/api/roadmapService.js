import roadmapStagesData from "@/services/mockData/roadmapStages.json";

let roadmapStages = [...roadmapStagesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getRoadmapStages = async () => {
  await delay(300);
  return [...roadmapStages];
};

export const getRoadmapStageById = async (id) => {
  await delay(250);
  return roadmapStages.find(stage => stage.Id === id) || null;
};

export const createRoadmapStage = async (stageData) => {
  await delay(400);
  const newStage = {
    ...stageData,
    Id: Math.max(...roadmapStages.map(s => s.Id)) + 1
  };
  roadmapStages.push(newStage);
  return { ...newStage };
};

export const updateRoadmapStage = async (id, updates) => {
  await delay(350);
  const index = roadmapStages.findIndex(stage => stage.Id === id);
  if (index === -1) {
    throw new Error("Roadmap stage not found");
  }
  roadmapStages[index] = { ...roadmapStages[index], ...updates };
  return { ...roadmapStages[index] };
};

export const deleteRoadmapStage = async (id) => {
  await delay(300);
  const index = roadmapStages.findIndex(stage => stage.Id === id);
  if (index === -1) {
    throw new Error("Roadmap stage not found");
  }
  const deleted = roadmapStages.splice(index, 1)[0];
  return { ...deleted };
};