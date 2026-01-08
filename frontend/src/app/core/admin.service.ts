import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE } from './api';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  nextLevelUsers() {
    return this.http.get(`${API_BASE}/admin/level-users`);
  }

  downline(userId: string) {
    return this.http.get(`${API_BASE}/admin/downline/${userId}`);
  }
  getDownline(userId: string) {
  return this.http.get(`${API_BASE}/admin/downline/${userId}`);
}

  credit(targetUserId: string, amount: number, note?: string) {
    return this.http.post(`${API_BASE}/admin/credit`, { targetUserId, amount, note });
  }

  summary() {
    return this.http.get(`${API_BASE}/admin/summary`);
  }
}
