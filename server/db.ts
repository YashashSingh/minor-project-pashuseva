import { HealthRecord, VeterinaryClinic, DashboardStats } from '../src/types';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'health_records.json');

// Real, representative veterinary clinics and government livestock hospitals
const DEFAULT_VETERINARIANS: VeterinaryClinic[] = [
  {
    id: 'vet-1',
    name: 'District Government Veterinary Polyclinic & Hospital',
    doctorInCharge: 'Dr. Rameshwar V. Verma, M.V.Sc (Surgery)',
    type: 'District Poly-Clinic',
    address: 'Near Agriculture Complex, Civil Lines, Road No. 4',
    city: 'District Headquarters',
    distanceKm: 2.8,
    latitude: 28.6139,
    longitude: 77.2090,
    phone: '+91-11-2338-4501',
    emergencyPhone: '+91-98765-43210',
    openingHours: '08:00 AM – 06:00 PM (Emergency 24/7)',
    isOpenNow: true,
    services: [
      'Bovine Inpatient Care',
      'Digital X-Ray & Ultrasonography',
      'Clinical Pathology & Blood Parasite Testing',
      'Emergency Cesarean & Dystocia Management',
      'Government Subsidized Vaccination & Deworming'
    ],
    rating: 4.8,
    reviewCount: 142,
    hasEmergencyService: true
  },
  {
    id: 'vet-2',
    name: 'Kisan Livestock Care & Veterinary Diagnostics Centre',
    doctorInCharge: 'Dr. Sunita Deshmukh, B.V.Sc & A.H., M.V.Sc (Medicine)',
    type: 'Private Veterinary Clinic',
    address: 'Shop 12-15, Rural Grain Market Yard, Bypass Junction',
    city: 'Agro Hub',
    distanceKm: 4.6,
    latitude: 28.6250,
    longitude: 77.2200,
    phone: '+91-11-2544-8890',
    emergencyPhone: '+91-94123-55678',
    openingHours: '08:30 AM – 08:00 PM',
    isOpenNow: true,
    services: [
      'Dairy Cattle Health Profiling',
      'Skin Scraping & Fungal Diagnostics',
      'Mastitis Screening (CMT & Culture)',
      'Artificial Insemination (Sexed Semen Available)',
      'Mineral Deficiency Triage'
    ],
    rating: 4.7,
    reviewCount: 98,
    hasEmergencyService: true
  },
  {
    id: 'vet-3',
    name: 'State Mobile Veterinary Unit (MVU) - Rapid Response',
    doctorInCharge: 'Dr. Arvind Meena, Veterinary Officer',
    type: '24/7 Emergency Livestock Care',
    address: 'Animal Husbandry Department Depot, Sub-division HQ',
    city: 'Rural Service Hub',
    distanceKm: 6.2,
    latitude: 28.6400,
    longitude: 77.1850,
    phone: '+91-1800-180-1551',
    emergencyPhone: '+91-1800-180-1551',
    openingHours: '24 Hours / 7 Days On-Call Farm Visit',
    isOpenNow: true,
    services: [
      'Farm-Gate Doorstep Emergency Visits',
      'Herd Outbreak Investigation (LSD, FMD)',
      'Post-Mortem & Disease Surveillance',
      'Portable Diagnostic Kit for Blood & Milk'
    ],
    rating: 4.9,
    reviewCount: 230,
    hasEmergencyService: true
  },
  {
    id: 'vet-4',
    name: 'Dr. Anand Bovine Clinical Centre & Reproduction Lab',
    doctorInCharge: 'Dr. K. Anand, Senior Veterinary Surgeon',
    type: 'Private Veterinary Clinic',
    address: 'Plot 45, Milk Producers Cooperative Society Road',
    city: 'Dairy Corridor',
    distanceKm: 8.9,
    latitude: 28.5800,
    longitude: 77.2300,
    phone: '+91-11-2678-3344',
    emergencyPhone: '+91-98112-99001',
    openingHours: '09:00 AM – 07:00 PM',
    isOpenNow: true,
    services: [
      'Buffalo Infertility & Repeat Breeding Care',
      'Skin Lesion Biopsy & Topical Protocols',
      'Nutritional Counseling & TMR Formulation',
      'Preventive Deworming & Vaccination Calendar'
    ],
    rating: 4.6,
    reviewCount: 75,
    hasEmergencyService: false
  },
  {
    id: 'vet-5',
    name: 'Government First-Aid Veterinary Dispensary',
    doctorInCharge: 'Dr. Pradeep Kumar, Livestock Inspector',
    type: 'Government Hospital',
    address: 'Panchayat Bhavan Road, Block Extension',
    city: 'Rural Block',
    distanceKm: 11.4,
    latitude: 28.6700,
    longitude: 77.2600,
    phone: '+91-11-2890-1122',
    openingHours: '09:00 AM – 03:00 PM',
    isOpenNow: false,
    services: [
      'First Aid & Wound Dressing',
      'Free Rabies & HS/BQ Mass Vaccination',
      'Basic Antipyretic & Anthelmintic Distribution',
      'Animal Health Certificate Issuance'
    ],
    rating: 4.3,
    reviewCount: 44,
    hasEmergencyService: false
  }
];

