import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationManagerService } from '../services/authentication-manager/authentication-manager.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthenticationManagerService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const isLoggedIn = authService.isLoggedIn();
  const userRole = authService.getRole();
  
  if (isLoggedIn) {

    if (!userRole) {
      toastr.error('Your role could not be determined. Please log in again.', 'Access Denied', { positionClass: 'toast-bottom-right' });
      router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as string[] | undefined;
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      router.navigate(['/unauthorized']);
      return false;
    }

    if (route.url[0].path === 'login') {
      toastr.info('You are already logged in.', 'Info', { positionClass: 'toast-bottom-right' });
      userRole == 'Admin' ? router.navigate(['admin/users']) : router.navigate(['/user']);
      return false;
    }
    return true;
  }

  if (route.url[0].path === 'login' || route.url[0].path === 'register') {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};