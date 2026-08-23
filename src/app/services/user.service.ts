// src/app/services/user.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private api =
    `${environment.apiUrl}/users`;


  // =====================================================
  // GET ALL USERS
  // =====================================================

  getAll() {

    return this.http.get<any[]>(
      this.api
    );
  }


  // =====================================================
  // GET USER BY ID
  // =====================================================

  getById(id: number) {

    return this.http.get<any>(
      `${this.api}/${id}`
    );
  }


  // =====================================================
  // UPDATE USER
  // =====================================================

  update(
    id: number,
    data: any
  ) {

    return this.http.put(
      `${this.api}/${id}`,
      data
    );
  }


  // =====================================================
  // CHANGE STATUS
  // =====================================================

  changeStatus(id: number) {

    return this.http.patch(
      `${this.api}/${id}/status`,
      {}
    );
  }


  // =====================================================
  // DELETE USER
  // =====================================================

  delete(id: number) {

    return this.http.delete(
      `${this.api}/${id}`
    );
  }


  // =====================================================
  // SEARCH
  // =====================================================

  search(keyword: string) {

    return this.http.get<any[]>(
      `${this.api}/search`,
      {
        params: {
          keyword
        }
      }
    );
  }


  // =====================================================
  // GET USERS BY ROLE
  // =====================================================

  role(role: string) {

    return this.http.get<any[]>(
      `${this.api}/role/${role}`
    );
  }


  // =====================================================
  // CREATE USER
  // =====================================================

  create(data: any) {

    return this.http.post(
      this.api,
      data
    );
  }

  // =====================================================
// UPLOAD MY PROFILE IMAGE
// =====================================================

uploadProfileImage(file: File) {

  const formData = new FormData();

  formData.append(
    'file',
    file
  );

  return this.http.post<any>(
    `${this.api}/me/profile-image`,
    formData
  );
}

}