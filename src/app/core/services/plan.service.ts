import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlanCreate, PlanResponse, PlanUpdate } from '../models/plan.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = `${environment.apiUrl}/plans`;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllPlans(): Observable<PlanResponse[]> {
    return this.http.get<PlanResponse[]>(`${this.apiUrl}/listPlans`, { headers: this.getHeaders() });
  }

  createPlan(plan: PlanCreate): Observable<PlanResponse> {
    return this.http.post<PlanResponse>(`${this.apiUrl}`, plan, { headers: this.getHeaders() });
  }

  updatePlan(id: number, plan: PlanUpdate): Observable<PlanResponse> {
    return this.http.put<PlanResponse>(`${this.apiUrl}/updatePlan/${id}`, plan, { headers: this.getHeaders() });
  }

  deletePlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletePlan/${id}`, { headers: this.getHeaders() });
  }
}
