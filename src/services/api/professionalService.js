// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'professional_c';

export const getProfessionals = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "type_c" } },
        { field: { Name: "specialty_c" } },
        { field: { Name: "location_c" } },
        { field: { Name: "rating_c" } },
        { field: { Name: "review_count_c" } },
        { field: { Name: "description_c" } },
        { field: { Name: "services_c" } },
        { field: { Name: "logo_url_c" } },
        { field: { Name: "website_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "embed_code_c" } },
        { field: { Name: "favicon_url_c" } }
      ],
      orderBy: [
        {
          fieldName: "Name",
          sorttype: "ASC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error("Error fetching professionals:", response.message);
      return [];
    }
    
    // Transform data to match expected format
    return response.data?.map(professional => ({
      Id: professional.Id,
      name: professional.Name,
      type: professional.type_c,
      specialty: professional.specialty_c,
      location: professional.location_c,
      rating: professional.rating_c,
      reviewCount: professional.review_count_c,
      description: professional.description_c,
      services: professional.services_c,
      logoUrl: professional.logo_url_c,
      website: professional.website_c,
      phone: professional.phone_c,
      email: professional.email_c,
      status: professional.status_c,
      embed_code_c: professional.embed_code_c,
      faviconUrl: professional.favicon_url_c,
      category: professional.type_c // Map type to category for UI compatibility
    })) || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching professionals:", error?.response?.data?.message);
    } else {
      console.error("Error fetching professionals:", error);
    }
    return [];
  }
};

export const getProfessionalById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "type_c" } },
        { field: { Name: "specialty_c" } },
        { field: { Name: "location_c" } },
        { field: { Name: "rating_c" } },
        { field: { Name: "review_count_c" } },
        { field: { Name: "description_c" } },
        { field: { Name: "services_c" } },
        { field: { Name: "logo_url_c" } },
        { field: { Name: "website_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "embed_code_c" } },
        { field: { Name: "favicon_url_c" } }
      ]
    };
    
    const response = await apperClient.getRecordById(tableName, id, params);
    
    if (!response || !response.data) {
      return null;
    }
    
    const professional = response.data;
    
    // Transform data to match expected format
    return {
      Id: professional.Id,
      name: professional.Name,
      type: professional.type_c,
      specialty: professional.specialty_c,
      location: professional.location_c,
      rating: professional.rating_c,
      reviewCount: professional.review_count_c,
      description: professional.description_c,
      services: professional.services_c,
      logoUrl: professional.logo_url_c,
      website: professional.website_c,
      phone: professional.phone_c,
      email: professional.email_c,
      status: professional.status_c,
      embed_code_c: professional.embed_code_c,
      faviconUrl: professional.favicon_url_c,
      category: professional.type_c // Map type to category for UI compatibility
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching professional with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(`Error fetching professional with ID ${id}:`, error);
    }
    return null;
  }
};

export const createProfessional = async (professionalData) => {
  try {
    const params = {
      records: [
        {
          Name: professionalData.name,
          type_c: professionalData.type,
          specialty_c: professionalData.specialty,
          location_c: professionalData.location,
          rating_c: professionalData.rating,
          review_count_c: professionalData.reviewCount,
          description_c: professionalData.description,
          services_c: professionalData.services,
          logo_url_c: professionalData.logoUrl,
          website_c: professionalData.website,
          phone_c: professionalData.phone,
          email_c: professionalData.email,
          status_c: professionalData.status || "active",
          embed_code_c: professionalData.embed_code_c,
          favicon_url_c: professionalData.faviconUrl
        }
      ]
    };
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error creating professional:", response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} professional records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to create professional");
      }
      
      if (successfulRecords.length > 0) {
        const created = successfulRecords[0].data;
        return {
          Id: created.Id,
          name: created.Name,
          type: created.type_c,
          specialty: created.specialty_c,
          location: created.location_c,
          rating: created.rating_c,
          reviewCount: created.review_count_c,
          description: created.description_c,
          services: created.services_c,
          logoUrl: created.logo_url_c,
          website: created.website_c,
          phone: created.phone_c,
          email: created.email_c,
          status: created.status_c,
          embed_code_c: created.embed_code_c,
          faviconUrl: created.favicon_url_c,
          category: created.type_c
        };
      }
    }
    
    throw new Error("No professional data returned");
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating professional:", error?.response?.data?.message);
    } else {
      console.error("Error creating professional:", error);
    }
    throw error;
  }
};

export const updateProfessional = async (id, updates) => {
  try {
    const params = {
      records: [
        {
          Id: id,
          Name: updates.name,
          type_c: updates.type,
          specialty_c: updates.specialty,
          location_c: updates.location,
          rating_c: updates.rating,
          review_count_c: updates.reviewCount,
          description_c: updates.description,
          services_c: updates.services,
          logo_url_c: updates.logoUrl,
          website_c: updates.website,
          phone_c: updates.phone,
          email_c: updates.email,
          status_c: updates.status,
          embed_code_c: updates.embed_code_c,
          favicon_url_c: updates.faviconUrl
        }
      ]
    };
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error updating professional:", response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} professional records:${JSON.stringify(failedUpdates)}`);
        throw new Error("Failed to update professional");
      }
      
      if (successfulUpdates.length > 0) {
        const updated = successfulUpdates[0].data;
        return {
          Id: updated.Id,
          name: updated.Name,
          type: updated.type_c,
          specialty: updated.specialty_c,
          location: updated.location_c,
          rating: updated.rating_c,
          reviewCount: updated.review_count_c,
          description: updated.description_c,
          services: updated.services_c,
          logoUrl: updated.logo_url_c,
          website: updated.website_c,
          phone: updated.phone_c,
          email: updated.email_c,
          status: updated.status_c,
          embed_code_c: updated.embed_code_c,
          faviconUrl: updated.favicon_url_c,
          category: updated.type_c
        };
      }
    }
    
    throw new Error("No updated professional data returned");
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating professional:", error?.response?.data?.message);
    } else {
      console.error("Error updating professional:", error);
    }
    throw error;
  }
};

export const deleteProfessional = async (id) => {
  try {
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error deleting professional:", response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} professional records:${JSON.stringify(failedDeletions)}`);
        throw new Error("Failed to delete professional");
      }
      
      return successfulDeletions.length > 0;
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting professional:", error?.response?.data?.message);
    } else {
      console.error("Error deleting professional:", error);
    }
    throw error;
  }
};