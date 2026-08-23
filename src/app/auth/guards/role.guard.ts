import { inject } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../../services/auth.service';


export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const auth = inject(AuthService);

  const router = inject(Router);


  // ==========================================
  // EXPECTED ROLE FROM ROUTE
  // ==========================================

  const expectedRole =
    route.data['role'];


  // ==========================================
  // CURRENT LOGGED-IN USER ROLE
  // ==========================================

  const currentRole =
    auth.getRole();


  // ==========================================
  // ROLE MATCH
  // ==========================================

  if (
    currentRole &&
    currentRole === expectedRole
  ) {

    return true;

  }


  // ==========================================
  // REDIRECT USER TO THEIR OWN DASHBOARD
  // ==========================================

  switch (currentRole) {


    // ========================================
    // ADMIN
    // ========================================

    case 'ADMIN':

      router.navigate([
        '/admin/dashboard'
      ]);

      break;


    // ========================================
    // SHEHA
    // ========================================

    case 'SHEHA':

      router.navigate([
        '/sheha/dashboard'
      ]);

      break;


    // ========================================
    // BUSINESS OWNER
    // ========================================

    case 'BUSINESS_OWNER':

      router.navigate([
        '/business-owner/dashboard'
      ]);

      break;


    // ========================================
    // TOURIST
    // ========================================

    case 'TOURIST':

      router.navigate([
        '/tourist/dashboard'
      ]);

      break;


    // ========================================
    // NO ROLE / INVALID ROLE
    // ========================================

    default:

      auth.logout();

      router.navigate([
        '/login'
      ]);

      break;

  }


  return false;

};