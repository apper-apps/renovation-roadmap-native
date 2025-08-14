import mockQuizzes from "@/services/mockData/updatedQuizzes.json";

let quizzes = [...mockQuizzes];
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
    updatedAt: new Date().toISOString()
  };
  quizzes.push(newQuiz);
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
    updatedAt: new Date().toISOString() 
  };
  return { ...quizzes[index] };
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