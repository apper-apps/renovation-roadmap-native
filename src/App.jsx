import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import BeInspiredPage from "@/components/pages/BeInspiredPage";
import ProjectShowcasePage from "@/components/pages/ProjectShowcasePage";
import FAQPage from "@/components/pages/FAQPage";
import QuizPage from "@/components/pages/QuizPage";
import QuizzesPage from "@/components/pages/QuizzesPage";
import ProfessionalProfilePage from "@/components/pages/ProfessionalProfilePage";
import RenovationRoadmapPage from "@/components/pages/RenovationRoadmapPage";
import HomePage from "@/components/pages/HomePage";
import Layout from "@/components/organisms/Layout";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
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
          <Route path="/roadmap/admin" element={
            <Layout>
              <RenovationRoadmapPage />
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
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
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