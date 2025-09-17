import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const roles = authService.getAuthorities();

    if (roles.includes('ADMIN_ACCESS')) {
      router.navigate(['/dashboard']);
    } else if (roles.includes('CLIENT_ACCESS')) {
      router.navigate(['/c/dashboard-client']);
    } else if (roles.includes('INSTRUCTOR_ACCESS')) {
      router.navigate(['/i/dashboard-instructor']);
    }

    return false;
  }

  return true;
};
