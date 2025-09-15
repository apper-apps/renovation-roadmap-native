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
        siteName: ''
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

      // Create records for each setting
      const recordsToUpdate = [];

      if (settings.siteLogo !== undefined) {
        recordsToUpdate.push({
          setting_name_c: "site_logo",
          setting_value_c: settings.siteLogo,
          setting_type_c: "text"
        });
      }

      if (settings.faviconUrl !== undefined) {
        recordsToUpdate.push({
          setting_name_c: "favicon_url",
          setting_value_c: settings.faviconUrl,
          setting_type_c: "text"
        });
      }

      if (settings.siteName !== undefined) {
        recordsToUpdate.push({
          setting_name_c: "site_name",
          setting_value_c: settings.siteName,
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
      siteName: "Renovation Roadmap"
    };

    await this.updateSiteSettings(defaultSettings);
    return defaultSettings;
  }
};

export default siteSettingsService;