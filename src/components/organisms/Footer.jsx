import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import siteSettingsService from "@/services/api/siteSettingsService";

const Footer = () => {
  const [siteContent, setSiteContent] = useState({
    siteName: "Renovation Roadmap",
    footerContent: "Connecting homeowners with New Zealand's finest renovation professionals. Your dream home starts with knowing who to call first."
  });
  const [contentLoading, setContentLoading] = useState(true);

  // Load dynamic content from settings
  useEffect(() => {
    const loadContent = async () => {
      try {
        const settings = await siteSettingsService.getSiteSettings();
        setSiteContent({
          siteName: settings.siteName || "Renovation Roadmap",
          footerContent: settings.footerContent || "Connecting homeowners with New Zealand's finest renovation professionals. Your dream home starts with knowing who to call first."
        });
      } catch (error) {
        console.error("Error loading footer content:", error);
        // Keep default content on error
      } finally {
        setContentLoading(false);
      }
    };

    loadContent();
  }, []);

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Renovation Roadmap", path: "/renovation-roadmap" },
    { name: "Take Quiz", path: "/quiz/who-to-call-first" },
    { name: "FAQ", path: "/faq" },
    { name: "Be Inspired", path: "/be-inspired" },
  ];

const partners = [
    { name: "JCC Build", path: "/professional/1" },
    { name: "Woven Architects", path: "/professional/2" },
    { name: "Nest Interiors", path: "/professional/3" },
    { name: "Harrison Grierson", path: "/professional/4" },
  ];

return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <ApperIcon name="Home" className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold">
                  {contentLoading ? (
                    <div className="h-6 w-32 bg-white/20 animate-pulse rounded"></div>
                  ) : (
                    siteContent.siteName
                  )}
                </h3>
                <p className="text-sm opacity-75">For the Waikato Region</p>
              </div>
            </div>
            {contentLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-full bg-white/20 animate-pulse rounded"></div>
                <div className="h-4 w-3/4 bg-white/20 animate-pulse rounded"></div>
              </div>
            ) : (
              <p className="text-sm opacity-90 leading-relaxed">
                {siteContent.footerContent}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
<ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-sm opacity-75 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
<div>
            <h4 className="font-semibold mb-4">Our Partners</h4>
            <ul className="space-y-1">
              {partners.map((partner) => (
                <li key={partner.name}>
                  <Link 
                    to={partner.path}
                    className="text-sm opacity-75 hover:opacity-100 transition-opacity"
                  >
                    {partner.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-75">
            © {new Date().getFullYear()} Renovation Roadmap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;