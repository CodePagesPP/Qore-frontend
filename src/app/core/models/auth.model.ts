export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  birthday: string;
  sex: string;
  country: string;
  city: string;
  address: string;
  dni: string;
}

export interface User{
  email: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  birthday: string;
  sex: string;
  country: string;
  city: string;
  address: string;
  dni: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client{
  id: number;
  email: string;
  role: Role;
  name: string;
  lastName: string;
  phoneNumber: string;
  birthday: string;
  sex: string;
  country: string;
  city: string;
  address: string;
  dni: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Instructor{
  id: number;
  email: string;
  role: Role;
  name: string;
  lastName: string;
  phoneNumber: string;
  birthday: string;
  sex: string;
  country: string;
  city: string;
  address: string;
  dni: string;
  disciplineId: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Manager {
  id: number;
  email: string;
  role: Role;
  name: string;
  lastName: string;
  phoneNumber: string;
  birthday: string;
  sex: string;
  country: string;
  city: string;
  address: string;
  dni: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Staff {
  id: number;
  email: string;
  role: Role;
  name: string;
  lastName: string;
  phoneNumber: string;
  birthday: string;
  sex: string;
  country: string;
  city: string;
  address: string;
  dni: string;
  area: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Discipline {
  id: number;
  name: string;
  description: string;
}

export interface Role{
  id: number;
  name: string;
  description?: string;
}