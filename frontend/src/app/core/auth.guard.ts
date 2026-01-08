import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Already logged in in memory
  if (auth.user()) return true;

  return auth.me().pipe(
    map((res) => {
      auth.user.set(res.user);
      return true;
    }),
    catchError(() => {
      // ✅ Avoid /login? (empty query)
      const returnUrl = state?.url && state.url !== '/login' ? state.url : '/';
      router.navigate(['/login'], { queryParams: { returnUrl } });
      return of(false);
    })
  );
};
