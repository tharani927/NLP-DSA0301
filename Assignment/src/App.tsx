import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DemoFlowBar, DEMO_STEPS } from './components/DemoFlowBar';
import { HomeView } from './components/views/HomeView';
import { DatasetView } from './components/views/DatasetView';
import { PreprocessingView } from './components/views/PreprocessingView';
import { StemmingView } from './components/views/StemmingView';
import { PosTaggingView } from './components/views/PosTaggingView';
import { RetrievalView } from './components/views/RetrievalView';
import { ModelComparisonView } from './components/views/ModelComparisonView';
import { EvaluationView } from './components/views/EvaluationView';
import { ErrorAnalysisView } from './components/views/ErrorAnalysisView';
import { EngineeringDecisionView } from './components/views/EngineeringDecisionView';
import { EthicsSustainabilityView } from './components/views/EthicsSustainabilityView';
import { TeamView } from './components/views/TeamView';
import { AboutView } from './components/views/AboutView';
import { SupportTicket, DatasetStats, EvaluationResults } from './types';
import { INITIAL_SAMPLE_TICKETS } from './data/sampleDataset';
import { IrEvaluator } from './nlp/evaluation';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SAMPLE_TICKETS);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(0);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Compute dataset stats whenever tickets change
  const datasetStats: DatasetStats = useMemo(() => {
    return IrEvaluator.computeDatasetStats(tickets);
  }, [tickets]);

  // Compute quantitative evaluation whenever tickets change
  const [evaluation, setEvaluation] = useState<EvaluationResults>(() => {
    return IrEvaluator.evaluate(INITIAL_SAMPLE_TICKETS, 5);
  });

  // Re-run evaluation when tickets update
  useEffect(() => {
    const res = IrEvaluator.evaluate(tickets, evaluation.k || 5);
    setEvaluation(res);
  }, [tickets]);

  // Handle Demo Mode Navigation
  const handleNextDemoStep = () => {
    if (currentDemoStep < DEMO_STEPS.length - 1) {
      const nextStepIndex = currentDemoStep + 1;
      setCurrentDemoStep(nextStepIndex);
      setActiveTab(DEMO_STEPS[nextStepIndex].tab);
    }
  };

  const handlePrevDemoStep = () => {
    if (currentDemoStep > 0) {
      const prevStepIndex = currentDemoStep - 1;
      setCurrentDemoStep(prevStepIndex);
      setActiveTab(DEMO_STEPS[prevStepIndex].tab);
    }
  };

  const handleJumpToDemoStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < DEMO_STEPS.length) {
      setCurrentDemoStep(stepIndex);
      setActiveTab(DEMO_STEPS[stepIndex].tab);
    }
  };

  const handleToggleDemoMode = () => {
    const nextMode = !isDemoMode;
    setIsDemoMode(nextMode);
    if (nextMode) {
      setCurrentDemoStep(0);
      setActiveTab(DEMO_STEPS[0].tab);
    }
  };

  // Dataset updates
  const handleUpdateDataset = (newTickets: SupportTicket[], message?: string) => {
    setTickets(newTickets);
    if (message) {
      setStatusNotification(message);
      setTimeout(() => setStatusNotification(null), 5000);
    }
  };

  const handleResetSample = () => {
    setTickets(INITIAL_SAMPLE_TICKETS);
    setStatusNotification('Dataset successfully reset to the built-in 15-ticket balanced benchmark corpus.');
    setTimeout(() => setStatusNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        ticketCount={tickets.length}
      />

      {/* Faculty Demonstration Progress Bar (when Demo Mode is ON) */}
      {isDemoMode && (
        <DemoFlowBar
          currentStepIndex={currentDemoStep}
          setCurrentStepIndex={setCurrentDemoStep}
          setActiveTab={setActiveTab}
          onClose={() => setIsDemoMode(false)}
        />
      )}

      {/* Global Notification Banner */}
      {statusNotification && (
        <div className="bg-[#0F172A] text-white text-xs py-2 px-4 text-center font-medium shadow-xs border-b border-slate-700 transition-all flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'home' && (
            <HomeView
              onStartAnalysis={() => setActiveTab('preprocessing')}
              setActiveTab={setActiveTab}
              ticketCount={tickets.length}
            />
          )}

          {activeTab === 'dataset' && (
            <DatasetView
              tickets={tickets}
              stats={datasetStats}
              onUpdateDataset={handleUpdateDataset}
              onResetSample={handleResetSample}
            />
          )}

          {activeTab === 'preprocessing' && (
            <PreprocessingView
              onProceedToStemming={() => setActiveTab('stemming')}
            />
          )}

          {activeTab === 'stemming' && (
            <StemmingView
              onProceedToPos={() => setActiveTab('pos_tagging')}
            />
          )}

          {activeTab === 'pos_tagging' && (
            <PosTaggingView
              onProceedToRetrieval={() => setActiveTab('retrieval')}
            />
          )}

          {activeTab === 'retrieval' && (
            <RetrievalView
              tickets={tickets}
              onCompareModels={() => setActiveTab('comparison')}
            />
          )}

          {activeTab === 'comparison' && (
            <ModelComparisonView
              evaluation={evaluation}
              onProceedToEvaluation={() => setActiveTab('evaluation')}
            />
          )}

          {activeTab === 'evaluation' && (
            <EvaluationView
              tickets={tickets}
              evaluation={evaluation}
              onUpdateEvaluation={setEvaluation}
              onProceedToErrorAnalysis={() => setActiveTab('error_analysis')}
            />
          )}

          {activeTab === 'error_analysis' && (
            <ErrorAnalysisView
              tickets={tickets}
              onProceedToDecision={() => setActiveTab('decision')}
            />
          )}

          {activeTab === 'decision' && (
            <EngineeringDecisionView
              evaluation={evaluation}
              onProceedToEthics={() => setActiveTab('ethics')}
            />
          )}

          {activeTab === 'ethics' && <EthicsSustainabilityView />}

          {activeTab === 'team' && <TeamView />}

          {activeTab === 'about' && <AboutView />}
        </main>
      </div>
    </div>
  );
}
export default App;
