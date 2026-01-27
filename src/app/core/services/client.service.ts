import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Client, ClientRegisterNewDTO, ClientSubscriptionEndedDTO, RegisterRequest } from '../models/auth.model';
import { map, Observable } from 'rxjs';
import { ClientClassDTO, ClientEndingSoon, ClientPlanInfo } from '../models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientUrl = `${environment.apiUrl}/client`;
  private adminUrl = `${environment.apiUrl}/admin`;
  private tokenKey = 'token'
  constructor(private http: HttpClient) { }

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

  assignPlanToClient(clientId: number, planId: number, paymentMethod: string, discount: number): Observable<void> {

    let params = new HttpParams()
      .set('paymentMethod', paymentMethod)
      .set('discount', discount.toString());

    return this.http.post<void>(
      `${this.clientUrl}/${clientId}/assign-plan/${planId}`,
      {},
      {
        headers: this.getAuthHeaders(),
        params: params
      }
    );
  }

  getClientHistory(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.clientUrl}/${clientId}/history`, { headers: this.getAuthHeaders() });
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

  getClientPlanInfo(id: number): Observable<ClientPlanInfo> {
    return this.http.get<ClientPlanInfo>(`${this.clientUrl}/${id}/plan-info`, { headers: this.getAuthHeaders() });
  }

  getMyClasses(): Observable<ClientClassDTO[]> {
    return this.http.get<ClientClassDTO[]>(`${this.clientUrl}/classes`, { headers: this.getAuthHeaders() });
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.clientUrl}/client/${id}`, { headers: this.getAuthHeaders() });
  }

  updateTrialStatus(clientId: number, completed: boolean) {
    return this.http.put(
      `${this.clientUrl}/${clientId}/trial?completed=${completed}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }


  getClientClassesHistoryRange(clientId: number, startDate: string, endDate: string | null): Observable<any[]> {
    let url = `${this.clientUrl}/${clientId}/classes-history?startDate=${startDate}`;
    if (endDate) {
      url += `&endDate=${endDate}`;
    }
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() });
  }

}
