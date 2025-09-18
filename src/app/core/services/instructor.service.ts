import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { InstructorStats } from '../models/class.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = `${environment.apiUrl}/instructor`;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getInstructorStats(id: number, month?: number, year?: number): Observable<InstructorStats> {
    let params = new HttpParams();
    if (month) params = params.set('month', month);
    if (year) params = params.set('year', year);

    return this.http.get<InstructorStats>(`${this.apiUrl}/${id}/stats`, { params, headers: this.getHeaders() },);
  }
}
