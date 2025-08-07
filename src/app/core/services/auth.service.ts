import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthRequest, AuthResponse, RegisterRequest } from '../models/auth.model';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private admin = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

 login(credentials: AuthRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
    catchError((error) => {
      let errorMsg = 'Ocurrió un error inesperado';

      
      if (error.error && error.error.message) {
        errorMsg = error.error.message;
      }
      return throwError(() => new Error(errorMsg));
    })
  );
}

  isAuthenticated(): boolean {
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return !!token;
  }

  return false;
}

  register(credentials: RegisterRequest): Observable<any> {
    return this.http.post(`${this.admin}/registerClient`, credentials)
  }
}
