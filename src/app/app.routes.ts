import { Routes } from '@angular/router';
import { Home } from './public/home/home';
import { Login } from './auth/login/login';
import { ForgotPssword } from './auth/forgot-pssword/forgot-pssword';
import { Register } from './public/register/register';

export const routes: Routes = [
    {path: '',component:Home},
    {path: 'login',component:Login},
    {path: 'forgot-password',component:ForgotPssword},
    {path: 'register',component:Register}
];
