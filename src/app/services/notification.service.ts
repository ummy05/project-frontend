import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private http = inject(HttpClient);

  private api = 'http://localhost:8181/api/notifications';

  getAll(){
    return this.http.get<any[]>(this.api);
  }

  unreadCount(){
    return this.http.get<number>(`${this.api}/unread-count`);
  }

  markRead(id:number){
    return this.http.patch(`${this.api}/${id}/read`,{});
  }

  markAllRead(){

  return this.http.patch(

    `${this.api}/read-all`,
    {},

    {

      responseType:'text'

    }

  );

}

  delete(id:number){
    return this.http.delete(`${this.api}/${id}`);
  }

}