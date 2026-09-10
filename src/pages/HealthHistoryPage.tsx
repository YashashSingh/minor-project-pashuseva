import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  Trash2, 
  Eye, 
  Download, 
  Filter, 
  ShieldAlert, 
  Microscope, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Plus, 
  Bot 
} from 'lucide-react';
import { HealthRecord, AnimalType, RiskLevel } from '../types';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { PageView } from '../components/Navbar';

interface Props {
  onNavigate: (view: PageView) => void;
}

export const HealthHistoryPage: React.FC<Props> = ({ onNavigate }) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [animalFilter, setAnimalFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHealthHistory();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this health record?')) return;

    try {
      await api.deleteHealthRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `livestock_health_records_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch = 
      (r.tagNumber && r.tagNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.animalType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.skinConditionResult && r.skinConditionResult.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAnimal = animalFilter === 'All' || r.animalType === animalFilter;
    const matchesRisk = riskFilter === 'All' || r.riskLevel === riskFilter;
    const matchesType = typeFilter === 'All' || r.analysisType === typeFilter;

    return matchesSearch && matchesAnimal && matchesRisk && matchesType;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
              <Clock className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2D332B] tracking-tight">
              Animal Health History &amp; Records
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
              MySQL Relational Storage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#2D332B]/60">
            Log, filter, and review longitudinal screening records for dairy cows and water buffalo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-1.5 rounded-xl border border-[#E2E6D8] bg-white hover:bg-[#F3F4EF] text-[#2D332B] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => onNavigate('classifier')}
            className="px-4 py-1.5 rounded-xl bg-[#4B6344] hover:bg-[#3D5237] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* Filter and Search Toolbar */}
      <div className="p-5 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2D332B]/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by tag, condition, notes..."
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2E6D8] focus:border-[#4B6344] focus:ring-1 focus:ring-[#4B6344] bg-[#F9FAF7] text-[#2D332B] placeholder:text-[#2D332B]/40"
            />
          </div>

          {/* Animal Filter */}
          <select
            value={animalFilter}
            onChange={(e) => setAnimalFilter(e.target.value)}
            className="py-2.5 px-3 text-xs rounded-xl border border-[#E2E6D8] bg-[#F9FAF7] text-[#2D332B] focus:border-[#4B6344] focus:ring-1 focus:ring-[#4B6344]"
          >
            <option value="All">All Animals (Cattle &amp; Buffalo)</option>
            <option value="Cattle">Cattle only</option>
            <option value="Buffalo">Buffalo only</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="py-2.5 px-3 text-xs rounded-xl border border-[#E2E6D8] bg-[#F9FAF7] text-[#2D332B] focus:border-[#4B6344] focus:ring-1 focus:ring-[#4B6344]"
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="High">High Risk</option>
            <option value="Urgent">Urgent (Immediate Vet Attention)</option>
          </select>

          {/* Analysis Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-2.5 px-3 text-xs rounded-xl border border-[#E2E6D8] bg-[#F9FAF7] text-[#2D332B] focus:border-[#4B6344] focus:ring-1 focus:ring-[#4B6344]"
          >
            <option value="All">All Analysis Types</option>
            <option value="Classification">Classification Only</option>
            <option value="Skin Screening">Skin Screening</option>
          </select>

        </div>
      </div>

      {/* Records Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#4B6344] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#2D332B]/60">Loading stored records from database...</p>
        </div>
      ) : filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              onClick={() => setSelectedRecord(rec)}
              className="p-5 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs hover:border-[#4B6344] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                
                {/* Card Top: Image & Status */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#1F241E]">
                  <img
                    src={rec.imageUrl}
                    alt={rec.animalType}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-xs">
                    {rec.analysisType}
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                      rec.riskLevel === 'Urgent'
                        ? 'bg-rose-600 text-white'
                        : rec.riskLevel === 'High'
                        ? 'bg-[#EEF0E7] text-[#8B4513] border border-[#E2E6D8]'
                        : rec.riskLevel === 'Moderate'
                        ? 'bg-[#EEF0E7] text-[#8B4513] border border-[#E2E6D8]'
                        : 'bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]'
                    }`}>
                      {rec.riskLevel}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-[#2D332B]/50 font-mono">
                    <span>{rec.tagNumber || 'NO-TAG'}</span>
                    <span>{rec.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#2D332B] mt-1">
                    {rec.animalType}
                  </h3>

                  <div className="text-xs font-semibold text-[#2D332B]/80 mt-0.5">
                    {rec.skinConditionResult || `Predicted: ${rec.predictedAnimal}`}
                  </div>
                  <div className="text-[11px] text-[#2D332B]/60 mt-0.5">
                    Model Confidence: <span className="font-bold text-[#4B6344]">{rec.confidence}%</span>
                  </div>
                </div>

                {rec.notes && (
                  <p className="text-xs text-[#2D332B]/60 line-clamp-2 italic">
                    &ldquo;{rec.notes}&rdquo;
                  </p>
                )}

              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#E2E6D8] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#4B6344] group-hover:text-[#3D5237] flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </span>

                <button
                  onClick={(e) => handleDelete(rec.id, e)}
                  className="p-1.5 text-[#2D332B]/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl border border-[#E2E6D8] bg-white space-y-3">
          <Clock className="w-10 h-10 text-[#2D332B]/30 mx-auto" />
          <h3 className="text-base font-bold text-[#2D332B]">No matching records found</h3>
          <p className="text-xs text-[#2D332B]/60 max-w-sm mx-auto">
            Try adjusting your search criteria or analyze a new animal to create your first clinical log.
          </p>
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E2E6D8] p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#E2E6D8] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
                    {selectedRecord.analysisType} Record
                  </span>
                  <span className="text-xs text-[#2D332B]/50 font-mono">
                    {selectedRecord.date}
                  </span>
                </div>
                <h2 className="text-xl font-black text-[#2D332B] mt-1">
                  {selectedRecord.animalType} ({selectedRecord.tagNumber})
                </h2>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl text-[#2D332B]/50 hover:text-[#2D332B] hover:bg-[#F3F4EF] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="rounded-2xl overflow-hidden aspect-video bg-[#1F241E]">
              <img
                src={selectedRecord.imageUrl}
                alt={selectedRecord.animalType}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Diagnosis & Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F9FAF7] border border-[#E2E6D8]">
                <span className="text-xs text-[#2D332B]/60 font-semibold uppercase">Result / Condition</span>
                <div className="text-sm font-bold text-[#2D332B] mt-0.5">
                  {selectedRecord.skinConditionResult || selectedRecord.predictedAnimal}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F9FAF7] border border-[#E2E6D8]">
                <span className="text-xs text-[#2D332B]/60 font-semibold uppercase">Risk Level</span>
                <div className="text-sm font-bold text-[#2D332B] mt-0.5 flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    selectedRecord.riskLevel === 'Urgent'
                      ? 'bg-rose-600'
                      : selectedRecord.riskLevel === 'High'
                      ? 'bg-[#8B4513]'
                      : 'bg-[#4B6344]'
                  }`} />
                  <span>{selectedRecord.riskLevel} ({selectedRecord.confidence}% Confidence)</span>
                </div>
              </div>
            </div>

            {/* Symptoms & Precautions if present */}
            {selectedRecord.visibleSymptoms && selectedRecord.visibleSymptoms.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D332B]">
                  Observed Symptoms
                </h4>
                <div className="space-y-1.5">
                  {selectedRecord.visibleSymptoms.map((sym, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F9FAF7] border border-[#E2E6D8] text-xs text-[#2D332B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4B6344] shrink-0" />
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRecord.generalPrecautions && selectedRecord.generalPrecautions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D332B]">
                  General Precautions
                </h4>
                <div className="space-y-1.5">
                  {selectedRecord.generalPrecautions.map((prec, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F9FAF7] border border-[#E2E6D8] text-xs text-[#2D332B]">
                      <span className="w-2 h-2 rounded-full bg-[#4B6344] shrink-0" />
                      <span>{prec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedRecord.notes && (
              <div className="p-4 rounded-2xl bg-[#EEF0E7] border border-[#E2E6D8] text-xs text-[#2D332B]">
                <span className="font-bold text-[#4B6344]">Clinical Notes:</span> {selectedRecord.notes}
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-[#E2E6D8] flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedRecord(null);
                  onNavigate('chatbot');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#4B6344] hover:bg-[#3D5237] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Discuss with Livestock AI Assistant</span>
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl border border-[#E2E6D8] hover:bg-[#F3F4EF] text-[#2D332B] text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
