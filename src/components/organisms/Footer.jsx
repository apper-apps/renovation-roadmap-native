import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
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
                  Renovation Roadmap
                </h3>
                <p className="text-sm opacity-75">For the Waikato Region</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Connecting homeowners with New Zealand's finest renovation professionals. 
              Your dream home starts with knowing who to call first.
            </p>
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