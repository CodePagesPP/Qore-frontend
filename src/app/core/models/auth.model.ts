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

export interface workerRegisterRequest {
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
  role: Role;
  area?: string;
  disciplineId?: number[]
  createdAt: Date;
  updatedAt: Date;
}

export interface workerUpdateRequest {
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
  role: Role;
  area?: string;
  disciplineId?: number[];
  updatedAt: Date;
}

export interface User{
  id: number;
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
  id?: number;
  name: string;
  description: string;
}

export interface Role{
  id: number;
  name: string;
  description?: string;
}

export interface RoleE {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface RoleDTO {
  id?: number;
  name: string;
  description: string;
  permissionIds: number[];
}