import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private apiUrl = `${environment.apiUrl}/excel`;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  downloadMonthlyIncome() {
  return this.http.get<Blob>(`${this.apiUrl}/monthly-income`, {
    headers: this.getHeaders(),        
    responseType: 'blob' as 'json'      
  });
}


}
