import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Client, RegisterRequest } from '../models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientUrl = `${environment.apiUrl}/client`;
  private adminUrl = `${environment.apiUrl}/admin`;
  private tokenKey = 'token'
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  registerClient(dto: RegisterRequest): Observable<Client> {
    return this.http.post<Client>(`${this.adminUrl}/registerClient`, dto, { headers: this.getAuthHeaders() });
  }

  updateClient(dni: string, dto: Partial<RegisterRequest>): Observable<Client> {
    return this.http.patch<Client>(`${this.clientUrl}/client/${dni}`, dto, { headers: this.getAuthHeaders() });
  }

  deleteClient(dni: string): Observable<void> {
    return this.http.delete<void>(`${this.clientUrl}/client/${dni}`, { headers: this.getAuthHeaders() });
  }
}
