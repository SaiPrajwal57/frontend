import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GoldBondService {
  private apiUrl = 'http://localhost:5154/api/Investment/goldBond';

  constructor(private http: HttpClient) {}

  addGoldBond(data: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }

    const payload = {
      ...data,
      transactionType: data.transactionType || 'Buy',
      userId: userId,
    };
    console.log('Payload:', payload);

    return this.http.post(this.apiUrl, payload);
  }

  updateGoldBond(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteGoldBond(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getGoldBonds(userId: number) {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
}
