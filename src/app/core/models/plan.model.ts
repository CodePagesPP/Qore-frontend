export interface PlanResponse {
  id: number;
  name: string;
  discipline_id: number[];
  description: string;
  sessions: number;
  payMethod: string;
  duration: number;
  price: number;
  sellType: string;
  active: boolean;
  reprograms: number;
}

export interface PlanCreate {
  name: string;
  discipline_id: number[];
  description: string;
  sessions: number;
  payMethod: string;
  duration: number;
  price: number;
  sellType: string;
  active: boolean;
  reprograms: number;
}

export interface PlanUpdate extends Partial<PlanCreate> {}