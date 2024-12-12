import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getDonations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/donations`);
  }

  createDonation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/donations`, data);
  }

  updateDonation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/donations/${id}`, data);
  }

  deleteDonation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/donations/${id}`);
  }

  getCampaigns(): Observable<any> {
    return this.http.get(`${this.apiUrl}/campaigns`);
  }

  createCampaign(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/campaigns`, data);
  }

  updateCampaign(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/campaigns/${id}`, data);
  }

  deleteCampaign(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/campaigns/${id}`);
  }

}
