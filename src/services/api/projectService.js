class ProjectService {
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getProjects() {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "subtitle_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "professional_ids_c" } },
          { field: { Name: "features_c" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getProjectById(id) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "subtitle_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "professional_ids_c" } },
          { field: { Name: "features_c" } }
        ]
      };

      const response = await apperClient.getRecordById('project_c', id, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getFeaturedProjects() {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "subtitle_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "professional_ids_c" } },
          { field: { Name: "features_c" } }
        ],
        where: [
          {
            FieldName: "featured_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching featured projects:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getProjectsByProfessional(professionalId) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "subtitle_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "professional_ids_c" } },
          { field: { Name: "features_c" } }
        ],
        where: [
          {
            FieldName: "professional_ids_c",
            Operator: "Contains",
            Values: [professionalId.toString()]
          }
        ]
      };

      const response = await apperClient.fetchRecords('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects by professional:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async createProject(projectData) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        records: [{
          Name: projectData.name || projectData.title_c || "New Project",
          title_c: projectData.title_c,
          subtitle_c: projectData.subtitle_c,
          description_c: projectData.description_c,
          image_url_c: projectData.image_url_c,
          category_c: projectData.category_c,
          location_c: projectData.location_c,
          duration_c: projectData.duration_c,
          featured_c: projectData.featured_c || false,
          professional_ids_c: projectData.professional_ids_c,
          features_c: projectData.features_c
        }]
      };

      const response = await apperClient.createRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error("Error creating project:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateProject(id, updates) {
    try {
      const apperClient = this.getApperClient();
      
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are provided
      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.title_c !== undefined) updateData.title_c = updates.title_c;
      if (updates.subtitle_c !== undefined) updateData.subtitle_c = updates.subtitle_c;
      if (updates.description_c !== undefined) updateData.description_c = updates.description_c;
      if (updates.image_url_c !== undefined) updateData.image_url_c = updates.image_url_c;
      if (updates.category_c !== undefined) updateData.category_c = updates.category_c;
      if (updates.location_c !== undefined) updateData.location_c = updates.location_c;
      if (updates.duration_c !== undefined) updateData.duration_c = updates.duration_c;
      if (updates.featured_c !== undefined) updateData.featured_c = updates.featured_c;
      if (updates.professional_ids_c !== undefined) updateData.professional_ids_c = updates.professional_ids_c;
      if (updates.features_c !== undefined) updateData.features_c = updates.features_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error("Error updating project:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async deleteProject(id) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }

        return response.results[0]?.success || false;
      }

      return false;
    } catch (error) {
      console.error("Error deleting project:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

const projectService = new ProjectService();

export const getProjects = () => projectService.getProjects();
export const getProjectById = (id) => projectService.getProjectById(id);
export const getFeaturedProjects = () => projectService.getFeaturedProjects();
export const getProjectsByProfessional = (professionalId) => projectService.getProjectsByProfessional(professionalId);
export const createProject = (projectData) => projectService.createProject(projectData);
export const updateProject = (id, updates) => projectService.updateProject(id, updates);
export const deleteProject = (id) => projectService.deleteProject(id);