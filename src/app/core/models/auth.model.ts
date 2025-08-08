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
}