// ApperClient Site Settings Service
export const siteSettingsService = {
  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  // Get site settings from database
  async getSiteSettings() {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {
            field: {
              Name: "setting_name_c"
            }
          },
          {
            field: {
              Name: "setting_value_c"
            }
          },
          {
            field: {
              Name: "setting_type_c"
            }
          }
        ]
      };

      const response = await apperClient.fetchRecords('site_settings_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database records into expected format
const settings = {
        siteLogo: '',
        faviconUrl: '',
        siteName: '',
        homePageContent: '',
        footerContent: ''
      };

      if (response.data) {
        response.data.forEach(record => {
          const settingName = record.setting_name_c?.toLowerCase();
          const settingValue = record.setting_value_c;

          if (settingName === 'site_logo' || settingName === 'sitelogo') {
            settings.siteLogo = settingValue || '';
          } else if (settingName === 'favicon_url' || settingName === 'faviconurl') {
            settings.faviconUrl = settingValue || '';
          } else if (settingName === 'site_name' || settingName === 'sitename') {
            settings.siteName = settingValue || '';
          } else if (settingName === 'home_page_content' || settingName === 'homepagecontent') {
            settings.homePageContent = settingValue || '';
          } else if (settingName === 'footer_content' || settingName === 'footercontent') {
            settings.footerContent = settingValue || '';
          }
        });
      }

      return settings;
    } catch (error) {
      console.error("Error fetching site settings:", error?.response?.data?.message || error);
      throw error;
    }
  },

  // Update site settings in database
async initializeSiteSettings() {
    try {
      const apperClient = this.getApperClient();
      
      // Check if settings already exist
      const existingSettings = await this.getSiteSettings();
      if (existingSettings && Object.keys(existingSettings).length > 3) {
        return existingSettings;
      }

      // Create default site settings records
      const defaultSettingsRecords = [
        {
          Name: "Site Logo Setting",
          setting_name_c: "site_logo",
          setting_value_c: "https://content.app-sources.com/s/286081838088918141/uploads/Brand/RR_primary_logo_sml-6273828.png",
          setting_type_c: "text"
        },
        {
          Name: "Favicon Setting", 
          setting_name_c: "favicon_url",
          setting_value_c: "/vite.svg",
          setting_type_c: "text"
        },
        {
          Name: "Site Name Setting",
          setting_name_c: "site_name", 
          setting_value_c: "Renovation Roadmap",
          setting_type_c: "text"
        },
        {
          Name: "Home Page Content Setting",
          setting_name_c: "home_page_content",
          setting_value_c: "Welcome to Renovation Roadmap - Your trusted partner in home renovation projects.",
          setting_type_c: "text"
        },
        {
          Name: "Footer Content Setting",
          setting_name_c: "footer_content",
          setting_value_c: "© 2024 Renovation Roadmap. All rights reserved.",
          setting_type_c: "text"
        }
      ];

      const params = {
        records: defaultSettingsRecords
      };

      const response = await apperClient.createRecord('site_settings_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to initialize site settings ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
      }

      // Return the newly created settings in expected format
      return {
        siteLogo: "https://content.app-sources.com/s/286081838088918141/uploads/Brand/RR_primary_logo_sml-6273828.png",
        faviconUrl: "/vite.svg", 
        siteName: "Renovation Roadmap",
        homePageContent: "Welcome to Renovation Roadmap - Your trusted partner in home renovation projects.",
        footerContent: "© 2024 Renovation Roadmap. All rights reserved."
      };

    } catch (error) {
      console.error("Error initializing site settings:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async updateSiteSettings(settings) {
    try {
      const apperClient = this.getApperClient();

      // Validate URLs if provided
      if (settings.siteLogo) {
        try {
          new URL(settings.siteLogo);
        } catch {
          throw new Error("Invalid site logo URL format");
        }
      }
      
      if (settings.faviconUrl) {
        try {
          new URL(settings.faviconUrl);
        } catch {
          throw new Error("Invalid favicon URL format");
        }
      }

      // Validate content length
      if (settings.homePageContent && settings.homePageContent.length > 1000) {
        throw new Error("Home page content must be less than 1000 characters");
      }

      if (settings.footerContent && settings.footerContent.length > 500) {
        throw new Error("Footer content must be less than 500 characters");
      }

      // Create records for each setting
      const recordsToUpdate = [];

      if (settings.siteLogo !== undefined) {
        recordsToUpdate.push({
          Name: "Site Logo Setting Updated",
          setting_name_c: "site_logo",
          setting_value_c: settings.siteLogo,
          setting_type_c: "text"
        });
      }

      if (settings.faviconUrl !== undefined) {
        recordsToUpdate.push({
          Name: "Favicon Setting Updated",
          setting_name_c: "favicon_url",
          setting_value_c: settings.faviconUrl,
          setting_type_c: "text"
        });
      }

      if (settings.siteName !== undefined) {
        recordsToUpdate.push({
          Name: "Site Name Setting Updated",
          setting_name_c: "site_name",
          setting_value_c: settings.siteName,
          setting_type_c: "text"
        });
      }

      if (settings.homePageContent !== undefined) {
        recordsToUpdate.push({
          Name: "Home Page Content Updated",
          setting_name_c: "home_page_content",
          setting_value_c: settings.homePageContent,
          setting_type_c: "text"
        });
      }

      if (settings.footerContent !== undefined) {
        recordsToUpdate.push({
          Name: "Footer Content Updated",
          setting_name_c: "footer_content",
          setting_value_c: settings.footerContent,
          setting_type_c: "text"
        });
      }

      if (recordsToUpdate.length === 0) {
        return settings;
      }

      // Use create operation for new settings records
      const params = {
        records: recordsToUpdate
      };

      const response = await apperClient.createRecord('site_settings_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update site settings ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
      }

      return settings;
    } catch (error) {
      console.error("Error updating site settings:", error?.response?.data?.message || error);
      throw error;
    }
  },

  // Reset to defaults
async resetToDefaults() {
    const defaultSettings = {
      siteLogo: "https://content.app-sources.com/s/286081838088918141/uploads/Brand/RR_primary_logo_sml-6273828.png",
      faviconUrl: "/vite.svg",
      siteName: "Renovation Roadmap",
      homePageContent: "Welcome to Renovation Roadmap - your comprehensive guide to home renovation in the Waikato region. Connect with trusted professionals and transform your dream home into reality.",
      footerContent: "Connecting homeowners with New Zealand's finest renovation professionals. Your dream home starts with knowing who to call first."
    };

await this.initializeSiteSettings();
    return this.getSiteSettings();
  }
};

export default siteSettingsService;