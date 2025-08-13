import enquiriesData from "@/services/mockData/enquiries.json";

let enquiries = [...enquiriesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getEnquiries = async () => {
  await delay(300);
  return [...enquiries];
};

export const getEnquiryById = async (id) => {
  await delay(250);
  return enquiries.find(enquiry => enquiry.Id === id) || null;
};

export const getEnquiriesByProfessional = async (professionalId) => {
  await delay(300);
  return enquiries.filter(enquiry => enquiry.professionalId === professionalId);
};

export const createEnquiry = async (enquiryData) => {
  await delay(400);
  const newEnquiry = {
    ...enquiryData,
    Id: Math.max(...enquiries.map(e => e.Id)) + 1,
    createdAt: new Date().toISOString()
  };
  enquiries.push(newEnquiry);
  return { ...newEnquiry };
};

export const updateEnquiry = async (id, updates) => {
  await delay(350);
  const index = enquiries.findIndex(enquiry => enquiry.Id === id);
  if (index === -1) {
    throw new Error("Enquiry not found");
  }
  enquiries[index] = { ...enquiries[index], ...updates };
  return { ...enquiries[index] };
};

export const deleteEnquiry = async (id) => {
  await delay(300);
  const index = enquiries.findIndex(enquiry => enquiry.Id === id);
  if (index === -1) {
    throw new Error("Enquiry not found");
  }
  const deleted = enquiries.splice(index, 1)[0];
  return { ...deleted };
};