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


@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  private http =
    inject(HttpClient);


  private api =
    `${environment.apiUrl}/payments`;


  // =====================================================
  // OWNER
  // GET MY PAYMENTS
  // =====================================================

  getMyPayments(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.api}/my`
    );

  }


  // =====================================================
  // OWNER
  // MAKE PAYMENT
  // =====================================================

  makePayment(
    request: {
      controlNumber: string;
      amount: number;
      paymentMethod: string;
    }
  ): Observable<any> {

    return this.http.post<any>(
      this.api,
      request
    );

  }


  // =====================================================
  // GET PAYMENT BY ID
  // =====================================================

  getById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.api}/${id}`
    );

  }


  // =====================================================
  // ADMIN
  // GET ALL PAYMENTS
  // =====================================================

  getAll(): Observable<any[]> {

    return this.http.get<any[]>(
      this.api
    );

  }


  // =====================================================
  // ADMIN
  // GET PENDING PAYMENTS
  // =====================================================

  getPending(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.api}/pending`
    );

  }


  // =====================================================
  // ADMIN
  // APPROVE
  // =====================================================

  approve(
    id: number,
    remarks: string
  ): Observable<any> {

    return this.http.patch<any>(
      `${this.api}/${id}/approve`,
      {
        remarks: remarks
      }
    );

  }


  // =====================================================
  // ADMIN
  // REJECT
  // =====================================================

  reject(
    id: number,
    remarks: string
  ): Observable<any> {

    return this.http.patch<any>(
      `${this.api}/${id}/reject`,
      {
        remarks: remarks
      }
    );

  }


  // =====================================================
  // ADMIN
  // DELETE
  // =====================================================

  delete(
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.api}/${id}`
    );

  }

  

}