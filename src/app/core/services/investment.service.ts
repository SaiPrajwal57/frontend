// core/services/investment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Investment } from '../models/investment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  private apiUrl = 'http://localhost:3000/investments'; 

  constructor(private http: HttpClient) {}

  getUserInvestments(userId: number): Observable<Investment[]> {
    return this.http.get<Investment[]>(`${this.apiUrl}?userId=${userId}`);
  }

  refreshPrices(): void {
    console.log('Prices refreshed (placeholder)');
  }
}
