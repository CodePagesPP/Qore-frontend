import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AttendanceDTO } from '../models/class.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private ApiUrl = `${environment.apiUrl}/attendance`;
  private tokenKey = 'token';
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  markAttendance(classId: number, clientId: number, status: string) {
  return this.http.post(`${this.ApiUrl}/mark`, null, {
    params: { classId, clientId, status },
    headers: this.getAuthHeaders()
  });
}
getByClass(classId: number): Observable<AttendanceDTO[]> {
  return this.http.get<AttendanceDTO[]>(`${this.ApiUrl}/class/${classId}`, {
    headers: this.getAuthHeaders()
  });
}


}
