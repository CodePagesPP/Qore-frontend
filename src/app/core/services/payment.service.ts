import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`; 
  private tokenKey = 'token';
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey) || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  startCheckout(clientId: number, planId: number): Observable<{ init_point: string }> {
    return this.http.post<{ init_point: string }>(
      `${this.apiUrl}/checkout?clientId=${clientId}&planId=${planId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}