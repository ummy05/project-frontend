import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../environment/environment';

import {
  Permit
} from '../models/permit.model';


@Injectable({
  providedIn: 'root'
})
export class PermitService {

  private http = inject(HttpClient);

  private api =
    `${environment.apiUrl}/permits`;


  // =====================================================
  // OWNER - GET MY PERMITS
  // =====================================================

  getMyPermits(): Observable<Permit[]> {

    return this.http.get<Permit[]>(
      `${this.api}/my`
    );

  }


  // =====================================================
  // OWNER - GET ONE PERMIT
  // =====================================================

  getById(
    id: number
  ): Observable<Permit> {

    return this.http.get<Permit>(
      `${this.api}/${id}`
    );

  }


  // =====================================================
  // OWNER - APPLY FOR PERMIT
  // =====================================================

  applyPermit(
    request: {
      permitType: Permit['permitType'];
      eventName: string;
      description: string;
      eventDate: string;
      eventTime: string;
      location: string;
      shehia: string;
    }
  ): Observable<Permit> {

    return this.http.post<Permit>(
      `${this.api}/apply`,
      request
    );

  }


  // =====================================================
  // OWNER - PAY PERMIT
  // =====================================================

  payPermit(
    request: {
      controlNumber: string;
      amount: number;
    }
  ): Observable<Permit> {

    return this.http.post<Permit>(
      `${this.api}/pay`,
      request
    );

  }


  // =====================================================
  // SHEHA - GET PERMITS
  // =====================================================

  getShehaPermits(): Observable<Permit[]> {

    return this.http.get<Permit[]>(
      `${this.api}/sheha`
    );

  }


  // =====================================================
  // APPROVE PERMIT
  // =====================================================

  approve(
    id: number
  ): Observable<Permit> {

    return this.http.patch<Permit>(
      `${this.api}/${id}/approve`,
      {}
    );

  }


  // =====================================================
  // REJECT PERMIT
  // =====================================================

  reject(
    id: number,
    remarks?: string
  ): Observable<Permit> {

    return this.http.patch<Permit>(
      `${this.api}/${id}/reject`,
      {
        remarks: remarks ?? ''
      }
    );

  }


  // =====================================================
  // ADMIN - GET ALL PERMITS
  // =====================================================

  getAllPermits(): Observable<Permit[]> {

    return this.http.get<Permit[]>(
      this.api
    );

  }


  // =====================================================
  // ADMIN - DELETE PERMIT
  // =====================================================

  deletePermit(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.api}/${id}`,
      {
        responseType: 'text'
      }
    );

  }

}