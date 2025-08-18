import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
const navigation = [
    { name: "Home", path: "/" },
    { name: "Renovation Roadmap", path: "/renovation-roadmap" },
    { name: "FAQ", path: "/faq" },
    { name: "Be Inspired", path: "/be-inspired" },
  ];

const handleQuizClick = () => {
    navigate("/quiz/1");
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
<Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary via-accent to-secondary p-3 rounded-xl shadow-lg">
              <ApperIcon name="Home" className="h-8 w-8 text-white" />
            </div>
<div className="bg-gradient-to-r from-primary to-accent bg-clip-text">
              <h1 className="text-2xl font-display font-bold text-accent">
                Renovation Roadmap
              </h1>
              <p className="text-base text-primary/70 font-medium">For Hamilton Homeowners</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
<nav className="hidden lg:flex items-center space-x-8 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors hover:text-primary ${
                  isActive(item.path) 
                    ? "text-primary border-b-2 border-primary pb-1" 
                    : "text-gray-700"
                }`}
>
                {item.name}
              </Link>
            ))}
            <Button variant="accent" size="sm" onClick={handleQuizClick}>
              Take Our Quiz
            </Button>
            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={logout} className="ml-2">
                <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <ApperIcon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              className="h-6 w-6 text-gray-700" 
            />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block py-2 px-4 rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? "text-primary bg-primary/5" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
<div className="px-4 pt-2">
              <Button 
                variant="accent" 
                size="sm" 
                className="w-full"
                onClick={handleQuizClick}
              >
                Take Our Quiz
              </Button>
              {isAuthenticated && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={logout}
                >
                  <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;