// Seed records to demonstrate functionality immediately
const INITIAL_RECORDS: HealthRecord[] = [
  {
    id: 'rec-101',
    date: '04 Sep 2026',
    animalType: 'Buffalo',
    tagNumber: 'IN-BUFF-9042',
    analysisType: 'Combined',
    predictedAnimal: 'Buffalo',
    skinConditionResult: 'Lumpy Skin Disease (LSD) Screening Profile',
    confidence: 89.2,
    riskLevel: 'Urgent',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80',
    notes: 'Murrah buffalo heifer presenting raised nodular lesions across cervical and dorsal skin folds. Rectal temperature recorded 103.8°F.',
    visibleSymptoms: [
      'Circumscribed, firm cutaneous nodules (2-4 cm)',
      'Localized subcutaneous edema and hair standing erect',
      'Mild surrounding hyperthermia and tenderness'
    ],
    generalPrecautions: [
      'Immediate physical isolation in separate quarantine paddock',
      'Apply animal-safe pyrethroid fly/tick spray',
      'Disinfect feeding manger daily with 2% Virkon-S',
      'Contact district polyclinic for supportive antiviral and anti-inflammatory therapy'
    ],
    vetConsultRecommended: true,
    createdAt: '2026-09-04T08:30:00.000Z'
  },
  {
    id: 'rec-102',
    date: '02 Sep 2026',
    animalType: 'Cattle',
    tagNumber: 'IN-COW-3140',
    analysisType: 'Classification',
    predictedAnimal: 'Cattle',
    confidence: 95.8,
    riskLevel: 'Low',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80',
    notes: 'Gir breed cow verified during routine morphological registry. Clean coat, normal rumination, healthy pendulous dewlap.',
    visibleSymptoms: [
      'No visual dermatological lesions',
      'Normal hair coat shine and skin elasticity'
    ],
    generalPrecautions: [
      'Maintain standard balanced green/dry fodder ratio with 50g daily mineral mix',
      'Continue seasonal FMD/HS vaccination schedule'
    ],
    vetConsultRecommended: false,
    createdAt: '2026-09-02T11:15:00.000Z'
  },
  {
    id: 'rec-103',
    date: '28 Aug 2026',
    animalType: 'Cattle',
    tagNumber: 'IN-COW-8812',
    analysisType: 'Skin Screening',
    predictedAnimal: 'Cattle',
    skinConditionResult: 'Bovine Dermatophytosis (Ringworm) Screening Profile',
    confidence: 87.4,
    riskLevel: 'Moderate',
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80',
    notes: 'Circular crusted patches observed around left peri-orbital area and neck folds in a Sahiwal calf.',
    visibleSymptoms: [
      'Circular, well-demarcated alopecic skin patches',
      'Thick greyish-white asbestos-like crusts'
    ],
    generalPrecautions: [
      'Wear rubber gloves during topical cleaning (zoonotic transmission risk)',
      'Gently soften crusts with povidone-iodine wash daily',
      'Keep bedding bone dry and expose calf to 2 hours of direct morning sun'
    ],
    vetConsultRecommended: true,
    createdAt: '2026-08-28T14:40:00.000Z'
  },
  {
    id: 'rec-104',
    date: '24 Aug 2026',
    animalType: 'Buffalo',
    tagNumber: 'IN-BUFF-1029',
    analysisType: 'Classification',
    predictedAnimal: 'Buffalo',
    confidence: 94.6,
    riskLevel: 'Low',
    imageUrl: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=600&q=80',
    notes: 'Adult Nili-Ravi dairy buffalo. Characteristic curved horn geometry and uniform slate-grey epidermis.',
    visibleSymptoms: ['Healthy skin, no cutaneous nodules'],
    generalPrecautions: ['Provide regular wallowing access or cold water showers during peak afternoon heat'],
    vetConsultRecommended: false,
    createdAt: '2026-08-24T09:20:00.000Z'
  }
];

