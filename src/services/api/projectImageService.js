class ProjectImageService {
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "order_c" } }
        ],
        orderBy: [
          {
            fieldName: "order_c",
            sorttype: "ASC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords('project_image_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching project images:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "order_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('project_image_c', id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project image with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async getImagesByProjectId(projectId) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "order_c" } }
        ],
        where: [
          {
            FieldName: "project_id_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          {
            fieldName: "order_c",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('project_image_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching images for project:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async create(imageData) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        records: [{
          name_c: imageData.name_c,
          project_id_c: parseInt(imageData.project_id_c),
          image_url_c: imageData.image_url_c,
          order_c: imageData.order_c || 0
        }]
      };
      
      const response = await apperClient.createRecord('project_image_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create project images ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project image:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, updates) {
    try {
      const apperClient = this.getApperClient();
      
      const updateData = { Id: parseInt(id) };
      
      // Only include updateable fields that are provided
      if (updates.name_c !== undefined) updateData.name_c = updates.name_c;
      if (updates.project_id_c !== undefined) updateData.project_id_c = parseInt(updates.project_id_c);
      if (updates.image_url_c !== undefined) updateData.image_url_c = updates.image_url_c;
      if (updates.order_c !== undefined) updateData.order_c = updates.order_c;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('project_image_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update project images ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project image:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async delete(ids) {
    try {
      const apperClient = this.getApperClient();
      
      const recordIds = Array.isArray(ids) ? ids.map(id => parseInt(id)) : [parseInt(ids)];
      
      const params = {
        RecordIds: recordIds
      };
      
      const response = await apperClient.deleteRecord('project_image_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete project images ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length === recordIds.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project images:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
}

const projectImageService = new ProjectImageService();
export const { getAll: getProjectImages, getById: getProjectImageById, getImagesByProjectId, create: createProjectImage, update: updateProjectImage, delete: deleteProjectImage } = projectImageService;