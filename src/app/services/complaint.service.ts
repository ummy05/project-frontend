import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/complaints`;

  getAll() {
    return this.http.get<any[]>(this.api);
  }

  getPending() {
    return this.http.get<any[]>(`${this.api}/pending`);
  }

  getById(id:number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  progress(id:number) {
    return this.http.patch(
      `${this.api}/${id}/progress`,
      {}
    );
  }

  resolve(id:number,response:string) {

    return this.http.patch(
      `${this.api}/${id}/resolve`,
      {
        response
      }
    );

  }

  reject(id:number,response:string){

    return this.http.patch(
      `${this.api}/${id}/reject`,
      {
        response
      }
    );

  }

  delete(id:number){

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

}