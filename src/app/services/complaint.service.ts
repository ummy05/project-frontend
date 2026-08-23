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


@Injectable({
  providedIn: 'root'
})
export class ComplaintService {


  // =====================================================
  // HTTP
  // =====================================================

  private http =
    inject(HttpClient);


  // =====================================================
  // API
  // =====================================================

  private api =
    `${environment.apiUrl}/complaints`;


  // =====================================================
  // TOURIST
  // CREATE COMPLAINT
  // POST /api/complaints
  // =====================================================

  create(data: any) {

    return this.http.post<any>(
      this.api,
      data
    );

  }


  // =====================================================
  // TOURIST
  // GET MY COMPLAINTS
  // GET /api/complaints/my
  // =====================================================

  getMyComplaints() {

    return this.http.get<any[]>(
      `${this.api}/my`
    );

  }


  // =====================================================
  // GET ALL COMPLAINTS
  // ADMIN
  // GET /api/complaints
  // =====================================================

  getAll() {

    return this.http.get<any[]>(
      this.api
    );

  }


  // =====================================================
  // GET PENDING COMPLAINTS
  // ADMIN
  // GET /api/complaints/pending
  // =====================================================

  getPending() {

    return this.http.get<any[]>(
      `${this.api}/pending`
    );

  }


  // =====================================================
  // GET COMPLAINT BY ID
  // =====================================================

  getById(
    id: number
  ) {

    return this.http.get<any>(
      `${this.api}/${id}`
    );

  }


  // =====================================================
  // MARK IN PROGRESS
  // ADMIN
  // PATCH /{id}/progress
  // =====================================================

  progress(
    id: number
  ) {

    return this.http.patch<any>(
      `${this.api}/${id}/progress`,
      {}
    );

  }


  // =====================================================
  // RESOLVE
  // ADMIN
  // PATCH /{id}/resolve
  // =====================================================

  resolve(
    id: number,
    response: string
  ) {

    return this.http.patch<any>(
      `${this.api}/${id}/resolve`,
      {
        response
      }
    );

  }


  // =====================================================
  // REJECT
  // ADMIN
  // PATCH /{id}/reject
  // =====================================================

  reject(
    id: number,
    response: string
  ) {

    return this.http.patch<any>(
      `${this.api}/${id}/reject`,
      {
        response
      }
    );

  }


  // =====================================================
  // DELETE
  // ADMIN ONLY
  // =====================================================

  delete(
    id: number
  ) {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

}