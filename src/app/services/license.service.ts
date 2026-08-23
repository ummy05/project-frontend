// src/app/services/license.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environment/environment';
import { License } from '../models/license.model';

export interface LicenseApplicationRequest {

  businessName: string;

  phoneNumber: string;

  licenseType: string;

  district: string;

  location: string;

  durationMonths: number;

}

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/licenses`;


  // =====================================================
  // ADMIN
  // =====================================================

  getAll(): Observable<License[]> {

    return this.http.get<License[]>(
      this.api
    );

  }


  getPending(): Observable<License[]> {

    return this.http.get<License[]>(
      `${this.api}/pending`
    );

  }


  getById(id: number): Observable<License> {

    return this.http.get<License>(
      `${this.api}/${id}`
    );

  }


  approve(id: number): Observable<License> {

    return this.http.patch<License>(
      `${this.api}/${id}/approve`,
      {}
    );

  }


  reject(
    id: number,
    reason: string
  ): Observable<License> {

    return this.http.patch<License>(
      `${this.api}/${id}/reject`,
      {
        reason
      }
    );

  }


  delete(id: number): Observable<string> {

    return this.http.delete(
      `${this.api}/${id}`,
      {
        responseType: 'text'
      }
    );

  }


  // =====================================================
  // BUSINESS OWNER
  // =====================================================

  myLicenses(): Observable<License[]> {

    return this.http.get<License[]>(
      `${this.api}/my`
    );

  }


  // =====================================================
  // CALCULATE FEE
  // =====================================================

  calculateFee(
    type: string,
    durationMonths: number
  ): Observable<number> {

    return this.http.get<number>(
      `${this.api}/calculate-fee`,
      {
        params: {
          type,
          durationMonths: durationMonths.toString()
        }
      }
    );

  }


  // =====================================================
  // APPLY
  // =====================================================

  apply(
    data: LicenseApplicationRequest
  ): Observable<License> {

    return this.http.post<License>(
      `${this.api}/apply`,
      data
    );

  }


  // =====================================================
  // RENEW
  // =====================================================

  renew(
    id: number,
    months: number
  ): Observable<License> {

    return this.http.post<License>(
      `${this.api}/${id}/renew`,
      {},
      {
        params: {
          durationMonths: months.toString()
        }
      }
    );

  }


  // =====================================================
  // DOWNLOAD LICENSE PDF
  // =====================================================
// =====================================================
// DOWNLOAD LICENSE PDF
// =====================================================

downloadPdf(id: number): Observable<Blob> {

  return this.http.get(
    `${this.api}/${id}/pdf`,
    {
      responseType: 'blob'
    }
  );

}

}