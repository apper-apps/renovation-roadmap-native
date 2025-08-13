import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfessionalCard from "@/components/molecules/ProfessionalCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getProfessionals } from "@/services/api/professionalService";

const ProfessionalCategories = () => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProfessionals();
      setProfessionals(data.filter(pro => pro.status === "active"));
    } catch (err) {
      setError("Failed to load professionals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfessionals();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfessionals} />;

  return (
    <section id="professionals-section" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
            Depending on your project, you may need:
</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {professionals.map((professional) => (
            <ProfessionalCard key={professional.Id} professional={professional} />
          ))}
        </div>

        <div className="text-center bg-white rounded-xl p-8 shadow-sm mb-12">
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            But don't worry, you don't need to call all of them! You just need to know who to call first 
            and then the professionals can guide you from there.
          </p>
        </div>
{/* Quiz Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              Take Our Quiz to Find Out Who You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Not sure where to start? Our interactive quizzes will help you understand your project needs and connect you with the right professionals.
            </p>
          </div>

          {/* Featured Quiz */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-8 mb-8">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="bg-accent text-white text-sm px-4 py-2 rounded-full inline-block mb-4 font-medium">
                      Featured Quiz
                    </div>
                    <h3 className="text-3xl font-display font-bold text-primary mb-4">
                      Who Should I Call First?
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      Builder, Architect, or Interior Designer - find out who to contact first for your project
                    </p>
<button 
                      onClick={() => navigate('/quiz/1')}
                      className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
                    >
                      Start Quiz →
                    </button>
                  </div>
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center" 
                      alt="Who Should I Call First Quiz"
                      className="w-full h-64 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Quizzes Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/quiz/2')}>
              <h4 className="text-xl font-display font-semibold text-primary mb-3">
                What's Your Renovator Persona?
              </h4>
              <p className="text-gray-600 mb-4">
                Discover your renovation style and approach
              </p>
              <span className="text-accent font-medium hover:underline">Take Quiz →</span>
            </div>
<div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/quiz/3')}>
              <h4 className="text-xl font-display font-semibold text-primary mb-3">
                Renovation Readiness Check
              </h4>
              <p className="text-gray-600 mb-4">
                Are you actually ready to start your renovation project?
              </p>
              <span className="text-accent font-medium hover:underline">Take Quiz →</span>
            </div>
<div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/quiz/4')}>
              <h4 className="text-xl font-display font-semibold text-primary mb-3">
                Kitchen Showdown
              </h4>
              <p className="text-gray-600 mb-4">
                What's your perfect kitchen layout?
              </p>
              <span className="text-accent font-medium hover:underline">Take Quiz →</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProfessionalCategories;