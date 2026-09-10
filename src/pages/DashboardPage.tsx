import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Clock, 
  Layers, 
  MapPin, 
  Microscope, 
  Plus, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import { DashboardStats, HealthRecord } from '../types';
import { api } from '../services/api';
import { PageView } from '../components/Navbar';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface Props {
  onNavigate: (view: PageView) => void;
  onSelectRecord?: (record: HealthRecord) => void;
}

export const DashboardPage: React.FC<Props> = ({ onNavigate, onSelectRecord }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Dashboard Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#2D332B] tracking-tight">
              Livestock Health Monitoring Dashboard
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EEF0E7] text-[#4B6344] font-bold border border-[#E2E6D8]">
              Live Overview
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#2D332B]/60 mt-1">
            Real-time analytics across animal classifications, disease screenings, and veterinary referrals.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            id="btn-dash-analyze-animal"
            onClick={() => onNavigate('classifier')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#4B6344] hover:bg-[#3D5237] text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>Analyze Animal</span>
          </button>

          <button
            id="btn-dash-skin-screening"
            onClick={() => onNavigate('skin-screening')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#8B4513] hover:bg-[#70370f] text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Skin Screening</span>
          </button>

          <button
            id="btn-dash-ask-ai"
            onClick={() => onNavigate('chatbot')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#8DA67A] hover:bg-[#4B6344] text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>

          <button
            id="btn-dash-find-vet"
            onClick={() => onNavigate('veterinarians')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2D332B] hover:bg-[#3D5237] text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-[#8DA67A]" />
            <span>Find Vet</span>
          </button>

          <button
            id="btn-refresh-dashboard"
            onClick={fetchStats}
            className="p-2 rounded-xl border border-[#E2E6D8] bg-white hover:bg-[#F3F4EF] text-[#2D332B] shadow-xs"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Total Analyses */}
        <div className="p-5 rounded-2xl border border-[#E2E6D8] bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2D332B]/60 uppercase tracking-tighter">
              Total Analyses
            </span>
            <div className="p-2 rounded-xl bg-[#EEF0E7] text-[#4B6344]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#4B6344]">
              {stats?.totalAnalyses ?? '...'}
            </span>
            <span className="text-xs text-[#4B6344] font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Active</span>
            </span>
          </div>
          <p className="text-[11px] text-[#2D332B]/60">
            Combined image classifications &amp; cutaneous screenings logged
          </p>
        </div>

        {/* Metric 2: Animals Identified (Cattle vs Buffalo) */}
        <div className="p-5 rounded-2xl border border-[#E2E6D8] bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2D332B]/60 uppercase tracking-tighter">
              Animals Identified
            </span>
            <div className="p-2 rounded-xl bg-[#EEF0E7] text-[#4B6344]">
              <Microscope className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#2D332B]">
              {stats?.animalsIdentified.total ?? '...'}
            </span>
            <span className="text-xs text-[#2D332B]/60">
              ({stats?.animalsIdentified.cattle ?? 0} Cow • {stats?.animalsIdentified.buffalo ?? 0} Buff)
            </span>
          </div>
          <div className="w-full bg-[#F3F4EF] rounded-full h-1.5 overflow-hidden flex">
            <div 
              style={{ 
                width: `${stats?.animalsIdentified.total ? (stats.animalsIdentified.cattle / stats.animalsIdentified.total) * 100 : 50}%` 
              }} 
              className="bg-[#4B6344] h-full" 
              title="Cattle proportion"
            />
            <div 
              style={{ 
                width: `${stats?.animalsIdentified.total ? (stats.animalsIdentified.buffalo / stats.animalsIdentified.total) * 100 : 50}%` 
              }} 
              className="bg-[#2D332B] h-full" 
              title="Buffalo proportion"
            />
          </div>
        </div>

        {/* Metric 3: Health Screenings */}
        <div className="p-5 rounded-2xl border border-[#E2E6D8] bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2D332B]/60 uppercase tracking-tighter">
              Health Screenings
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#8B4513]">
              {stats?.healthScreeningsCount ?? '...'}
            </span>
            <span className="text-xs text-amber-800 font-medium">
              Dermatology Screened
            </span>
          </div>
          <p className="text-[11px] text-[#2D332B]/60">
            LSD, Ringworm, Papilloma, and Mange evaluations
          </p>
        </div>

        {/* Metric 4: Veterinary Recommendations */}
        <div className="p-5 rounded-2xl border border-[#E2E6D8] bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2D332B]/60 uppercase tracking-tighter">
              Vet Recommendations
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-700">
              {stats?.veterinaryRecommendationsCount ?? '...'}
            </span>
            <span className="text-xs text-[#2D332B]/60">
              Clinical attention advised
            </span>
          </div>
          <p className="text-[11px] text-[#2D332B]/60">
            Cases triaged for in-person veterinary examination
          </p>
        </div>

      </div>

      {/* Main Dashboard Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Analyses Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#2D332B]">
                  Recent Animal Health Analyses
                </h3>
                <p className="text-xs text-[#2D332B]/60">
                  Records captured from computer vision and screening inference
                </p>
              </div>

              <button
                onClick={() => onNavigate('health-history')}
                className="text-xs font-semibold text-[#4B6344] hover:text-[#3D5237] flex items-center gap-1"
              >
                <span>View Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Records List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E6D8] text-[#2D332B]/50 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Animal</th>
                    <th className="pb-3 font-semibold">Analysis Type</th>
                    <th className="pb-3 font-semibold">Result / Condition</th>
                    <th className="pb-3 font-semibold">Confidence</th>
                    <th className="pb-3 font-semibold">Risk Level</th>
                    <th className="pb-3 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E6D8]/60">
                  {stats?.recentRecords && stats.recentRecords.length > 0 ? (
                    stats.recentRecords.map((rec) => (
                      <tr 
                        key={rec.id} 
                        onClick={() => onNavigate('health-history')}
                        className="hover:bg-[#F9FAF7] transition-colors cursor-pointer group"
                      >
                        <td className="py-3 font-bold text-[#2D332B] flex items-center gap-2">
                          <img
                            src={rec.imageUrl}
                            alt={rec.animalType}
                            className="w-8 h-8 rounded-lg object-cover bg-stone-100 shrink-0"
                          />
                          <div>
                            <div>{rec.animalType}</div>
                            {rec.tagNumber && (
                              <div className="text-[10px] text-[#2D332B]/50 font-mono">{rec.tagNumber}</div>
                            )}
                          </div>
                        </td>

                        <td className="py-3 text-[#2D332B]/70">
                          <span className="px-2 py-0.5 rounded bg-[#F3F4EF] font-medium text-[11px] border border-[#E2E6D8]">
                            {rec.analysisType}
                          </span>
                        </td>

                        <td className="py-3 font-medium text-[#2D332B] max-w-[200px] truncate">
                          {rec.skinConditionResult || rec.predictedAnimal || 'Normal Assessment'}
                        </td>

                        <td className="py-3 font-mono font-bold text-[#2D332B]">
                          {rec.confidence}%
                        </td>

                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            rec.riskLevel === 'Urgent' 
                              ? 'bg-rose-100 text-rose-800'
                              : rec.riskLevel === 'High'
                              ? 'bg-amber-100 text-amber-900'
                              : rec.riskLevel === 'Moderate'
                              ? 'bg-yellow-100 text-yellow-900'
                              : 'bg-[#EEF0E7] text-[#4B6344]'
                          }`}>
                            {rec.riskLevel}
                          </span>
                        </td>

                        <td className="py-3 text-[#2D332B]/50 text-right whitespace-nowrap">
                          {rec.date}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#2D332B]/50">
                        No health records logged yet. Upload an animal image to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Right 1 Col: Latest AI Result & Quick Jump */}
        <div className="space-y-4">
          
          {stats?.latestRecord ? (
            <div className="p-6 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4B6344] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#4B6344]" />
                  <span>Latest AI Result</span>
                </span>
                <span className="text-[10px] text-[#2D332B]/50 font-mono">
                  {stats.latestRecord.date}
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-video bg-stone-900">
                <img
                  src={stats.latestRecord.imageUrl}
                  alt={stats.latestRecord.animalType}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#2D332B]/80 backdrop-blur-xs text-white p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold">{stats.latestRecord.animalType}</span>
                  <span className="text-[#8DA67A] font-mono font-bold">
                    {stats.latestRecord.confidence}% Conf.
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs text-[#2D332B]/60">Screening Result:</div>
                <div className="text-sm font-bold text-[#2D332B] leading-snug">
                  {stats.latestRecord.skinConditionResult || 'Standard Classification'}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    stats.latestRecord.riskLevel === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-[#EEF0E7] text-[#4B6344]'
                  }`}>
                    {stats.latestRecord.riskLevel} Risk
                  </span>
                  {stats.latestRecord.vetConsultRecommended && (
                    <span className="text-[11px] text-amber-800 font-medium">
                      • Vet Consultation Advised
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => onNavigate('chatbot')}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#4B6344] hover:bg-[#3D5237] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant About This Result</span>
                </button>

                {stats.latestRecord.vetConsultRecommended && (
                  <button
                    onClick={() => onNavigate('veterinarians')}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#F3F4EF] border border-[#E2E6D8] text-[#4B6344] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#4B6344]" />
                    <span>Find Veterinarian for this Case</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl border border-[#E2E6D8] bg-white text-center space-y-3">
              <Microscope className="w-8 h-8 text-[#2D332B]/30 mx-auto" />
              <h4 className="text-sm font-bold text-[#2D332B]">No Recent Analyses</h4>
              <p className="text-xs text-[#2D332B]/60">
                Run your first Cattle vs Buffalo classification or skin screening to populate this card.
              </p>
              <button
                onClick={() => onNavigate('classifier')}
                className="px-4 py-2 bg-[#4B6344] hover:bg-[#3D5237] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Analyze Animal
              </button>
            </div>
          )}

          {/* Risk Level Distribution Card */}
          <div className="p-5 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#2D332B] uppercase tracking-wider">
              Risk Level Triage Breakdown
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#2D332B]/70">Urgent (Immediate Isolation)</span>
                <span className="font-bold text-rose-700">{stats?.riskDistribution.urgent ?? 0}</span>
              </div>
              <div className="w-full bg-[#F3F4EF] rounded-full h-1.5 overflow-hidden">
                <div 
                  style={{ width: `${(stats?.riskDistribution.urgent || 0) * 20}%` }}
                  className="bg-rose-500 h-full"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#2D332B]/70">Moderate / High</span>
                <span className="font-bold text-amber-700">
                  {(stats?.riskDistribution.moderate || 0) + (stats?.riskDistribution.high || 0)}
                </span>
              </div>
              <div className="w-full bg-[#F3F4EF] rounded-full h-1.5 overflow-hidden">
                <div 
                  style={{ width: `${((stats?.riskDistribution.moderate || 0) + (stats?.riskDistribution.high || 0)) * 20}%` }}
                  className="bg-amber-500 h-full"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#2D332B]/70">Low / Healthy</span>
                <span className="font-bold text-[#4B6344]">{stats?.riskDistribution.low ?? 0}</span>
              </div>
              <div className="w-full bg-[#F3F4EF] rounded-full h-1.5 overflow-hidden">
                <div 
                  style={{ width: `${(stats?.riskDistribution.low || 0) * 20}%` }}
                  className="bg-[#4B6344] h-full"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
