import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MutualFundService {
  private apiUrl = 'http://localhost:5154/api/Investment/mutualFund';

  constructor(private http: HttpClient) {}

  addMutualFund(data: any) {
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

  updateMutualFund(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteMutualFund(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getMutualFunds(userId: number) {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
}
