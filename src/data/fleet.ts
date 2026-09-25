export const CATEGORIES = [
  'Ônibus',
  'Caminhão',
  'Moto',
  'Carro',
  'Caminhonete',
  'Van',
  'SUV',
  'Esportivo',
  'Trator',
  'Ambulância'
] as const;

export type Category = (typeof CATEGORIES)[number];

export type LinkId = 'vsat' | 'bgan' | 'ospf' | 'bgp' | 'lte';

export interface FleetCategory {
  name: Category;
  total: number;
  online: number;
  avgSpeed: number;
  consumption: number;
}

export interface FleetVehicle {
  id: string;
  category: Category;
  speed: number;
  status: 'ONLINE' | 'OFFLINE';
  consumption: number;
  link: LinkId;
}

export interface ConnectivityLink {
  id: LinkId;
  title: string;
  target: string;
  latency: number;
  traffic: number;
}

export const fleetCategories: FleetCategory[] = [
  { name: 'Ônibus', total: 10000, online: 9984, avgSpeed: 61, consumption: 78 },
  { name: 'Caminhão', total: 10000, online: 9984, avgSpeed: 57, consumption: 81 },
  { name: 'Moto', total: 10000, online: 9984, avgSpeed: 69, consumption: 63 },
  { name: 'Carro', total: 10000, online: 9984, avgSpeed: 63, consumption: 74 },
  { name: 'Caminhonete', total: 10000, online: 9984, avgSpeed: 66, consumption: 72 },
  { name: 'Van', total: 10000, online: 9984, avgSpeed: 58, consumption: 76 },
  { name: 'SUV', total: 10000, online: 9984, avgSpeed: 65, consumption: 72 },
  { name: 'Esportivo', total: 10000, online: 9984, avgSpeed: 85, consumption: 85 },
  { name: 'Trator', total: 10000, online: 9984, avgSpeed: 30, consumption: 74 },
  { name: 'Ambulância', total: 10000, online: 9984, avgSpeed: 75, consumption: 95 }
];

export const connectivityLinks: ConnectivityLink[] = [
  { id: 'vsat', title: 'Link VSAT (Hub Principal)', target: 'Satélite Star One D2', latency: 578, traffic: 78 },
  { id: 'bgan', title: 'Link VSAT (BGAN Backup)', target: 'Satélite Inmarsat', latency: 845, traffic: 12 },
  { id: 'ospf', title: 'Roteamento OSPF', target: 'Core Interno (10.0.0.1)', latency: 4, traffic: 91 },
  { id: 'bgp', title: 'Sessão BGP', target: 'Operadora AS-1042', latency: 14, traffic: 84 },
  { id: 'lte', title: 'Link LTE-Móvel', target: 'Antena Celular ERB', latency: 44, traffic: 45 }
];

