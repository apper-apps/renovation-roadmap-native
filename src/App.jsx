import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import HomePage from "@/components/pages/HomePage";
import RenovationRoadmapPage from "@/components/pages/RenovationRoadmapPage";
import QuizzesPage from "@/components/pages/QuizzesPage";
import QuizPage from "@/components/pages/QuizPage";
import FAQPage from "@/components/pages/FAQPage";
import BeInspiredPage from "@/components/pages/BeInspiredPage";
import ProfessionalProfilePage from "@/components/pages/ProfessionalProfilePage";
import ProjectShowcasePage from "@/components/pages/ProjectShowcasePage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/renovation-roadmap" element={<RenovationRoadmapPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/be-inspired" element={<BeInspiredPage />} />
            <Route path="/professional/:id" element={<ProfessionalProfilePage />} />
            <Route path="/project/:id" element={<ProjectShowcasePage />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;