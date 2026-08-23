// src/app/services/notification.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';


// =====================================================
// NOTIFICATION MODEL
// =====================================================

export interface NotificationResponse {

  id: number;

  title: string;

  message: string;

  type: string;

  read: boolean;

  createdAt: string;

}


// =====================================================
// COMPATIBILITY MODEL
// Owner Dashboard / Owner Layout
// =====================================================

export interface NotificationItem extends NotificationResponse {}


// =====================================================
// NOTIFICATION SERVICE
// =====================================================

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private http = inject(HttpClient);

  private api =
    `${environment.apiUrl}/notifications`;


  // =====================================================
  // ADMIN - GET ALL NOTIFICATIONS
  // GET /api/notifications
  // =====================================================

  getAll() {

    return this.http.get<NotificationResponse[]>(
      this.api
    );

  }


  // =====================================================
  // GET MY NOTIFICATIONS
  // GET /api/notifications/my
  // =====================================================

  getMyNotifications() {

    return this.http.get<NotificationResponse[]>(
      `${this.api}/my`
    );

  }


  // =====================================================
  // GET UNREAD COUNT
  // GET /api/notifications/unread-count
  // =====================================================

  unreadCount() {

    return this.http.get<number>(
      `${this.api}/unread-count`
    );

  }


  // =====================================================
  // GET UNREAD COUNT - OWNER COMPATIBILITY METHOD
  // =====================================================

  getUnreadCount() {

    return this.unreadCount();

  }


  // =====================================================
  // MARK SINGLE NOTIFICATION AS READ
  // PATCH /api/notifications/{id}/read
  // =====================================================

  markRead(id: number) {

    return this.http.patch(
      `${this.api}/${id}/read`,
      {}
    );

  }


  // =====================================================
  // MARK ALL NOTIFICATIONS AS READ
  // PATCH /api/notifications/read-all
  // =====================================================

  markAllRead() {

    return this.http.patch(
      `${this.api}/read-all`,
      {}
    );

  }


  // =====================================================
  // DELETE NOTIFICATION
  // DELETE /api/notifications/{id}
  // =====================================================

  delete(id: number) {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

}