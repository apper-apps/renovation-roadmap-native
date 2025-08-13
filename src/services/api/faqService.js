import faqsData from "@/services/mockData/faqs.json";

let faqs = [...faqsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getFAQs = async () => {
  await delay(300);
  return [...faqs];
};

export const getFAQById = async (id) => {
  await delay(250);
  return faqs.find(faq => faq.Id === id) || null;
};

export const createFAQ = async (faqData) => {
  await delay(400);
  const newFAQ = {
    ...faqData,
    Id: Math.max(...faqs.map(f => f.Id)) + 1
  };
  faqs.push(newFAQ);
  return { ...newFAQ };
};

export const updateFAQ = async (id, updates) => {
  await delay(350);
  const index = faqs.findIndex(faq => faq.Id === id);
  if (index === -1) {
    throw new Error("FAQ not found");
  }
  faqs[index] = { ...faqs[index], ...updates };
  return { ...faqs[index] };
};

export const deleteFAQ = async (id) => {
  await delay(300);
  const index = faqs.findIndex(faq => faq.Id === id);
  if (index === -1) {
    throw new Error("FAQ not found");
  }
  const deleted = faqs.splice(index, 1)[0];
  return { ...deleted };
};