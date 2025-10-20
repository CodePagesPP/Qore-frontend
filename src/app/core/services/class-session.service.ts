import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClassSession, Room } from '../models/class.model';
import { Observable } from 'rxjs';
import { Client } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ClassSessionService {
  private classApiUrl = `${environment.apiUrl}/class-sessions`;
  private roomApiUrl = `${environment.apiUrl}/rooms`;
  private tokenKey = 'token';
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAll(): Observable<ClassSession[]> {
    return this.http.get<ClassSession[]>(`${this.classApiUrl}/getAll`,{ headers: this.getAuthHeaders() });
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.roomApiUrl}`,{ headers: this.getAuthHeaders() });
  }

  getById(id: number): Observable<ClassSession> {
    return this.http.get<ClassSession>(`${this.classApiUrl}/getById/${id}`,{ headers: this.getAuthHeaders() });
  }

  create(dto: ClassSession): Observable<ClassSession> {
    return this.http.post<ClassSession>(`${this.classApiUrl}/create`, dto,{ headers: this.getAuthHeaders() });
  }

  update(id: number, dto: ClassSession): Observable<ClassSession> {
    return this.http.put<ClassSession>(`${this.classApiUrl}/update/${id}`, dto,{ headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.classApiUrl}/delete/${id}`,{ headers: this.getAuthHeaders() });
  }

  addClientToClass(classId: number, clientId: number): Observable<string> {
    return this.http.put<string>(`${this.classApiUrl}/${classId}/clients/${clientId}`, {},{ headers: this.getAuthHeaders() });
  }
  removeClientFromClass(classId: number, clientId: number): Observable<string> {
  return this.http.delete<string>(`${this.classApiUrl}/${classId}/clients/${clientId}`, {
    headers: this.getAuthHeaders()
  });
}


  getWeeklyClassCount() {
  return this.http.get<{ weeklyCount: number }>(`${this.classApiUrl}/weekly-count`, { headers: this.getAuthHeaders() });
}


getByInstructor(instructorId: number): Observable<ClassSession[]> {
    return this.http.get<ClassSession[]>(`${this.classApiUrl}/instructor/${instructorId}`, { headers: this.getAuthHeaders() });
}

getClientByDiscipline(ClientId: number): Observable<ClassSession[]> {
    return this.http.get<ClassSession[]>(`${this.classApiUrl}/client/${ClientId}`, { headers: this.getAuthHeaders() });
  }

  getPendingTodayInstructor(instructorId: number): Observable<ClassSession[]> {
  return this.http.get<ClassSession[]>(
    `${this.classApiUrl}/instructors/${instructorId}/pending-today`, { headers: this.getAuthHeaders() }
  );
}

joinClass(classId: number, clientId: number): Observable<any> {
  return this.http.post(`${this.classApiUrl}/${classId}/join/${clientId}`, {}, { headers: this.getAuthHeaders() });
}


getClientsByClass(classId: number): Observable<Client[]> {
  return this.http.get<Client[]>(`${this.classApiUrl}/${classId}/clients`, {
    headers: this.getAuthHeaders()
  });
}


}
