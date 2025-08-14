import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const HeroSection = () => {
  const navigate = useNavigate();

  // Typing effect hook
  const useTypingEffect = (words, typeSpeed = 150, deleteSpeed = 100, pauseTime = 2000) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPausing, setIsPausing] = useState(false);

    useEffect(() => {
      const currentWord = words[currentWordIndex];
      
      if (isPausing) {
        const pauseTimer = setTimeout(() => {
          setIsPausing(false);
          setIsDeleting(true);
        }, pauseTime);
        return () => clearTimeout(pauseTimer);
      }

      const timer = setTimeout(() => {
        if (!isDeleting) {
          if (currentText.length < currentWord.length) {
            setCurrentText(currentWord.slice(0, currentText.length + 1));
          } else {
            setIsPausing(true);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
          }
        }
      }, isDeleting ? deleteSpeed : typeSpeed);

      return () => clearTimeout(timer);
    }, [currentText, isDeleting, isPausing, currentWordIndex, words, typeSpeed, deleteSpeed, pauseTime]);

    return currentText;
  };

  const typingText = useTypingEffect(['building', 'renovation', 'alteration']);

  const handleTakeQuiz = () => {
    navigate("/quizzes");
  };

  const handleViewProfessionals = () => {
    document.getElementById("professionals-section")?.scrollIntoView({ 
      behavior: "smooth" 
    });
  };

  return (
<section
className="relative py-12 overflow-hidden border-b border-gray-100" style={{ backgroundColor: '#F7F9FB' }}>
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
        <div
            className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div
            className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
        <div
            className="absolute top-1/2 left-1/3 w-16 h-16 border border-white/20 rounded-full"></div>
    </div>
    <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
<h1
className="text-5xl md:text-7xl font-display font-bold mb-4 leading-tight drop-shadow-sm">
                <div style={{ color: '#000000' }}>
                  Got a <span className="inline-block min-w-[200px] md:min-w-[300px]">
                    {typingText}
                    <span className="animate-pulse">|</span>
                  </span> project
                </div>
                <div style={{ color: '#0059E3' }} className="mb-8">on your mind?</div>
            </h1>
            <h2
                className="text-3xl md:text-4xl font-display font-semibold mb-6 text-gray-800 drop-shadow-sm">Do you know who to call?
                          </h2>
            <p
                className="text-xl md:text-2xl mb-8 text-gray-700 leading-relaxed max-w-3xl mx-auto">Whether you're considering minor updates or major renovations, interior or exterior, 
                            get the peace of mind that comes from partnering with trusted renovation experts.
                          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="accent" size="lg" onClick={handleTakeQuiz} className="group">
                    <ApperIcon
                        name="Play"
                        className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />Take Our Quiz
                                </Button>
<Button
                    variant="outline"
                    size="lg"
                    onClick={handleViewProfessionals}
                    className="text-primary border-primary hover:bg-primary hover:text-white">
                    <ApperIcon name="Users" className="h-5 w-5 mr-2" />View Professionals
                </Button>
            </div>
            <div
                className="mt-12 flex items-center justify-center space-x-8 text-white/75">
                <div className="flex items-center">
                    <ApperIcon name="Shield" className="h-5 w-5 mr-2" />
                    <span className="text-sm">Trusted Experts</span>
                </div>
                <div className="flex items-center">
                    <ApperIcon name="MapPin" className="h-5 w-5 mr-2" />
                    <span className="text-sm">Waikato Region</span>
                </div>
                <div className="flex items-center">
                </div>
            </div>
        </div>
    </div></section>
  );
};

export default HeroSection;