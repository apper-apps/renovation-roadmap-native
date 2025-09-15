import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { siteSettingsService } from '@/services/api/siteSettingsService';

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState({
    siteLogo: '',
    faviconUrl: '',
    siteName: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Load current settings
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const data = await siteSettingsService.getSiteSettings();
        setSettings({
          siteLogo: data.siteLogo || '',
          faviconUrl: data.faviconUrl || '',
          siteName: data.siteName || ''
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error loading site settings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await siteSettingsService.updateSiteSettings(settings);
      
      // Update favicon in real-time
      if (settings.faviconUrl) {
        const faviconLink = document.querySelector("link[rel*='icon']") || document.createElement('link');
        faviconLink.type = 'image/x-icon';
        faviconLink.rel = 'shortcut icon';
        faviconLink.href = settings.faviconUrl;
        document.getElementsByTagName('head')[0].appendChild(faviconLink);
      }

      toast.success('Site settings updated successfully!');
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to update settings: ${err.message}`);
      console.error("Error updating site settings:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Are you sure you want to reset to default settings? This action cannot be undone.')) {
      return;
    }

    setUpdating(true);
    try {
      const defaultSettings = await siteSettingsService.resetToDefaults();
      setSettings({
        siteLogo: defaultSettings.siteLogo || '',
        faviconUrl: defaultSettings.faviconUrl || '',
        siteName: defaultSettings.siteName || ''
      });
      
      // Update favicon
      const faviconLink = document.querySelector("link[rel*='icon']") || document.createElement('link');
      faviconLink.type = 'image/x-icon';
      faviconLink.rel = 'shortcut icon';
      faviconLink.href = defaultSettings.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(faviconLink);

      toast.success('Settings reset to defaults successfully!');
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to reset settings: ${err.message}`);
      console.error("Error resetting site settings:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading />;
  if (error && !settings.siteLogo) return <Error message={error} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Settings</h1>
          <p className="text-gray-600">
            Manage your site-wide branding settings including logo and favicon that appear across the entire application.
          </p>
        </div>

        {/* Current Logo Preview */}
        {settings.siteLogo && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Current Site Logo</h3>
            <img 
              src={settings.siteLogo} 
              alt="Current site logo" 
              className="h-16 max-w-[200px] object-contain bg-white p-2 rounded border"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Logo URL */}
          <div>
            <Label htmlFor="siteLogo">Site Logo URL</Label>
            <Input
              id="siteLogo"
              type="url"
              value={settings.siteLogo}
              onChange={(e) => handleInputChange('siteLogo', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              The main logo that appears in the header and navigation across your site.
            </p>
          </div>

          {/* Favicon URL */}
          <div>
            <Label htmlFor="faviconUrl">Favicon URL</Label>
            <Input
              id="faviconUrl"
              type="url"
              value={settings.faviconUrl}
              onChange={(e) => handleInputChange('faviconUrl', e.target.value)}
              placeholder="/favicon.ico or https://example.com/favicon.ico"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              The small icon that appears in browser tabs and bookmarks. Best as 16x16 or 32x32 pixels.
            </p>
          </div>

          {/* Site Name */}
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              type="text"
              value={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              placeholder="Your Site Name"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              The name of your site used in various locations throughout the application.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="AlertCircle" className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              disabled={updating}
              className="flex items-center justify-center"
            >
              {updating ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  Update Settings
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleResetDefaults}
              disabled={updating}
              className="flex items-center justify-center"
            >
              <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </form>

        {/* Usage Information */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <ApperIcon name="Info" className="h-4 w-4 mr-2" />
            Usage Notes
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Changes to the site logo will immediately appear in the header navigation</li>
            <li>• Favicon changes will update the browser tab icon</li>
            <li>• This affects the entire site, not individual professional profiles</li>
            <li>• Professional profiles have their own separate logo settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsPage;