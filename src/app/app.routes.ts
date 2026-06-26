import { Routes } from '@angular/router';
import { Home } from './public/home/home';
import { Login } from './auth/login/login';
import { ForgotPssword } from './auth/forgot-pssword/forgot-pssword';
import { Register } from './public/register/register';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { Licenses } from './admin/licenses/licenses';
import { AdminPayment } from './admin/admin-payment/admin-payment';
import { Complaints } from './admin/complaints/complaints';
import { Users } from './admin/users/users';
import { AdminNotifications } from './admin/admin-notifications/admin-notifications';
import { Reports } from './admin/reports/reports';
import { OwnerLayout } from './owner/owner-layout/owner-layout';
import { OwnerDashboard } from './owner/owner-dashboard/owner-dashboard';

export const routes: Routes = [
    {path: '',component:Home},
    {path: 'login',component:Login},
    {path: 'forgot-password',component:ForgotPssword},
    {path: 'register',component:Register},

    //ADMIN
    {
    path: 'admin',component: AdminLayout,
    children: [
      {path: '',redirectTo: 'dashboard',pathMatch: 'full'},
      {path: 'dashboard',component: AdminDashboard},
      {path: 'licenses',component: Licenses},
      {path: 'payments',component: AdminPayment},
      {path: 'Complaints',component: Complaints},
      {path: 'users',component: Users},
      {path: 'reports',component: Reports},
      {path: 'notifications',component: AdminNotifications}
    ]
  },
   
    //BUSINESS OWNER
    {path: 'businessman',component: OwnerLayout,
    children: [
      {path: '',redirectTo: 'dashboard',pathMatch: 'full'},
      {path: 'dashboard',component: OwnerDashboard},

    //   {
    //     path: 'apply-license',
    //     component: ApplyLicenseComponent
    //   },

    //   {
    //     path: 'my-licenses',
    //     component: MyLicensesComponent
    //   },

    //   {
    //     path: 'payments',
    //     component: BusinessPaymentsComponent
    //   },

    //   {
    //     path: 'notifications',
    //     component: BusinessNotificationsComponent
    //   },

    //   {
    //     path: 'profile',
    //     component: BusinessProfileComponent
    //   }

    ]

  }

    //TOURIST/CITIZEN
];


