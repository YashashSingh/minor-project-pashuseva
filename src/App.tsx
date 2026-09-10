import React, { useState } from 'react';
import { Navbar, PageView } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AnimalClassifierPage } from './pages/AnimalClassifierPage';
import { SkinScreeningPage } from './pages/SkinScreeningPage';
import { ExplainableAIPage } from './pages/ExplainableAIPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { VeterinariansPage } from './pages/VeterinariansPage';
import { HealthHistoryPage } from './pages/HealthHistoryPage';
import { ProjectInfoPage } from './pages/ProjectInfoPage';
import { AnimalClassificationResult, SkinScreeningResult, AnimalType } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [activeAnimalResult, setActiveAnimalResult] = useState<AnimalClassificationResult | null>(null);
  const [activeSkinResult, setActiveSkinResult] = useState<SkinScreeningResult | null>(null);
  const [activeAnimalType, setActiveAnimalType] = useState<AnimalType>('Cattle');

  const handleAnimalAnalyzed = (result: AnimalClassificationResult, image: string) => {
    setActiveAnimalResult(result);
    setActiveAnimalType(result.animalType);
  };

  const handleSkinScreeningCompleted = (result: SkinScreeningResult, image: string) => {
    setActiveSkinResult(result);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF7] text-[#2D332B] selection:bg-[#8DA67A]/30 selection:text-[#2D332B]">
      
      {/* Top Main Navigation Bar */}
      <Navbar currentView={currentView} onNavigate={setCurrentView} />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {currentView === 'home' && (
          <HomePage onNavigate={setCurrentView} />
        )}

        {currentView === 'dashboard' && (
          <DashboardPage onNavigate={setCurrentView} />
        )}

        {currentView === 'classifier' && (
          <AnimalClassifierPage
            onNavigate={setCurrentView}
            onAnimalAnalyzed={handleAnimalAnalyzed}
          />
        )}

        {currentView === 'skin-screening' && (
          <SkinScreeningPage
            onNavigate={setCurrentView}
            activeAnimalType={activeAnimalType}
            onScreeningCompleted={handleSkinScreeningCompleted}
          />
        )}

        {currentView === 'explainable-ai' && (
          <ExplainableAIPage />
        )}

        {currentView === 'chatbot' && (
          <ChatbotPage
            onNavigate={setCurrentView}
            activeAnimalResult={activeAnimalResult}
            activeSkinResult={activeSkinResult}
          />
        )}

        {currentView === 'veterinarians' && (
          <VeterinariansPage />
        )}

        {currentView === 'health-history' && (
          <HealthHistoryPage onNavigate={setCurrentView} />
        )}

        {currentView === 'project-info' && (
          <ProjectInfoPage />
        )}
      </main>

      {/* Comprehensive Academic & Disclaimer Footer */}
      <Footer onNavigate={setCurrentView} />

    </div>
  );
}