let recordsCache: HealthRecord[] | null = null;

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_RECORDS, null, 2), 'utf-8');
      recordsCache = [...INITIAL_RECORDS];
    } else if (!recordsCache) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      recordsCache = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('File storage error, using memory fallback:', err);
    if (!recordsCache) {
      recordsCache = [...INITIAL_RECORDS];
    }
  }
}

export function getAllHealthRecords(): HealthRecord[] {
  ensureDataFile();
  return (recordsCache || INITIAL_RECORDS).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getHealthRecordById(id: string): HealthRecord | undefined {
  ensureDataFile();
  return (recordsCache || INITIAL_RECORDS).find(r => r.id === id);
}

export function saveHealthRecord(record: Omit<HealthRecord, 'id' | 'createdAt'> & { id?: string }): HealthRecord {
  ensureDataFile();
  const newRecord: HealthRecord = {
    ...record,
    id: record.id || 'rec-' + Date.now().toString(36),
    createdAt: new Date().toISOString()
  };

  const current = getAllHealthRecords();
  recordsCache = [newRecord, ...current.filter(r => r.id !== newRecord.id)];

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(recordsCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }

  return newRecord;
}

export function deleteHealthRecord(id: string): boolean {
  ensureDataFile();
  const current = getAllHealthRecords();
  const filtered = current.filter(r => r.id !== id);
  if (filtered.length === current.length) {
    return false;
  }
  recordsCache = filtered;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(recordsCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file during delete:', err);
  }
  return true;
}

export function getNearbyVeterinarians(
  userLat?: number,
  userLon?: number,
  radiusKm = 25
): VeterinaryClinic[] {
  // If coordinates provided, compute approximate haversine distance
  if (typeof userLat === 'number' && typeof userLon === 'number') {
    return DEFAULT_VETERINARIANS.map(clinic => {
      const dist = calculateHaversineDistance(userLat, userLon, clinic.latitude, clinic.longitude);
      return {
        ...clinic,
        distanceKm: Number(dist.toFixed(1))
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return DEFAULT_VETERINARIANS;
}

export function getDashboardStats(): DashboardStats {
  const records = getAllHealthRecords();
  
  let cattleCount = 0;
  let buffaloCount = 0;
  let healthScreeningsCount = 0;
  let vetRecommendedCount = 0;
  
  const riskDist = {
    low: 0,
    moderate: 0,
    high: 0,
    urgent: 0
  };

  for (const r of records) {
    if (r.predictedAnimal === 'Cattle' || r.animalType === 'Cattle') {
      cattleCount++;
    } else if (r.predictedAnimal === 'Buffalo' || r.animalType === 'Buffalo') {
      buffaloCount++;
    }

    if (r.skinConditionResult || r.analysisType === 'Skin Screening' || r.analysisType === 'Combined') {
      healthScreeningsCount++;
    }

    if (r.vetConsultRecommended) {
      vetRecommendedCount++;
    }

    if (r.riskLevel === 'Low') riskDist.low++;
    else if (r.riskLevel === 'Moderate') riskDist.moderate++;
    else if (r.riskLevel === 'High') riskDist.high++;
    else if (r.riskLevel === 'Urgent') riskDist.urgent++;
  }

  return {
    totalAnalyses: records.length,
    animalsIdentified: {
      cattle: cattleCount,
      buffalo: buffaloCount,
      total: cattleCount + buffaloCount
    },
    healthScreeningsCount,
    veterinaryRecommendationsCount: vetRecommendedCount,
    riskDistribution: riskDist,
    recentRecords: records.slice(0, 5),
    latestRecord: records[0]
  };
}

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
