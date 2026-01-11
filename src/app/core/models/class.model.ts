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
  estado: string;  
  repeat: boolean;
  comentario?: string;
  comentarioAt: string;
  repeatUntil?: string | null;        // YYYY-MM-DD
  repeatDays: string[];          // MONDAY, TUESDAY… (DayOfWeek)
  repeatInterval?: number| null;
  clientIds?: number[];

  joined?: boolean;
  currentCount?: number;
}
export interface AttendanceDTO {
  clientId: number;
  name: string;
  email: string;
  status: string;
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

export interface ClientPlanInfo {
  id: number;
  name: string;
  lastName: string;
  email: string;
  dni: string;
  phoneNumber: string;
  planName: string;
  subscriptionEnd: Date | string; 
  totalClasses: number;
  classesTaken: number;
  classesRemaining: number;
  trialCompleted: boolean;
  canPurchasePlan: boolean;
}

export interface ClientClassDTO {
  id: number;
  name: string;
  instructorName: string;
  room: string;
  startDate: Date | string; 
  startTime: string;
  endTime: string;
}

export interface InstructorStats {
  id: number;
  name: string;
  lastName: string;
  email: string;
  dni: string;
  phoneNumber: string;
  totalClassesThisMonth: number;
  totalStudentsThisMonth: number;
  pendingClassesThisMonth: number;
}
