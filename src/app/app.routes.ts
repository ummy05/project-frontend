import { Routes } from '@angular/router';
import { Home } from './public/home/home';
import { Login } from './auth/login/login';

export const routes: Routes = [
    {path: '',component:Home},
    {path: 'login',component:Login}
];
