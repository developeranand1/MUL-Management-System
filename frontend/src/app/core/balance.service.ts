import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE } from './api';

@Injectable({ providedIn: 'root' })
export class BalanceService {
  constructor(private http: HttpClient) {}

  statement() {
    return this.http.get(`${API_BASE}/balance/statement`);
  }

  transfer(receiverId: string, amount: number, note?: string) {
    return this.http.post(`${API_BASE}/balance/transfer`, { receiverId, amount, note });
  }

 selfRecharge(amount: number, note?: string) {
  return this.http.post(`${API_BASE}/balance/self-recharge`, { amount, note });
}
}
