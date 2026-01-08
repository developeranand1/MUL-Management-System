import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE } from './api';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  createUser(payload: { username: string; password: string }) {
    return this.http.post(`${API_BASE}/users`, payload);
  }

  children() {
    return this.http.get<{children: any[]}>(`${API_BASE}/users/children`);
  }

  downline() {
    return this.http.get<{downline: any[]}>(`${API_BASE}/users/downline`);
  }

  changePassword(id: string, newPassword: string) {
    return this.http.patch(`${API_BASE}/users/${id}/password`, { newPassword });
  }

  changeChildPassword(childId: string, newPassword: string) {
  return this.http.post(`${API_BASE}/users/${childId}/change-password`, { newPassword });
}

}
