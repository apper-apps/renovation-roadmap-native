import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const SiteSettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Settings</h1>
          <p className="text-gray-600">
            Site settings are now managed through the backend data management system.
          </p>
        </div>

        {/* Backend Management Notice */}
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center mb-4">
            <ApperIcon name="Database" className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-blue-900">Backend Data Management</h3>
          </div>
          
          <div className="text-blue-800 space-y-3">
            <p>
              Site settings are now controlled through the <strong>Site Settings</strong> data table in your backend management system.
            </p>
            
            <div className="bg-white/60 p-4 rounded border border-blue-200">
              <h4 className="font-medium mb-2">Available Settings:</h4>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Site Logo:</strong> Main logo displayed in header navigation</li>
                <li>• <strong>Favicon URL:</strong> Browser tab icon (16x16 or 32x32 pixels recommended)</li>
                <li>• <strong>Site Name:</strong> Application name used throughout the site</li>
              </ul>
            </div>
            
            <div className="bg-white/60 p-4 rounded border border-blue-200">
              <h4 className="font-medium mb-2">How to Update Settings:</h4>
              <ol className="space-y-1 text-sm list-decimal list-inside">
                <li>Access your backend data management system</li>
                <li>Navigate to the <strong>Site Settings</strong> table</li>
                <li>Create or update records with the appropriate setting names and values</li>
                <li>Changes will be reflected automatically across the application</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Technical Information */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
            Technical Details
          </h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Table Name:</strong> site_settings_c</p>
            <p><strong>Key Fields:</strong> setting_name_c, setting_value_c, setting_type_c</p>
            <p><strong>Management:</strong> Backend data management interface only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsPage;