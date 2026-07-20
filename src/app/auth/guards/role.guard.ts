import { inject } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const roleGuard: CanActivateFn = (

route:ActivatedRouteSnapshot

)=>{

const auth=inject(AuthService);

const router=inject(Router);

const expectedRole=

route.data['role'];

const currentRole=

auth.getRole();

if(currentRole===expectedRole){

return true;

}

switch(currentRole){

case 'ADMIN':

router.navigate(

['/admin/dashboard']

);

break;

case 'BUSINESS_OWNER':

router.navigate(

['/owner/dashboard']

);

break;

case 'TOURIST':

router.navigate(

['/tourist/dashboard']

);

break;

default:

router.navigate(['/login']);

}

return false;

};