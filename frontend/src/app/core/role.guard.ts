import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard = (role: string): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const u = auth.user();
    if (!u) { router.navigate(['/login']); return false; }
    if (u.role !== role) { router.navigate(['/']); return false; }
    return true;
  };
};
