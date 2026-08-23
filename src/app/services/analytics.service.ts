// src/app/services/analytics.service.ts

import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  environment
} from '../environment/environment';


// =====================================================
// BUSINESS OWNER DASHBOARD
// =====================================================

export interface BusinessDashboardResponse {

  myLicenses: number;

  approvedLicenses: number;

  pendingLicenses: number;

  rejectedLicenses: number;

  myPayments: number;

  approvedPayments: number;

  pendingPayments: number;

  totalPaid: number;

}


// =====================================================
// ADMIN DASHBOARD
// =====================================================

export interface AdminDashboardResponse {

  totalUsers: number;

  totalBusinessOwners: number;

  totalTourists: number;


  // =========================
  // LICENSES
  // =========================

  totalLicenses: number;

  approvedLicenses: number;

  pendingLicenses: number;

  rejectedLicenses: number;


  // =========================
  // PERMITS
  // =========================

  totalPermits: number;

  approvedPermits: number;

  pendingPermits: number;

  rejectedPermits: number;


  // =========================
  // COMPLAINTS
  // =========================

  totalComplaints: number;

  resolvedComplaints: number;

  pendingComplaints: number;

  rejectedComplaints: number;


  // =========================
  // PAYMENTS
  // =========================

  totalPayments: number;

  approvedPayments: number;

  pendingPayments: number;

  rejectedPayments: number;

  totalRevenue: number;

}


// =====================================================
// REPORT
// =====================================================

export interface AnalyticsResponse {

  // =========================
  // LICENSES
  // =========================

  approvedLicenses: number;

  pendingLicenses: number;

  rejectedLicenses: number;


  // =========================
  // PERMITS
  // =========================

  approvedPermits: number;

  pendingPermits: number;

  rejectedPermits: number;


  // =========================
  // PAYMENTS
  // =========================

  approvedPayments: number;

  pendingPayments: number;

  rejectedPayments: number;


  // =========================
  // COMPLAINTS
  // =========================

  resolvedComplaints: number;

  pendingComplaints: number;

  rejectedComplaints: number;


  totalRevenue: number;

}


export type MonthlyRevenue =
  Record<string, number>;


export type MonthlyCount =
  Record<string, number>;


// =====================================================
// SERVICE
// =====================================================

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private http =
    inject(HttpClient);


  private api =
    `${environment.apiUrl}/analytics`;


  // =====================================================
  // BUSINESS OWNER DASHBOARD
  // =====================================================

  businessOwnerDashboard() {

    return this.http.get<BusinessDashboardResponse>(
      `${this.api}/business-owner`
    );

  }


  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================

  adminDashboard() {

    return this.http.get<AdminDashboardResponse>(
      `${this.api}/admin`
    );

  }


  // =====================================================
  // ADMIN REPORT
  // =====================================================

  reports() {

    return this.http.get<AnalyticsResponse>(
      `${this.api}/reports`
    );

  }


  // =====================================================
  // MONTHLY REVENUE
  // =====================================================

  monthlyRevenue() {

    return this.http.get<MonthlyRevenue>(
      `${this.api}/monthly-revenue`
    );

  }


  // =====================================================
  // MONTHLY LICENSES
  // =====================================================

  monthlyLicenses() {

    return this.http.get<MonthlyCount>(
      `${this.api}/monthly-licenses`
    );

  }


  // =====================================================
  // MONTHLY COMPLAINTS
  // =====================================================

  monthlyComplaints() {

    return this.http.get<MonthlyCount>(
      `${this.api}/monthly-complaints`
    );

  }


  // =====================================================
  // EXPORT PDF
  // =====================================================

  exportPdf() {

    return this.http.get(
      `${this.api}/export/pdf`,
      {
        responseType: 'blob'
      }
    );

  }


  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  exportExcel() {

    return this.http.get(
      `${this.api}/export/excel`,
      {
        responseType: 'blob'
      }
    );

  }

}