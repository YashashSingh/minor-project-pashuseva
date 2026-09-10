import React, { useState } from 'react';
import { 
  Activity, 
  Bot, 
  Clock, 
  Compass, 
  FileText, 
  HelpCircle, 
  Home, 
  Layers, 
  MapPin, 
  Menu, 
  Microscope, 
  ShieldAlert, 
  Sparkles, 
  X 
} from 'lucide-react';

export type PageView = 
  | 'home' 
  | 'dashboard' 
  | 'classifier' 
  | 'skin-screening' 
  | 'explainable-ai' 
  | 'chatbot' 
  | 'veterinarians' 
  | 'health-history' 
  | 'project-info';

interface Props {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
}

export const Navbar: React.FC<Props> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'classifier', label: 'Animal Classifier', icon: <Microscope className="w-4 h-4" />, badge: 'CNN' },
    { id: 'skin-screening', label: 'Skin Health', icon: <ShieldAlert className="w-4 h-4" />, badge: 'AI' },
    { id: 'explainable-ai', label: 'Explainable AI', icon: <Layers className="w-4 h-4" />, badge: 'Grad-CAM' },
    { id: 'chatbot', label: 'Livestock AI', icon: <Bot className="w-4 h-4" />, badge: 'Gemini' },
    { id: 'veterinarians', label: 'Find Vet', icon: <MapPin className="w-4 h-4" /> },
    { id: 'health-history', label: 'History', icon: <Clock className="w-4 h-4" /> },
    { id: 'project-info', label: 'Project Info', icon: <FileText className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: PageView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E6D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div 
            id="nav-brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#4B6344] flex items-center justify-center text-white shadow-xs group-hover:bg-[#3D5237] transition-colors font-bold text-lg">
              L
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-[#2D332B] tracking-tight">
                  PashuSeva<span className="text-[#4B6344]">AI</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
                  7th Sem Minor
                </span>
              </div>
              <p className="text-[11px] text-[#2D332B]/60 font-medium hidden sm:block">
                Livestock Health &amp; Veterinary Decision Support
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'text-[#4B6344] bg-[#F3F4EF] font-bold'
                      : 'text-[#2D332B]/70 hover:text-[#2D332B] hover:bg-[#F3F4EF]/60'
                  }`}
                >
                  <span className={isActive ? 'text-[#4B6344]' : 'text-[#2D332B]/40'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span 
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                        isActive 
                          ? 'bg-[#E2E6D8] text-[#4B6344]' 
                          : 'bg-[#EEF0E7] text-[#2D332B]/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#4B6344] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:inline-flex items-center px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-[10px] font-bold tracking-tight border border-yellow-200">
              VET ALERT: LSD REGIONAL MONITOR
            </div>

            <button
              id="btn-quick-analyze-header"
              onClick={() => handleNavClick('classifier')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#4B6344] hover:bg-[#3D5237] text-white shadow-xs transition-colors"
            >
              <Microscope className="w-3.5 h-3.5" />
              <span>Analyze Animal</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              id="btn-mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#2D332B] hover:bg-[#F3F4EF] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="lg:hidden border-t border-[#E2E6D8] bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200"
        >
          <div className="text-[11px] font-semibold text-[#2D332B]/50 uppercase tracking-wider px-3 py-1">
            System Modules
          </div>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#4B6344] bg-[#F3F4EF] font-bold'
                    : 'text-[#2D332B] hover:bg-[#F9FAF7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#4B6344]' : 'text-[#2D332B]/40'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EEF0E7] text-[#4B6344] font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-[#E2E6D8] mt-2">
            <button
              onClick={() => handleNavClick('classifier')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#4B6344] hover:bg-[#3D5237] text-white rounded-xl font-semibold text-sm shadow-xs transition-colors"
            >
              <Microscope className="w-4 h-4" />
              <span>Launch Animal Analysis</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
