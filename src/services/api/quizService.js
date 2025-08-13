import quizzesData from "@/services/mockData/quizzes.json";

let quizzes = [...quizzesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getQuizzes = async () => {
  await delay(300);
  return [...quizzes];
};

export const getQuizById = async (id) => {
  await delay(250);
  return quizzes.find(quiz => quiz.Id === id) || null;
};

export const createQuiz = async (quizData) => {
  await delay(400);
  const newQuiz = {
    ...quizData,
    Id: `quiz-${Date.now()}`
  };
  quizzes.push(newQuiz);
  return { ...newQuiz };
};

export const updateQuiz = async (id, updates) => {
  await delay(350);
  const index = quizzes.findIndex(quiz => quiz.Id === id);
  if (index === -1) {
    throw new Error("Quiz not found");
  }
  quizzes[index] = { ...quizzes[index], ...updates };
  return { ...quizzes[index] };
};

export const deleteQuiz = async (id) => {
  await delay(300);
  const index = quizzes.findIndex(quiz => quiz.Id === id);
  if (index === -1) {
    throw new Error("Quiz not found");
  }
  const deleted = quizzes.splice(index, 1)[0];
  return { ...deleted };
};