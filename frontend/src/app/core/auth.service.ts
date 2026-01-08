import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { API_BASE } from './api';

export type Role = 'OWNER' | 'ADMIN' | 'USER';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<any>(null);

  constructor(private http: HttpClient) {}

  captcha() {
    return this.http.get<{question: string, captchaId: string}>(`${API_BASE}/auth/captcha`);
  }

  login(payload: { username: string; password: string; captchaAnswer: string }) {
    return this.http.post(`${API_BASE}/auth/login`, payload);
  }

  me() {
    return this.http.get<{ user: any }>(`${API_BASE}/auth/me`);
  }

  logout() {
    return this.http.post(`${API_BASE}/auth/logout`, {});
  }
}
