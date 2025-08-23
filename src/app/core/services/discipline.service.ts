import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Discipline } from '../models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisciplineService {
  private apiUrl = `${environment.apiUrl}/disciplines`;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAll(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(this.apiUrl,  { headers: this.getHeaders() });
  }

  create(discipline: Discipline): Observable<Discipline> {
    return this.http.post<Discipline>(this.apiUrl, discipline,  { headers: this.getHeaders() });
  }

  update(id: number, discipline: Discipline): Observable<Discipline> {
    return this.http.put<Discipline>(`${this.apiUrl}/${id}`, discipline,  { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`,  { headers: this.getHeaders() });
  }
}
