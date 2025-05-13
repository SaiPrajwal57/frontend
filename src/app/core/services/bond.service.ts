import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BondService {
  private apiUrl = 'http://localhost:5154/api/Investment/bond';

  constructor(private http: HttpClient) {}

  addBond(data: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }
    const payload = {
        ...data,
        transactionType: data.transactionType || 'Buy',
        userId: userId,
        Type: 'bond', 
      };
      return this.http.post(this.apiUrl, payload);
    }

  updateBond(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteBond(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getBonds(userId: number) {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
 }
 
}
