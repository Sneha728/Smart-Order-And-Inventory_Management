import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[] | undefined;
  const userRole = authService.getUserRole();

  console.log('User Role:', userRole);
  console.log('Allowed Roles:', allowedRoles);

  // Not logged in
  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  // No role restriction → allow
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Role allowed
  if (allowedRoles.includes(userRole)) {
    return true;
  }

  // Logged in but not authorized
  router.navigate(['/unauthorized']);
  return false;
};
