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
import { ApplyLicense } from './owner/apply-license/apply-license';
import { MyLicenses } from './owner/my-licenses/my-licenses';
import { OwnerPayment } from './owner/owner-payment/owner-payment';
import { OwnerNotifications } from './owner/owner-notifications/owner-notifications';
import { OwnerProfile } from './owner/owner-profile/owner-profile';
import { TouristLayout } from './tourist/tourist-layout/tourist-layout';
import { TouristDashboard } from './tourist/tourist-dashboard/tourist-dashboard';
import { ReportIssue } from './tourist/report-issue/report-issue';
import { MyReports } from './tourist/my-reports/my-reports';
import { TouristNotifictions } from './tourist/tourist-notifictions/tourist-notifictions';
import { MyProfile } from './tourist/my-profile/my-profile';
import { VerifyOtp } from './auth/verify-otp/verify-otp';
import { ResetPassword } from './auth/reset-password/reset-password';
import { Inspections } from './admin/inspections/inspections';

export const routes: Routes = [
    {path: '',component:Home},
    {path: 'login',component:Login},
    {path: 'forgot-password',component:ForgotPssword},
    {path: 'register',component:Register},
    {path: 'verify-otp',component:VerifyOtp},
    {path: 'reset-password',component:ResetPassword},

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
      {path: 'notifications',component: AdminNotifications},
      {path: 'inspections',component: Inspections}
    ]
   },
   
    //BUSINESS OWNER
    {path: 'owner',component: OwnerLayout,
    children: [
      {path: '',redirectTo: 'dashboard',pathMatch: 'full'},
      {path: 'dashboard',component: OwnerDashboard},
      {path: 'apply-license',component: ApplyLicense},
      {path: 'my-licenses',component: MyLicenses},
      {path: 'payments',component: OwnerPayment},
      {path: 'notifications',component: OwnerNotifications},
      {path: 'profile',component: OwnerProfile}

    ]
   },

    //TOURIST/CITIZEN
     {
    path: 'tourist',
    component: TouristLayout,
    children: [
      {path: '',redirectTo: 'dashboard',pathMatch: 'full'},
      {path: 'dashboard',component: TouristDashboard},
      {path: 'report-issue',component: ReportIssue},
      {path: 'my-reports',component: MyReports},
      {path: 'notifications',component: TouristNotifictions},
       {path: 'profile',component: MyProfile}
    ]
  }
];


