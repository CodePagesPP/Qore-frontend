import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthRequest, AuthResponse, RegisterRequest } from '../models/auth.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private admin = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  register(credentials: RegisterRequest): Observable<any> {
    return this.http.post(`${this.admin}/registerClient`, credentials)
  }
}
