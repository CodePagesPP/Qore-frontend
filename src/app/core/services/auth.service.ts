import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthRequest, AuthResponse, RegisterRequest, User } from '../models/auth.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private adminUrl = `${environment.apiUrl}/admin`;
  private tokenKey = 'token'

  constructor(private http: HttpClient, private router: Router) {}

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
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  return false;
}

  register(credentials: RegisterRequest): Observable<any> {
    return this.http.post(`${this.adminUrl}/registerClient`, credentials)
  }

  logout(): void{
  localStorage.removeItem(this.tokenKey);
  this.router.navigate(['/login']);
}

private getToken(): string | null{
  if(typeof window!== 'undefined'){
    return localStorage.getItem(this.tokenKey);
  }else{
    return null;
  }
}

getUserInfo(): Observable<User> {
  const token = this.getToken();  // Obtiene el token del localStorage
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  return this.http.get<User>(`${this.adminUrl}/profile`, { headers }).pipe(
    map((response: User) => {
      
      return response;  // Devuelves el objeto modificado
    })
  );
}
}
