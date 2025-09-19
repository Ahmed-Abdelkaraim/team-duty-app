export interface AttendanceMember {
  name: string;
  branch: string;
  category: string;
  status: 'حضور' | 'غياب';
  code: string;
}

export interface BusTime {
  arrivalTime: string;
  departureTime: string;
  eventArrivalTime: string;
}

export type TeamType = 'نقل' | 'تنظيم خارجي';

export interface User {
  name: string;
  code: string;
  team: TeamType;
  branch?: string;
}