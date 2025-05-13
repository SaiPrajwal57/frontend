import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class stockService {
  private apiUrl = 'http://localhost:5154/api/Investment/stock';

  constructor(private http: HttpClient) {}

  addstock(data: any) {
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

  // updatestock(id: number, data: any) {
  //   return this.http.put(`${this.apiUrl}/${id}`, data);
  // }

  // deletestock(id: number) {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }

  updatestock(id: number | string, data: any) {
    return this.http.put(`http://localhost:5154/api/Investment/stock/${id}`, data);
  }
  
  deletestock(id: number | string) {
    return this.http.delete(`http://localhost:5154/api/Investment/${id}`);
  }
  
  getstocks(userId: number) {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
}
