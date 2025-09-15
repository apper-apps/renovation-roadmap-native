import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import siteSettingsService from '@/services/api/siteSettingsService';

const SiteSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [settings, setSettings] = useState({
    siteLogo: '',
    faviconUrl: '',
    siteName: '',
    homePageContent: '',
    footerContent: ''
  });
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState('');

  // Load current settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const currentSettings = await siteSettingsService.getSiteSettings();
        setSettings({
          siteLogo: currentSettings.siteLogo || '',
          faviconUrl: currentSettings.faviconUrl || '',
          siteName: currentSettings.siteName || 'Renovation Roadmap',
          homePageContent: currentSettings.homePageContent || '',
          footerContent: currentSettings.footerContent || ''
        });
        setLogoPreview(currentSettings.siteLogo || '');
      } catch (error) {
        console.error("Error loading site settings:", error);
        toast.error("Failed to load site settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Validate URL format
  const validateUrl = (url) => {
    if (!url) return true; // Empty URLs are acceptable
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear errors for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Update logo preview in real-time
    if (field === 'siteLogo') {
      if (validateUrl(value)) {
        setLogoPreview(value);
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (settings.siteLogo && !validateUrl(settings.siteLogo)) {
      newErrors.siteLogo = 'Please enter a valid URL for the site logo';
    }

    if (settings.faviconUrl && !validateUrl(settings.faviconUrl)) {
      newErrors.faviconUrl = 'Please enter a valid URL for the favicon';
    }

    if (!settings.siteName?.trim()) {
      newErrors.siteName = 'Site name is required';
    }

    if (settings.homePageContent && settings.homePageContent.length > 1000) {
      newErrors.homePageContent = 'Home page content must be less than 1000 characters';
    }

    if (settings.footerContent && settings.footerContent.length > 500) {
      newErrors.footerContent = 'Footer content must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    try {
      setSaving(true);
      await siteSettingsService.updateSiteSettings(settings);
      toast.success("Site settings updated successfully!");
    } catch (error) {
      console.error("Error updating site settings:", error);
      toast.error(error.message || "Failed to update site settings");
    } finally {
      setSaving(false);
    }
  };

  // Handle reset to defaults
  const handleResetDefaults = async () => {
    if (!confirm("Are you sure you want to reset all settings to defaults? This cannot be undone.")) {
      return;
    }

    try {
      setResetting(true);
      await siteSettingsService.resetToDefaults();
      
      // Reload settings
      const defaultSettings = await siteSettingsService.getSiteSettings();
      setSettings({
        siteLogo: defaultSettings.siteLogo || '',
        faviconUrl: defaultSettings.faviconUrl || '',
        siteName: defaultSettings.siteName || 'Renovation Roadmap',
        homePageContent: defaultSettings.homePageContent || '',
        footerContent: defaultSettings.footerContent || ''
      });
      setLogoPreview(defaultSettings.siteLogo || '');
      setErrors({});
      
      toast.success("Settings reset to defaults successfully!");
    } catch (error) {
      console.error("Error resetting settings:", error);
      toast.error("Failed to reset settings to defaults");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin mr-3">
              <ApperIcon name="Loader" className="h-6 w-6" />
            </div>
            <span>Loading site settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Settings</h1>
          <p className="text-gray-600">
            Customize your site's appearance and content. Changes will be reflected across all pages.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Branding Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Image" className="h-5 w-5 mr-2" />
              Branding & Identity
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Site Logo */}
              <div className="space-y-2">
                <Label htmlFor="siteLogo">Site Logo URL</Label>
                <Input
                  id="siteLogo"
                  type="url"
                  value={settings.siteLogo}
                  onChange={(e) => handleInputChange('siteLogo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className={errors.siteLogo ? 'border-red-500' : ''}
                />
                {errors.siteLogo && (
                  <p className="text-sm text-red-600">{errors.siteLogo}</p>
                )}
                <p className="text-sm text-gray-500">
                  Recommended: PNG or SVG format, max height 48px
                </p>
              </div>

              {/* Logo Preview */}
              <div className="space-y-2">
                <Label>Logo Preview</Label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[80px] flex items-center justify-center">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="h-12 w-auto max-w-full"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">No logo URL provided</div>
                  )}
                  <div style={{ display: 'none' }} className="text-red-500 text-sm">
                    Invalid logo URL
                  </div>
                </div>
              </div>

              {/* Favicon URL */}
              <div className="space-y-2">
                <Label htmlFor="faviconUrl">Favicon URL</Label>
                <Input
                  id="faviconUrl"
                  type="url"
                  value={settings.faviconUrl}
                  onChange={(e) => handleInputChange('faviconUrl', e.target.value)}
                  placeholder="/favicon.ico"
                  className={errors.faviconUrl ? 'border-red-500' : ''}
                />
                {errors.faviconUrl && (
                  <p className="text-sm text-red-600">{errors.faviconUrl}</p>
                )}
                <p className="text-sm text-gray-500">
                  Recommended: 32x32 or 16x16 pixels, ICO or PNG format
                </p>
              </div>

              {/* Site Name */}
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  placeholder="Renovation Roadmap"
                  className={errors.siteName ? 'border-red-500' : ''}
                />
                {errors.siteName && (
                  <p className="text-sm text-red-600">{errors.siteName}</p>
                )}
                <p className="text-sm text-gray-500">
                  Used in the header and throughout the site
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="FileText" className="h-5 w-5 mr-2" />
              Page Content
            </h2>

            {/* Home Page Content */}
            <div className="space-y-2">
              <Label htmlFor="homePageContent">Home Page Content</Label>
              <textarea
                id="homePageContent"
                value={settings.homePageContent}
                onChange={(e) => handleInputChange('homePageContent', e.target.value)}
                placeholder="Welcome to Renovation Roadmap - your guide to home renovation..."
                rows={4}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical ${
                  errors.homePageContent ? 'border-red-500' : ''
                }`}
              />
              {errors.homePageContent && (
                <p className="text-sm text-red-600">{errors.homePageContent}</p>
              )}
              <p className="text-sm text-gray-500">
                Main content for the home page hero section. Max 1000 characters.
              </p>
            </div>

            {/* Footer Content */}
            <div className="space-y-2">
              <Label htmlFor="footerContent">Footer Content</Label>
              <textarea
                id="footerContent"
                value={settings.footerContent}
                onChange={(e) => handleInputChange('footerContent', e.target.value)}
                placeholder="Connecting homeowners with New Zealand's finest renovation professionals..."
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical ${
                  errors.footerContent ? 'border-red-500' : ''
                }`}
              />
              {errors.footerContent && (
                <p className="text-sm text-red-600">{errors.footerContent}</p>
              )}
              <p className="text-sm text-gray-500">
                Description text shown in the footer. Max 500 characters.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="flex items-center justify-center"
            >
              {saving && <ApperIcon name="Loader" className="h-4 w-4 mr-2 animate-spin" />}
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleResetDefaults}
              disabled={saving || resetting}
              className="flex items-center justify-center"
            >
              {resetting && <ApperIcon name="Loader" className="h-4 w-4 mr-2 animate-spin" />}
              {resetting ? 'Resetting...' : 'Reset to Defaults'}
            </Button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <ApperIcon name="HelpCircle" className="h-4 w-4 mr-2" />
            Tips for Best Results
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use high-quality images for logos (PNG or SVG recommended)</li>
            <li>• Ensure logo images work well on both light and dark backgrounds</li>
            <li>• Keep content concise and focused on your key message</li>
            <li>• Test changes on both desktop and mobile devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsPage;