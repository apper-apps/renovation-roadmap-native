import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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

// Create auth context

function AppContent() {
  const navigate = useNavigate();
  // Initialize ApperUI once when the app loads
  
  // Authentication methods to share via context
  
  
return (
<div>
      <Routes>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        <Route path="/renovation-roadmap" element={
          <Layout>
            <RenovationRoadmapPage />
          </Layout>
        } />
        <Route path="/quizzes" element={
          <Layout>
            <QuizzesPage />
          </Layout>
        } />
        <Route path="/quiz/:id" element={
          <Layout>
            <QuizPage />
          </Layout>
        } />
        <Route path="/faq" element={
          <Layout>
            <FAQPage />
          </Layout>
        } />
        <Route path="/be-inspired" element={
          <Layout>
            <BeInspiredPage />
          </Layout>
        } />
        <Route path="/professional/:id" element={
          <Layout>
            <ProfessionalProfilePage />
          </Layout>
        } />
        <Route path="/project/:id" element={
          <Layout>
            <ProjectShowcasePage />
          </Layout>
        } />
      </Routes>
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;