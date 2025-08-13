import { useState, useEffect } from "react";
import ProfessionalCard from "@/components/molecules/ProfessionalCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getProfessionals } from "@/services/api/professionalService";

const ProfessionalCategories = () => {
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

        <div className="text-center bg-white rounded-xl p-8 shadow-sm">
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            But don't worry, you don't need to call all of them! You just need to know who to call first 
            and then the professionals can guide you from there.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalCategories;