import mockQuizzes from "@/services/mockData/updatedQuizzes.json";

let quizzes = [...mockQuizzes];
let quizSteps = []; // Store quiz steps for enhanced quiz management
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getQuizzes = async () => {
  await delay(300);
  return [...quizzes];
};

export const getQuizById = async (id) => {
  await delay(250);
  const quizId = typeof id === 'string' ? parseInt(id) : id;
  return quizzes.find(quiz => quiz.Id === quizId) || null;
};

export const createQuiz = async (quizData) => {
  await delay(400);
  const newQuiz = {
    ...quizData,
    Id: quizzes.length > 0 ? Math.max(...quizzes.map(q => q.Id)) + 1 : 1,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Enhanced fields for advanced quiz management
    quizLogic: quizData.quizLogic || {},
    optionThumbnails: quizData.optionThumbnails || {},
    conditionalFlow: quizData.conditionalFlow || {}
  };
  quizzes.push(newQuiz);
  
  // Create associated quiz steps if provided
  if (quizData.steps && quizData.steps.length > 0) {
    await createQuizSteps(newQuiz.Id, quizData.steps);
  }
  
  return { ...newQuiz };
};

export const updateQuiz = async (id, updates) => {
  await delay(350);
  const quizId = typeof id === 'string' ? parseInt(id) : id;
  const index = quizzes.findIndex(quiz => quiz.Id === quizId);
  if (index === -1) {
    throw new Error("Quiz not found");
  }
  quizzes[index] = { 
    ...quizzes[index], 
    ...updates, 
    updatedAt: new Date().toISOString(),
    // Update enhanced fields
    quizLogic: updates.quizLogic || quizzes[index].quizLogic,
    optionThumbnails: updates.optionThumbnails || quizzes[index].optionThumbnails,
    conditionalFlow: updates.conditionalFlow || quizzes[index].conditionalFlow
  };
  
  // Update quiz steps if provided
  if (updates.steps) {
    await updateQuizSteps(quizId, updates.steps);
  }
  
  return { ...quizzes[index] };
};

// Quiz Steps Management
export const createQuizSteps = async (quizId, steps) => {
  await delay(300);
  const newSteps = steps.map((step, index) => ({
    ...step,
    Id: Date.now() + index,
    quiz_c: quizId,
    order_c: index + 1,
    createdAt: new Date().toISOString()
  }));
  quizSteps.push(...newSteps);
  return newSteps;
};

export const updateQuizSteps = async (quizId, steps) => {
  await delay(300);
  // Remove existing steps for this quiz
  quizSteps = quizSteps.filter(step => step.quiz_c !== quizId);
  // Add updated steps
  const updatedSteps = await createQuizSteps(quizId, steps);
  return updatedSteps;
};

export const getQuizSteps = async (quizId) => {
  await delay(200);
  return quizSteps.filter(step => step.quiz_c === quizId);
};

export const deleteQuiz = async (id) => {
  await delay(300);
  const quizId = typeof id === 'string' ? parseInt(id) : id;
  const index = quizzes.findIndex(quiz => quiz.Id === quizId);
  if (index === -1) {
    throw new Error("Quiz not found");
  }
  const deleted = quizzes.splice(index, 1)[0];
  return { ...deleted };
};

// Analytics functions
export const recordQuizStart = async (quizId) => {
  await delay(100);
  // In production, this would send to analytics service
  console.log(`Quiz ${quizId} started`);
};

export const recordQuizCompletion = async (quizId, results, timeSpent) => {
  await delay(100);
  // In production, this would send to analytics service
  console.log(`Quiz ${quizId} completed`, { results, timeSpent });
};

export const getQuizAnalytics = async (quizId) => {
  await delay(300);
  // Mock analytics data
  return {
    totalStarts: 156,
    totalCompletions: 142,
    completionRate: 91.0,
    averageTimeSpent: 4.2,
    dropOffPoints: [
      { questionId: 2, dropOffRate: 5.1 },
      { questionId: 4, dropOffRate: 3.8 }
    ],
    professionalRecommendations: {
      1: 89, // JCC Build
      2: 67, // Architect
      3: 45  // Interior Designer
    }
  };
};

export const publishQuiz = async (id) => {
  await delay(300);
  return updateQuiz(id, { status: 'published' });
};

export const unpublishQuiz = async (id) => {
  await delay(300);
  return updateQuiz(id, { status: 'draft' });
};