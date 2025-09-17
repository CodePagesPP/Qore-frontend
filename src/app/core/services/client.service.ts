import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Client, ClientRegisterNewDTO, ClientSubscriptionEndedDTO, RegisterRequest } from '../models/auth.model';
import { map, Observable } from 'rxjs';
import { ClientEndingSoon } from '../models/class.model';

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

  getClientsWithBirthdayInNextWeek(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.clientUrl}/birthdays`, { headers: this.getAuthHeaders() });
  }
  getClientsEndingSoon(): Observable<ClientEndingSoon[]> {
    return this.http.get<ClientEndingSoon[]>(`${this.clientUrl}/subscriptions/ending-soon`, { headers: this.getAuthHeaders() });
  }

  getClientsRegistered(month?: number, year?: number): Observable<ClientRegisterNewDTO[]> {
    let params = '';
    if (month && year) {
      params = `?month=${month}&year=${year}`;
    }
    return this.http.get<ClientRegisterNewDTO[]>(`${this.clientUrl}/registered${params}`, { headers: this.getAuthHeaders() });
  }


  getClientRegistrationsStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.clientUrl}/registrations/stats`, { headers: this.getAuthHeaders() });
  }

  getInactiveClientsCount(): Observable<number> {
    return this.http
      .get<{ countSubscriptionEnded: number }>(`${this.clientUrl}/subscription-ended-2months/count`, { headers: this.getAuthHeaders() })
      .pipe(map(res => res.countSubscriptionEnded));
  }

  getInactiveClients(): Observable<ClientSubscriptionEndedDTO[]> {
    return this.http.get<ClientSubscriptionEndedDTO[]>(
      `${this.clientUrl}/subscription-ended-2months`, { headers: this.getAuthHeaders() }
    );
  }

}
