import { useState } from 'react';
import { StoreProvider, useStore } from './store/StoreContext';
import { LandingPage } from './components/LandingPage';
import { Sidebar, TopBar, MobileNav } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Projects, ProjectDetail } from './pages/Projects';
import { Clients } from './pages/Clients';
import { Quotations } from './pages/Quotations';
import { Budget } from './pages/Budget';
import { Materials } from './pages/Materials';
import { SiteInspections } from './pages/Inspections';
import { Tasks } from './pages/Tasks';
import { Calendar } from './pages/Calendar';
import { Reports } from './pages/Reports';
import { RiskRegister } from './pages/RiskRegister';
import { SafetyQuality } from './pages/SafetyQuality';
import { Resources } from './pages/Resources';
import { Calculators } from './pages/Calculators';
import { Enquiries } from './pages/Enquiries';
import { AIAssistant } from './pages/AIAssistant';
import { Settings } from './pages/Settings';
import { navItems } from './config/nav';

function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [activePage, setActivePage] = useState('dashboard');
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (view === 'landing') {
    return (
      <StoreProvider>
        <LandingPage onEnterApp={() => setView('app')} />
      </StoreProvider>
    );
  }

  return (
    <StoreProvider>
      <AppShell
        activePage={activePage}
        openProjectId={openProjectId}
        sidebarOpen={sidebarOpen}
        onNavigate={(id) => { setActivePage(id); setOpenProjectId(null); }}
        onOpenProject={(id) => setOpenProjectId(id)}
        onBack={() => setOpenProjectId(null)}
        onMenuClick={() => setSidebarOpen(true)}
        onCloseSidebar={() => setSidebarOpen(false)}
        onExit={() => setView('landing')}
      />
    </StoreProvider>
  );
}

function AppShell({
  activePage, openProjectId, sidebarOpen,
  onNavigate, onOpenProject, onBack, onMenuClick, onCloseSidebar, onExit,
}: {
  activePage: string;
  openProjectId: string | null;
  sidebarOpen: boolean;
  onNavigate: (id: string) => void;
  onOpenProject: (id: string) => void;
  onBack: () => void;
  onMenuClick: () => void;
  onCloseSidebar: () => void;
  onExit: () => void;
}) {
  const { projects } = useStore();
  const currentPage = navItems.find((n) => n.id === activePage);
  const pageTitle = currentPage?.label || 'Dashboard';
  const project = openProjectId ? projects.find((p) => p.id === openProjectId) : null;

  const renderPage = () => {
    if (project) return null; // rendered separately
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={onNavigate} onOpenProject={onOpenProject} />;
      case 'projects': return <Projects onOpenProject={onOpenProject} />;
      case 'clients': return <Clients />;
      case 'quotations': return <Quotations />;
      case 'budget': return <Budget />;
      case 'materials': return <Materials />;
      case 'inspections': return <SiteInspections />;
      case 'tasks': return <Tasks />;
      case 'calendar': return <Calendar />;
      case 'reports': return <Reports />;
      case 'risk': return <RiskRegister />;
      case 'safety': return <SafetyQuality />;
      case 'resources': return <Resources />;
      case 'calculators': return <Calculators />;
      case 'enquiries': return <Enquiries />;
      case 'ai-assistant': return <AIAssistant />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={onNavigate} onOpenProject={onOpenProject} />;
    }
  };

  return (
    <div className="flex h-screen bg-charcoal-900 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar active={activePage} onNavigate={onNavigate} onExit={onExit} />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-sm" onClick={onCloseSidebar} />
          <div className="relative z-10">
            <Sidebar active={activePage} onNavigate={onNavigate} onExit={onExit} onClose={onCloseSidebar} mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={project ? 'Project Details' : pageTitle} onMenuClick={onMenuClick} onNavigate={onNavigate} />
        <main className="flex-1 overflow-y-auto">
          {project ? (
            <ProjectDetail project={project} onBack={onBack} onNavigate={onNavigate} />
          ) : (
            renderPage()
          )}
        </main>
        <MobileNav active={activePage} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export default App;
