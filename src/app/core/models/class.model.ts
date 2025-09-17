export interface ClassSession {
  id?: number;
  name: string;
  disciplineId: number;
  instructorId: number;
  roomId: number;
  capacity: number;
  startDate: string;   
  startTime: string;   
  endTime: string;     
  repeat: boolean;
  clientIds?: number[];
}

export interface Room{
    id?: number;
    name: string;
}

export interface ClientEndingSoon {
  id: number;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  subscriptionEnd: string;
  classesTaken: number;
  classesRemaining: number;
  totalClasses: number;
}