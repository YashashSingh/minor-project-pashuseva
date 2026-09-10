import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Search, 
  Compass, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  ExternalLink 
} from 'lucide-react';
import { VeterinaryClinic } from '../types';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const VeterinariansPage: React.FC = () => {
  const [clinics, setClinics] = useState<VeterinaryClinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [userLocationGranted, setUserLocationGranted] = useState(false);

  const fetchClinics = async (lat?: number, lon?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getNearbyVeterinarians(lat, lon);
      setClinics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch veterinary clinics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocationGranted(true);
        fetchClinics(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        // Fallback default coordinates
        fetchClinics(28.6139, 77.209);
      }
    );
  };

  const filteredClinics = clinics.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.services.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'All' || c.type === selectedType;
    const matchesEmergency = !emergencyOnly || c.emergencyAvailable;

    return matchesSearch && matchesType && matchesEmergency;
  });

  const clinicTypes = ['All', 'Government Veterinary Hospital', 'District Veterinary Polyclinic', '24/7 Mobile Veterinary Unit', 'Specialist Dairy Health Centre'];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="pt-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
            <MapPin className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2D332B] tracking-tight">
            Find Nearby Veterinary Doctors &amp; Clinics
          </h1>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
            Emergency Triage Directory
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#2D332B]/60">
          Connect with certified veterinary practitioners, government dispensaries, and round-the-clock livestock ambulances.
        </p>
      </div>

      <DisclaimerBanner compact />

      {/* Emergency Hotline Alert Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#2D332B] to-[#3D5237] text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#E2E6D8]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#4B6344]/50 text-[#EEF0E7] text-[10px] font-bold uppercase tracking-wider border border-[#EEF0E7]/20">
            National Livestock Toll-Free Helpline
          </div>
          <h3 className="text-base sm:text-lg font-bold">
            Dial 1962 for Government Mobile Veterinary Ambulance
          </h3>
          <p className="text-xs text-[#EEF0E7]/80">
            24/7 Emergency triage dispatch for acute livestock trauma, high fever, or infectious outbreak reporting.
          </p>
        </div>

        <a
          href="tel:1962"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#8B4513] hover:bg-[#72380f] text-white font-bold text-sm shadow-xs transition-colors shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span>Call 1962 Helpline</span>
        </a>
      </div>

      {/* Search & Filtering Bar */}
      <div className="p-5 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2D332B]/40" />
            <input
              id="input-search-clinics"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by clinic name, address, district, or service (e.g., Surgery, Vaccination)..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E6D8] focus:border-[#4B6344] focus:ring-1 focus:ring-[#4B6344] bg-[#F9FAF7] text-[#2D332B] placeholder:text-[#2D332B]/40"
            />
          </div>

          {/* Location Trigger */}
          <button
            onClick={handleUseMyLocation}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
              userLocationGranted
                ? 'bg-[#EEF0E7] border-[#4B6344] text-[#4B6344] font-bold'
                : 'bg-[#F3F4EF] hover:bg-[#EEF0E7] text-[#2D332B] border-[#E2E6D8]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#4B6344]" />
            <span>{userLocationGranted ? 'Location Detected' : 'Use My GPS'}</span>
          </button>

          {/* Emergency Only Toggle */}
          <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#E2E6D8] text-xs font-medium text-[#2D332B] cursor-pointer hover:bg-[#F3F4EF]">
            <input
              type="checkbox"
              checked={emergencyOnly}
              onChange={(e) => setEmergencyOnly(e.target.checked)}
              className="rounded text-[#4B6344] focus:ring-[#4B6344]"
            />
            <span>24/7 Emergency Only</span>
          </label>

        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          {clinicTypes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedType === t
                  ? 'bg-[#4B6344] text-white font-bold border-[#4B6344] shadow-xs'
                  : 'bg-[#F3F4EF] text-[#2D332B]/70 hover:text-[#2D332B] border-[#E2E6D8]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Clinic Cards Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#4B6344] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#2D332B]/60">Querying verified veterinary registry...</p>
        </div>
      ) : filteredClinics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="p-6 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs hover:border-[#4B6344] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F3F4EF] text-[#2D332B] border border-[#E2E6D8]">
                    {clinic.type}
                  </span>
                  {clinic.emergencyAvailable && (
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[#EEF0E7] text-[#8B4513] border border-[#E2E6D8] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513] animate-pulse" />
                      24/7 Care
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#2D332B] leading-snug">
                    {clinic.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#2D332B]/60 mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#4B6344]" />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="text-xs text-[#4B6344] font-bold mt-1">
                    Approx. {clinic.distanceKm} km away
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2E6D8] space-y-1.5 text-xs text-[#2D332B]/80">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#2D332B]/40 shrink-0" />
                    <span>Hours: {clinic.hours}</span>
                  </div>
                  {clinic.doctorInCharge && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-[#2D332B]/40 shrink-0" />
                      <span>In-Charge: {clinic.doctorInCharge}</span>
                    </div>
                  )}
                </div>

                {/* Services List */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-[#2D332B]/50 uppercase tracking-wider mb-1.5">
                    Available Services
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {clinic.services.map((svc, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#F3F4EF] text-[#2D332B]/80 px-2.5 py-0.5 rounded-md border border-[#E2E6D8]"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="pt-3 border-t border-[#E2E6D8] flex items-center gap-2">
                <a
                  href={`tel:${clinic.phone}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#4B6344] hover:bg-[#3D5237] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call: {clinic.phone}</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(clinic.name + ' ' + clinic.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-[#E2E6D8] bg-[#F9FAF7] hover:bg-[#EEF0E7] text-[#2D332B] transition-colors"
                  title="View on Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl border border-[#E2E6D8] bg-white space-y-2">
          <p className="text-sm font-bold text-[#2D332B]">No clinics match your search filter</p>
          <p className="text-xs text-[#2D332B]/60">
            Try clearing the search box or changing the clinic type filter.
          </p>
        </div>
      )}

    </div>
  );
};
