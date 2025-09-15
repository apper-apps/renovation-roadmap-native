// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data store
let siteSettingsData = null;

const loadMockData = async () => {
  if (!siteSettingsData) {
    try {
      const response = await fetch('/src/services/mockData/siteSettings.json');
      siteSettingsData = await response.json();
    } catch (error) {
      // Fallback data if JSON file not available
      siteSettingsData = {
        Id: 1,
        siteLogo: "https://content.app-sources.com/s/286081838088918141/uploads/Brand/RR_primary_logo_sml-6273828.png",
        faviconUrl: "/vite.svg",
        siteName: "Renovation Roadmap",
        lastUpdated: new Date().toISOString()
      };
    }
  }
  return siteSettingsData;
};

// Site Settings Service
export const siteSettingsService = {
  // Get site settings
  async getSiteSettings() {
    await delay(200);
    try {
      const data = await loadMockData();
      return { ...data }; // Return copy
    } catch (error) {
      console.error("Error fetching site settings:", error);
      throw error;
    }
  },

  // Update site settings
  async updateSiteSettings(settings) {
    await delay(300);
    try {
      const data = await loadMockData();
      
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

      // Update the settings
      Object.assign(siteSettingsData, {
        ...settings,
        lastUpdated: new Date().toISOString()
      });

      return { ...siteSettingsData }; // Return copy
    } catch (error) {
      console.error("Error updating site settings:", error);
      throw error;
    }
  },

  // Reset to defaults
  async resetToDefaults() {
    await delay(200);
    try {
      siteSettingsData = {
        Id: 1,
        siteLogo: "https://content.app-sources.com/s/286081838088918141/uploads/Brand/RR_primary_logo_sml-6273828.png",
        faviconUrl: "/vite.svg",
        siteName: "Renovation Roadmap",
        lastUpdated: new Date().toISOString()
      };
      
      return { ...siteSettingsData };
    } catch (error) {
      console.error("Error resetting site settings:", error);
      throw error;
    }
  }
};

export default siteSettingsService;