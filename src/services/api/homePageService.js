class HomePageService {
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getHomePageSections() {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "section_order_c" } }
        ],
        orderBy: [
          {
            fieldName: "section_order_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('home_page_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching home page sections:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getHomePageSectionById(id) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "section_order_c" } }
        ]
      };

      const response = await apperClient.getRecordById('home_page_c', id, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching home page section with ID ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async createHomePageSection(sectionData) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        records: [{
          Name: sectionData.name || sectionData.title_c || "New Section",
          title_c: sectionData.title_c,
          description_c: sectionData.description_c,
          image_url_c: sectionData.image_url_c,
          section_order_c: sectionData.section_order_c || 1
        }]
      };

      const response = await apperClient.createRecord('home_page_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create home page section ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
      console.error("Error creating home page section:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateHomePageSection(id, updates) {
    try {
      const apperClient = this.getApperClient();
      
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are provided
      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.title_c !== undefined) updateData.title_c = updates.title_c;
      if (updates.description_c !== undefined) updateData.description_c = updates.description_c;
      if (updates.image_url_c !== undefined) updateData.image_url_c = updates.image_url_c;
      if (updates.section_order_c !== undefined) updateData.section_order_c = updates.section_order_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('home_page_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update home page section ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
      console.error("Error updating home page section:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async deleteHomePageSection(id) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('home_page_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete home page section ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
      console.error("Error deleting home page section:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async initializeDefaultHomePage() {
    try {
      // Check if home page sections already exist
      const existingSections = await this.getHomePageSections();
      if (existingSections && existingSections.length > 0) {
        return existingSections;
      }

      // Create default home page sections
      const defaultSections = [
        {
          name: "Hero Section",
          title_c: "Transform Your Home with Expert Guidance",
          description_c: "Connect with trusted renovation professionals and get personalized recommendations for your next project.",
          image_url_c: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          section_order_c: 1
        },
        {
          name: "Featured Projects",
          title_c: "Featured Projects", 
          description_c: "Explore our showcase of successful renovation projects completed by our network of professionals.",
          image_url_c: "",
          section_order_c: 2
        },
        {
          name: "Professional Categories",
          title_c: "Find the Right Professional",
          description_c: "Browse our carefully vetted professionals by category to find the perfect match for your project.",
          image_url_c: "",
          section_order_c: 3
        }
      ];

      const createdSections = [];
      for (const section of defaultSections) {
        try {
          const created = await this.createHomePageSection(section);
          if (created) {
            createdSections.push(created);
          }
        } catch (error) {
          console.error(`Error creating section "${section.name}":`, error);
        }
      }

      return createdSections;
    } catch (error) {
      console.error("Error initializing default home page:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

const homePageService = new HomePageService();
export default homePageService;