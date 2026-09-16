export const INITIAL_DONORS = [
  {
    id: 'dnr-1',
    userId: 'usr-dnr-1',
    fullName: 'Qasim Cali',
    email: 'qasim@gmail.com',
    phone: '+252 61 623 2323',
    bloodType: 'AB+',
    region: 'Banaadir',
    district: 'Hodan',
    availability: 'Available',
    donationsCount: 3,
    verified: true,
    avatar: null
  },
  {
    id: 'dnr-2',
    userId: 'usr-dnr-2',
    fullName: 'Dr. Farhiya Axmed',
    email: 'farhiya@gmail.com',
    phone: '+252 61 555 1234',
    bloodType: 'O+',
    region: 'Banaadir',
    district: 'Wadajir',
    availability: 'Available',
    donationsCount: 5,
    verified: true,
    avatar: null
  },
  {
    id: 'dnr-3',
    userId: 'usr-dnr-3',
    fullName: 'Maxamed Xasan',
    email: 'maxamed@gmail.com',
    phone: '+252 61 777 8899',
    bloodType: 'A+',
    region: 'Banaadir',
    district: 'Yaaqshiid',
    availability: 'Available',
    donationsCount: 2,
    verified: true,
    avatar: null
  },
  {
    id: 'dnr-4',
    userId: 'usr-dnr-4',
    fullName: 'Sahra Cumar',
    email: 'sahra@gmail.com',
    phone: '+252 61 888 4433',
    bloodType: 'B+',
    region: 'Banaadir',
    district: 'Howlwadaag',
    availability: 'Available',
    donationsCount: 4,
    verified: true,
    avatar: null
  }
];

export const INITIAL_REQUESTS = [];
export const INITIAL_PAYMENTS = [];

export const INITIAL_USERS = [
  { 
    id: 'usr-admin-1', 
    fullName: 'Madahiye Administrator', 
    email: 'Emre@gmail.com', 
    phone: '+252 61 679 6362', 
    role: 'admin', 
    isBlocked: false, 
    createdAt: '2026-01-10' 
  },
  {
    id: 'usr-dnr-1',
    fullName: 'Qasim Cali',
    email: 'qasim@gmail.com',
    phone: '+252 61 623 2323',
    role: 'donor',
    bloodType: 'AB+',
    region: 'Banaadir',
    district: 'Hodan',
    isBlocked: false,
    createdAt: '2026-09-08'
  },
  {
    id: 'usr-dnr-2',
    fullName: 'Dr. Farhiya Axmed',
    email: 'farhiya@gmail.com',
    phone: '+252 61 555 1234',
    role: 'donor',
    bloodType: 'O+',
    region: 'Banaadir',
    district: 'Wadajir',
    isBlocked: false,
    createdAt: '2026-09-10'
  },
  {
    id: 'usr-dnr-3',
    fullName: 'Maxamed Xasan',
    email: 'maxamed@gmail.com',
    phone: '+252 61 777 8899',
    role: 'donor',
    bloodType: 'A+',
    region: 'Banaadir',
    district: 'Yaaqshiid',
    isBlocked: false,
    createdAt: '2026-09-12'
  },
  {
    id: 'usr-dnr-4',
    fullName: 'Sahra Cumar',
    email: 'sahra@gmail.com',
    phone: '+252 61 888 4433',
    role: 'donor',
    bloodType: 'B+',
    region: 'Banaadir',
    district: 'Howlwadaag',
    isBlocked: false,
    createdAt: '2026-09-14'
  }
];
